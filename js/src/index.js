
let captchaLoaded = false;


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

function loadCaptcha(){
    if (!captchaLoaded){
        console.log("Loading captcha");
        grecaptcha.render('recaptcha', {
            'sitekey': CAPTCHA_KEY,
            'callback': onEmailSubmit
        });
        captchaLoaded = true;
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
export function onEmailSubmit(token){
    const fromEmail = document.getElementById('email-input').value;
    const fromName = document.getElementById('name-input').value;
    const subject = document.getElementById('subject-input').value;
    const message = document.getElementById('body-input').value;
    const payload = {
        from: fromEmail,
        name: fromName,
        subject: subject,
        message: message,
        captcha: token
    };
    console.log(payload);
    let http = new XMLHttpRequest();
    http.open("POST", "https://api.dynamicgravitysystems.com/sendmail", true);
    http.onload = function () {
        M.toast({html: "Your message was sent!", displayLength: 4000});
        M.Modal.getInstance(document.querySelector('.modal')).close();
    };
    http.onerror = function (ev) {
        console.log(ev);
        M.toast({html: "Error sending your message.", displayLength: 4000});
    };
    http.setRequestHeader("Content-type", "application/json");
    http.send(JSON.stringify(payload));
}

export function initMaterialize(){
    M.Slider.init(document.querySelector('.slider'), {
        height: 400,
        full_width: true,
        indicators: true,
        interval: 12000});
    M.Pushpin.init(document.querySelector('#toc'), {
        top: 750,
        offset: 64
    });
    M.Materialbox.init(document.querySelectorAll('.materialboxed'));
    M.ScrollSpy.init(document.querySelectorAll('.scrollspy'));
    M.Modal.init(document.querySelectorAll('.modal'));
    M.FormSelect.init(document.querySelector('select'));
    M.Carousel.init(document.querySelector('.carousel'), {numVisible: 6, fullWidth: true, indicators: true});
    M.Tooltip.init(document.querySelectorAll('.tooltipped'));
    return true;
}

document.addEventListener("DOMContentLoaded", function(event){
    // Dynamically load Google Captcha only when the Email button is clicked.
    document.querySelectorAll('.email-trigger').forEach(function(element){
        element.addEventListener('click', () => {
            loadCaptcha();
        })
    })
});
