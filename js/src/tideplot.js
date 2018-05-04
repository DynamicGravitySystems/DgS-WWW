import Chart from 'chart.js';
import moment from 'moment';
import io from 'socket.io-client';

const chartOpts = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
        padding: {
            bottom: 50,
        }
    },
    scales: {
        xAxes: [{
            type: 'time',
            display: true,
            scaleLabel: {
                display: true,
                labelString: 'Time (Local)'
            },
            time: {
                min: Date.now(),
                max: Date.now(),
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
        line: {
            tension: 0,  // disable bezier curves
            pointRadius: 0,  // disable points at line intersections
            spanGaps: false
        }
    }
};

Chart.plugins.register({
    afterDraw: (chart) => {
        // Display message if no data is available
        if(chart.data.datasets[0].data.length === 0){
            const ctx = chart.chart.ctx;
            const width = chart.chart.width;
            const height = chart.chart.height;

            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = "26px 'Arial'";
            ctx.strokeStyle = 'red';
            ctx.fillStyle = 'red';
            ctx.fillText('No data to display, please check back later.', width / 2, height /2);
            ctx.restore();
        }
    }
});

function createChart(elementId){
    const ctx = document.getElementById(elementId);
    const chart  = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Gravity (Total Correction)',
                pointRadius: 0,
                fill: false,
                borderColor: '#3e95cd',
                data: []
            }]
        },
        options: chartOpts,
    });
    chart.pushCache = function(cache, dataSet=0){
        // Push an initial list of data
        cache.forEach((item, idx) => {
           this.data.datasets[dataSet].data.push(item.g0);
           this.data.labels.push(item.ts);
        });
        this.options.scales.xAxes[0].time.min = this.data.labels[0];
        this.options.scales.xAxes[0].time.max = this.data.labels.slice(-1)[0];
        this.update(0);
    };
    chart.pushData = function(data, dataSet=0){
        this.data.datasets[dataSet].data.push(data.g0);
        this.data.labels.push(data.ts);
        this.options.scales.xAxes[0].time.max = data.ts;
    };
    chart.shift = function(dataSet=0){
        this.data.datasets[dataSet].data.shift();
        this.data.labels.shift();
        this.options.scales.xAxes[0].time.min = this.data.labels[0];
    };
    return chart;
}

const displayLimit = 3600;
function listen(address){
    let socket = io(address);
    let hasData = false;
    let hasLoc = false;
    let cdata;
    const chart = createChart('tideChart');
    const dateFmt = "YYYY-MM-DD HH:mm:ss (zz)";
    socket.on('connect', () => {
        if (!hasData){
            console.log("Requesting cache");
            socket.emit('getcache', 3600);
            socket.emit('getloc');
        }
    }).on('cache', (cache) => {
        console.log("Received cache, length: " + cache.length);
        if (cache) {
            hasData = true;
            cdata = cache.slice(-1)[0];
            window.requestAnimationFrame(() => {
                chart.pushCache(cache);
                if (cdata) {
                    document.getElementById('currentTC').innerText = `${cdata.g0.toFixed(7)} mGals`;
                    document.getElementById('currentDate').innerText = `${moment.utc(cdata.ts).format(dateFmt)}`;
                }
            });
        }
    }).on('location', (loc) => {
        hasLoc = true;
        document.getElementById('coordinates').innerText = `Latitude: ${loc.latitude} Longitude: ${loc.longitude}`
    }).on('tc', (data) => {
        cdata = data;
        window.requestAnimationFrame(() => {
            chart.pushData(data);
            if (chart.data.datasets[0].data.length > displayLimit)
                chart.shift();
        });
        window.requestAnimationFrame(() => {
            document.getElementById('currentTC').innerText = `${cdata.g0.toFixed(7)} mGals`;
            document.getElementById('currentDate').innerText = `${moment.utc(cdata.ts).format(dateFmt)}`;
        });
        window.requestAnimationFrame(() => {
            chart.update(0);
        });
        if (!hasLoc){
            socket.emit('getLoc');
        }
    });
}

listen('http://localhost:3000/tide');