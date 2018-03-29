import Chart from 'chart.js';
import io from 'socket.io-client';

var dataWindow = 900000;

const chartOpts = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
        padding: {
            bottom: 25,
        }
    },
    scales: {
        xAxes: [{
            type: 'time',
            display: true,
            scaleLabel: {
                display: true,
                labelString: 'Date'
            },
            time: {
                min: new Date(Date.now() - dataWindow),
                max: Date.now(),
                displayFormats: {
                    second: 'HH:mm:ss'
                },
                unit: 'second',
            }
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
        if(chart.data.datasets[0].data.length === 0){
            const ctx = chart.chart.ctx;
            const width = chart.chart.width;
            const height = chart.chart.height;
            // chart.clear();

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

function initChart(elementId){
    const ctx = document.getElementById(elementId);
    const chart  = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Gravity (Free Air)',
                pointRadius: 0,
                fill: false,
                borderColor: '#3e95cd',
                data: []
            }]
        },
        options: chartOpts,
    });
    chart.pushData = function(data, dataSet=0, update=false){
        this.data.datasets[dataSet].data.push(data);
        this.data.labels.push(data.x);
        this.options.scales.xAxes[0].time.min = Date.now() - dataWindow;
        this.options.scales.xAxes[0].time.max = Date.now();
        if (update) this.update(0);
    };
    chart.shift = function(dataSet=0){
        this.data.datasets[dataSet].data.shift();
        this.data.labels.shift();
    };

    return chart;
}

const displayLimit = 15 * 60;
const queue = [];
export function listen(address){
    let socket;
    try{
        socket = io(address);
    } catch (e){
        console.log("Error creating socket connection.");
        return;
    }
    let hasData = false;
    let bufferLen = 0;
    let dataRate = 1;
    const chart = initChart('gravChart');
    socket.on('connect', () => {
        if (!hasData){
            socket.emit('getState');
        }
    }).on('state', (state) => {
        console.log("Received state from server: ", state);
        document.getElementById('gravChartTitle').innerText = `${state.name} Live Data (${state.rate}Hz)`;
        hasData = true;
        bufferLen = state.buffer || 1;
        dataRate = state.rate || 1;
        chart.pushData(state.data);
        chart.update(0);
    }).on('data', (data) => {
        chart.pushData(data);
        if (chart.data.datasets[0].data.length > displayLimit)
            chart.shift();
        chart.update(0);
    });

    setInterval(() => {

    }, 1000 / dataRate)
}
