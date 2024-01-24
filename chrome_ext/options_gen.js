const base32 = require('hi-base32');
const scanner = require('html5-qrcode');
const payload = require("./MigrationPayload.js").MigrationPayload;

let html5QrcodeScanner = new scanner.Html5QrcodeScanner(
  "reader",
  { fps: 10, qrbox: {width: 250, height: 250},
    supportedScanTypes: [scanner.Html5QrcodeScanType.SCAN_TYPE_FILE] },
  /* verbose= */ false);

function parse_secret(buffer) {
    const msg = payload.decode(buffer);
    const obj = payload.toObject(msg);
    const secret = base32.encode(obj.otpParameters[0].secret);
    return secret;
}

function onScanSuccess(decodedText, decodedResult) {
  console.log(`Code matched = ${decodedText}`, decodedResult);
  const url = new URL(decodedText);
  const data = url.searchParams.get('data');
  const buffer = Buffer.from(data, 'base64');
  const secret = parse_secret(buffer);
  const status = document.getElementById('status');
  chrome.storage.sync.set({'secret': secret}).then(() => {
        status.textContent = 'Secret key updated: ' + secret;
        html5QrcodeScanner.clear();
  });
}
function onScanFailure(error) {
  console.warn(`Code scan error = ${error}`);
  const status = document.getElementById('status');
  chrome.storage.sync.set({'secret': secret}).then(() => {
        // Update status to let user know options were saved.
        status.textContent = 'Failed to read QR code.';
        setTimeout(() => {
          status.textContent = '';
        }, 750);
  });
}

const restoreOptions = () => {
  const status = document.getElementById('status');
  chrome.storage.sync.get("secret").then((result) => {
    if (result.secret != null) {
      status.textContent = "Current secret key: " + result.secret;
    } else {
      status.textContent = "Secret key not set!"
    }
  });
};

html5QrcodeScanner.render(onScanSuccess, onScanFailure);
document.addEventListener('DOMContentLoaded', restoreOptions);
