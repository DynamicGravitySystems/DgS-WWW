

if(Boolean(window.EventSource)){
    const ev = new EventSource("http://localhost:8080/test");
    ev.addEventListener('message', e => {
        console.log("Got message");
        console.log(e.data);
    });
    ev.addEventListener('open', event => {

    });

    ev.addEventListener('error', event => {

    });

} else {
    // SSE Not Supported - Use polling?
}



export function listener(){

}