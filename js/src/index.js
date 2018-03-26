
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
