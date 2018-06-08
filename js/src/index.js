import M from "materialize-css";

export function copyEmail(id){
    let emailAddr = document.getElementById(id);
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

export function validate(){
    const form = document.getElementById("email-form");
    if (form.reportValidity()){
        grecaptcha.reset();
        grecaptcha.execute();
    } else {
        return false;
    }
}

function resetForm(){
    document.querySelectorAll('.user-field').forEach(elem => {elem.value = ""});
}

export function setSubject(subject){
    const elem = document.getElementById('subject-input');
    elem.value = subject;
}

export function onEmailSubmit(token){
    const payload = {
        from: document.getElementById('email-input').value,
        name: document.getElementById('name-input').value,
        organization: document.getElementById('org-input').value,
        tel: document.getElementById('tel-input').value || 'None Provided',
        subject: document.getElementById('subject-input').value,
        message: document.getElementById('body-input').value,
        captcha: token
    };
    let http = new XMLHttpRequest();
    http.open("POST", MSG_ENDPOINT, true);
    http.onload = function () {
        console.log(http.response);
        M.toast({html: "Your message was sent!", displayLength: 4000});
        M.Modal.getInstance(document.querySelector('.modal')).close();
        resetForm();
    };
    http.onerror = function (ev) {
        console.log(ev);
        M.toast({html: "Error sending your message.", displayLength: 4000});
    };
    http.setRequestHeader("Content-type", "application/json");
    http.setRequestHeader("x-api-key", "07CMXBMMLw4Xo7KPSFY0e38HbVyUlPb58FwFbzgT");
    http.send(JSON.stringify(payload));
}

function initMaterialize(){
    M.Slider.init(document.querySelector('.slider'), {
        height: 400,
        full_width: true,
        indicators: false,
        interval: 12000
    });
    M.Materialbox.init(document.querySelectorAll('.materialboxed'));
    M.ScrollSpy.init(document.querySelectorAll('.scrollspy'));
    M.Modal.init(document.querySelectorAll('.modal'));
    M.FormSelect.init(document.querySelector('select'));
    M.Carousel.init(document.querySelector('.carousel'), {numVisible: 6, fullWidth: true, indicators: false});
    M.Tooltip.init(document.querySelectorAll('.tooltipped', {position: 'left'}));
    M.Sidenav.init(document.querySelectorAll('.sidenav'), {});
    return true;
}

export function setPushpin(top, offset, id){
    M.Pushpin.init(document.querySelector(id || '#toc'), {
        top: top || 840,
        offset: offset || 84
    });
}

export function toggleSidenav(){
    let instance = M.Sidenav.getInstance(document.querySelector('.sidenav'));
    if (instance.isOpen){
        instance.close();
    } else {
        instance.open();
    }

}

let captchaLoaded = false;
function loadCaptcha(){
    if (!captchaLoaded){
        grecaptcha.render('recaptcha', {
            'sitekey': CAPTCHA_KEY,
            'callback': onEmailSubmit
        });
        captchaLoaded = true;
    }
}

document.addEventListener("DOMContentLoaded", function(event){
    initMaterialize();
    // Dynamically load Google Captcha only when the Email button is clicked for the first time.
    document.querySelectorAll('.email-trigger').forEach(function(element){
        element.addEventListener('click', () => {
            loadCaptcha();
        })
    })
});
