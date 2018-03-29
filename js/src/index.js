
export function copyEmail(id){
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

export function initMaterialize(){
    M.Slider.init(document.querySelector('.slider'), {
        height: 400,
        full_width: true,
        indicators: true,
        interval: 12000});
    M.Pushpin.init(document.querySelector('#toc'), {
        top: 650,
        offset: 64
    });
    M.Materialbox.init(document.querySelectorAll('.materialboxed'));
    M.ScrollSpy.init(document.querySelectorAll('.scrollspy'));
    M.Modal.init(document.querySelector('.modal'));
    M.FormSelect.init(document.querySelector('select'));
    return true;
}
