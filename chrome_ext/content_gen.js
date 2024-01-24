chrome.storage.sync.get("secret").then((result) => {
    if (result.secret == null) {
        alert("Secret Key not set. Please upload QR code in extension options first!");
    } else {
        const key = result.secret;
        const TOTP = require('totp-generator');
        document.getElementById("totpkey").value = TOTP(key);
    }
});