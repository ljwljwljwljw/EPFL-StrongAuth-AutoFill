let status_div = document.getElementById('status')
let work_div = document.getElementById('work')
let progress = document.getElementById('progress')
let tips = document.getElementById('tips')
let update = document.getElementById('update')
let html5QrcodeScanner = new Html5QrcodeScanner(
    "reader",
    {
        fps: 10, qrbox: { width: 600, height: 200 },
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_FILE]
    },
    /* verbose= */ false);

const delay = 1000;
var auth_code = null

function updateTotpCode() {
    if (auth_code == null) return
    const now = new Date()
    const second = now.getSeconds()
    progress.value = second % 30
    status_div.textContent = auth_code
    tips.textContent = "The auth code has been synchronized to your clipboard; you can now paste it anywhere."
}

function getAndUpdateTotpCode() {
    window.AuthAPI.getTotpCode().then((code) => {
        auth_code = code
        updateTotpCode()
    })
}

function renderQRScanner() {

    function onScanSuccess(decodedText, decodedResult) {
        const url = new URL(decodedText);
        const data = url.searchParams.get('data');
        window.AuthAPI.saveData(data).then((code) => {
            if (code != null) {
                html5QrcodeScanner.clear()
                work_div.style.visibility = "visible";
                auth_code = code
                updateTotpCode()
                setInterval(getAndUpdateTotpCode, delay)
            } else {
                // qr code is valid, but failed to generate auth-code
                status_div.textContent = "Error! Please Retry!"
            }
        })
    }

    function onScanFailure(error) {
        status_div.textContent = "Error! Please Retry!"
    }

    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
}


window.AuthAPI.getTotpCode().then((code) => {
    if (code == null) {
        work_div.style.visibility = "hidden";
        renderQRScanner()
    } else {
        auth_code = code
        updateTotpCode()
        setInterval(getAndUpdateTotpCode, delay)
    }
})

update.addEventListener("click", () => {
    window.AuthAPI.deleteData().then(() => {
        location.reload()
    })
})