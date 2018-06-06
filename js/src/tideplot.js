'use strict';

import Chart from 'chart.js';
import annotation from 'chartjs-plugin-annotation';
import moment from 'moment';
import Vue from 'vue/dist/vue.esm';

export let chart = null;
let updateInterval = null;

Storage.prototype.putObject = function (key, value) {
    try {
        sessionStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
        return false;
    }
    return true;
};
Storage.prototype.getObject = function (key) {
    try {
        let obj = sessionStorage.getItem(key);
        if (obj === null) {
            return null
        } else {
            return JSON.parse(obj);
        }
    } catch (e) {
        console.error(e);
        return null;
    }
};

const validator = /^[+-]?\d{1,3}\.?\d*$/;
// validator.exec()

// TODO: Validate lat/lon input is number
export const vue = new Vue({
    el: '#plot-controls',
    data: {
        validation: '^[+-]?\\d{1,3}\\.?\\d{0,6}$',
        loc: {
            lat: 39.9092,
            lon: -105.0748
        },
        channel: {
            total: true,
            lunar: false,
            solar: false
        },
        correction: {
            total: '',
            lunar: '',
            solar: '',
            time: '',
            timelocal: ''
        },
        endpoint: API_ENDPOINT,
        query: ``,
        paused: 'Pause'
    },
    methods: {
        updateLoc() {
            if(!validator.exec(this.loc.lat) || !validator.exec(this.loc.lon)){
                console.debug("Invalid input for lat/lon");
                return;
            }

            let query = `?lat=${this.loc.lat}&lon=${this.loc.lon}&increment=5min`;
            if (query !== this.query){
                this.query = query;
                localStorage.putObject('tidemeta', {latitude: this.loc.lat, longitude: this.loc.lon});
                plot(true);
            } else {
                console.debug("Location hasn't changed");
            }
        },
        reset() {
            this.loc.lat = 39.9092;
            this.loc.lon = -105.0748;
            this.updateLoc();

        },
        pause() {
            console.log("Pausing chart");
            this.paused = 'Resume'
        },
        toggleChannel(idx){
            chart.data.datasets[idx].hidden = !chart.data.datasets[idx].hidden;
            chart.update();
        }
    },
    created: function () {
        let meta = localStorage.getObject('tidemeta');
        if(meta){
            this.loc.lat = meta.latitude;
            this.loc.lon = meta.longitude;
        } else {
            localStorage.putObject('tidemeta', {latitude: this.loc.lat, longitude: this.loc.lon});
        }
        this.query = `?lat=${this.loc.lat}&lon=${this.loc.lon}&increment=5min`;
    }
});

const chartOpts = {
    responsive: true,
    showLines: false,
    maintainAspectRatio: false,
    animation: {
        duration: 0,
    },
    hover: {
        animationDuration: 0,
    },
    responsiveAnimationDuration: 0,
    layout: {
        padding: {
            bottom: 50,
        }
    },
    legend: {
        display: false,
        onClick: function(e, legendItem){
            // Do nothing, use Vue form to control lines
        }
    },
    scales: {
        xAxes: [{
            type: 'time',
            display: true,
            scaleLabel: {
                display: true,
                labelString: 'Time (UTC)'
            },
            time: {
                minUnit: 'hour',
            },
        }],
        yAxes: [{
            scaleLabel: {
                display: true,
                labelString: 'mGals'
            }
        }]
    },
    elements: {
        // line: {
        //     tension: 0,  // disable bezier curves
        // },
        point: {
            radius: 2,
        }
    },
    annotation: {
    }
};

const annote = {
    drawTime: 'afterDraw',
    annotations: [{
        id: 'ctime',
        type: 'line',
        mode: 'vertical',
        scaleID: 'x-axis-0',
        value: 1,
        borderColor: 'red',
        borderWidth: 2,
        label: {
            fontSize: 12,
            fontColor: '#fff',
            enabled: true,
            cornerRadius: 4,
            content: 'Current UTC',
            yAdjust: -300
        }
    }]
};

Chart.plugins.register({
    afterDraw: (chart) => {
        // Display message if no data is available
        if (chart.data.datasets[0].data.length === 0) {
            const ctx = chart.chart.ctx;  // The chart canvas
            const width = chart.chart.width;
            const height = chart.chart.height;

            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = "26px 'Arial'";
            ctx.strokeStyle = 'red';
            ctx.fillStyle = 'red';
            ctx.fillText('No data to display, please check back later.', width / 2, height / 2);
            ctx.restore();
        }
    }
});

function setVueData(label, datasets, index, precision=6){
    vue.correction.total = datasets[0].data[index].toFixed(precision);
    vue.correction.lunar = datasets[1].data[index].toFixed(precision);
    vue.correction.solar = datasets[2].data[index].toFixed(precision);
    let utc = moment.utc(label);
    vue.correction.time = utc.format('YYYY-MM-DD HH:mm:00') + ' (UTC)';
    vue.correction.timelocal = utc.local().format('YYYY-MM-DD HH:mm:00Z') + ' (Local)';
}

Chart.prototype.cindex = -1;

