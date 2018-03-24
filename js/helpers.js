
function copyEmail(id){
    var emailAddr = document.getElementById(id);
    emailAddr.disabled = false;
    emailAddr.focus();
    emailAddr.select();
    try{
        document.execCommand('copy');
        M.toast({html: "Copied to clipboard"});
    } catch (err){
        console.log("Error copying to clipboard: " + err);
    } finally {
        emailAddr.disabled = true;
    }
}

const layout = {
    height: 500,
    paper_bgcolor: '#eeeeee',
    margin: {
        t: 50
    },
    xaxis: {
        title: 'Date/Time',
        autorange: true,
        type: 'date'
    },
    yaxis: {
        title: 'Gravity (mGals)',
        autorange: true,
        type: 'linear'
    }
};

const tzoffset = new Date().getTimezoneOffset(); // localtime offset from UTC
function getRange(date, offset){
    offset = offset || 10;
    const ot = new Date().setMinutes(date.getMinutes() - offset + tzoffset);
    const nt = new Date().setMinutes(date.getMinutes() + tzoffset);
    return [ot, nt];
}
function initPlot(id){
    const container = document.getElementById(id);

    Plotly.newPlot(container, [{
        mode: "lines",
        x: [new Date()],
        y: [0],
        line: {
            color: '#000000',
            width: 1
        }
    }], layout, {staticPlot: true, showLink: false});

    // socket.on('connect', function(){
    //     if(!prev_connection){
    //         console.log("Requesting initial data set.");
    //         socket.emit('getState', {});
    //         prev_connection = true;
    //     }
    // }).on('state', function(msg){
    //     console.log("Recv state msg");
    //     const xdata = [];
    //     const ydata = [];
    //     for(var i = 0, len = msg.data.length; i < len; i++){
    //         xdata.push(msg.data[i].time);
    //         ydata.push(msg.data[i].gravity);
    //     }
    //     Plotly.deleteTraces(container, 0);
    //     Plotly.plot(container, [{
    //         mode: "lines",
    //         x: xdata,
    //         y: ydata
    //     }], layout, {staticPlot: true}); // staticPlot: true disables user interaction (zoom pan etc)
    // }).on('data', function (data) {
    //     // todo: Batch recv data (every 10 seconds say, then plot each point by given interval)
    //     const time = new Date();
    //     const minuteView = {
    //         xaxis: {
    //             type: 'date',
    //             range: getRange(time, 10)
    //         }
    //     };
    //
    //     Plotly.relayout(container, minuteView);
    //     Plotly.extendTraces(container, {y: [[data.gravity]], x: [[data.time]]}, [0]);
    // });

}

window.onresize = function(ev){
    Plotly.Plots.resize(document.getElementById('plot-container'));

};