Chart.prototype.pushData = function (data) {
    // Clear data from chart and push new datasets
    for(let i=0; i<this.data.datasets.length; i++){
        this.data.datasets[i].data = [];
    }
    this.data.labels = [];
    data.forEach(item => {
        this.data.datasets[0].data.push(item.g0);
        if (item.gm)
            this.data.datasets[1].data.push(item.gm);
        if (item.gs)
            this.data.datasets[2].data.push(item.gs);
        this.data.labels.push(item.ts)
    });
    this.options.scales.xAxes[0].time.min = this.data.labels[0];
    this.options.scales.xAxes[0].time.max = this.data.labels.slice(-1)[0];
    this.cindex = this.findIndex(moment.utc());

    annote.annotations[0].value = this.data.labels[this.cindex];
    annote.annotations[0].label = {
        fontSize: 12,
        yAdjust: -300,
        enabled: true,
        content: moment.utc(this.data.labels[this.cindex]).format('HH:mm (UTC)')
    };
    this.options.annotation = annote;
    setVueData(this.data.labels[this.cindex], this.data.datasets, this.cindex);
};

Chart.prototype.length = function () {
    return this.data.labels.length;
};

Chart.prototype.findIndex = function(utctime, resolution='minute'){
    let center = Math.floor(this.length() / 2);
    let index = -1;
    for(let i=center; i<this.data.labels.length; i++){
        if (utctime.isSame(moment.utc(this.data.labels[i]), 'minute')){
            index = i;
            break;
        }
        if (utctime.isBetween(moment.utc(this.data.labels[i]), moment.utc(this.data.labels[i+1]), resolution)){
            index = i;
            break;
        }
    }
    return index;
};

Chart.prototype.updateSlicer = function() {
    let newIndex = this.findIndex(moment.utc());
    if (newIndex !== this.cindex){
        this.cindex = newIndex;
        let label = this.data.labels[this.cindex];
        setVueData(label, this.data.datasets, this.cindex);
        this.annotation.elements['ctime'].options.value = label;
        this.annotation.elements['ctime'].options.label.content = moment.utc(label).format('HH:mm (UTC)');
        this.update(0);
    } else {
        console.debug("Index hasn't changed");
    }
};

// Chart.prototype.showTooltip = function(dataset, point) {
//     if (this.tooltip._active === undefined) {
//         this.tooltip._active = [];
//     }
//     if (point === -1){
//         return;
//     }
//     let activeElem = this.tooltip._active;
//     let requestedElem = this.getDatasetMeta(dataset).data[point];
//     activeElem.forEach(item => {
//         if (requestedElem._index === item._index) {
//             console.log("Element is already active");
//             return 0;
//         }
//     });
//     activeElem.push(requestedElem);
//     this.tooltip._active = activeElem;
//     this.tooltip.update(true);
//     this.draw();
// };

function makeChart(id) {
    const elem = document.getElementById(id);
    return new Chart(elem, {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'Gravity (Total Correction)',
                    fill: false,
                    borderWidth: 0,
                    backgroundColor: '#3e95cd',
                    data: []
                },
                {
                    label: 'Gravity (Lunar)',
                    fill: false,
                    borderWidth: 0,
                    backgroundColor: '#FF0000',
                    data: [],
                    hidden: true
                },
                {
                    label: 'Gravity (Solar)',
                    fill: false,
                    borderWidth: 0,
                    backgroundColor: '#f4be35',
                    data: [],
                    hidden: true
                }
            ]
        },
        options: chartOpts,
    });
}

function fetchData(n = 1440, period=1) {
    return new Promise((resolve, reject) => {
        let request = vue.endpoint + vue.query + `&n=${n}&delta=${(n / 2) * period}`;
        console.log(`Fetching data with query: ${request}`);
        fetch(request).then(data => {
            return resolve(data.json());
        }).catch(err => {
            reject(err);
        })
    })
}

const jitter = 300;
function updatePlot() {
    console.log("Running update");
    let lastData = moment.utc(chart.data.labels.slice(-1)[0]);
    if(lastData.isBefore(moment.utc())){
        console.log("Ran out of data, requesting more");
        return plot();
    } else {
        chart.updateSlicer();
        let delta = moment.utc(chart.data.labels[chart.cindex+1]).diff(moment.utc());
        console.log("Setting new timeout to: " + delta);
        updateInterval = setTimeout(updatePlot, delta + jitter);
    }
}

function restoreChart(){
    // Restore chart from sessionStorage
    let data = sessionStorage.getObject('tidedata');
    if (data && moment.utc(data.slice(-1)[0].ts).isAfter(moment.utc().add(1, 'hours'))){
        console.debug("Data is still valid");
        chart.pushData(data);
        chart.update(0);
        updatePlot();
        return true;
    } else {
        return false;
    }

}

function plot(clear=false) {
    if (chart === null)
        chart = makeChart('tideChart');
    if(updateInterval){
        console.debug("Clearing update interval");
        clearInterval(updateInterval);
    }

    if(!clear && restoreChart()){
        console.debug("Restored plot from session data");
    } else {
        console.log("No session data available");
        fetchData(288, 5).then(list => {
            chart.pushData(list);
            chart.update(0);
            sessionStorage.putObject('tidedata', list);
            updatePlot();
        }).catch(err => {
            console.error(err);
        });
    }

    // if(sessionStorage.getObject('tidedata') !== null && !clear){
    //     let data = sessionStorage.getObject('tidedata');
    //     // Ensure that cached data has at least 1 hour of current data
    //     if (moment.utc(data.slice(-1)[0].ts).isAfter(moment().add(1, 'hours'))){
    //         chart.pushData(data);
    //         chart.update(0);
    //         updatePlot();
    //         return
    //     } else {
    //         console.log("New data will be requested");
    //     }
    // } else {
    //     console.log("No local session data available");
    // }
}

plot();
