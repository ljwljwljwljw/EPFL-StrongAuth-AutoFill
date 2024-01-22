# EPFL-Strong-Authentication-AutoFill

A Chrome extension to automatically fill the strong authentication code for EPFL's email website.

## Export Secret Key from Google Authenticator
1. In the Google Authenticator app, tap **Menu** and then **Transfer accounts** and then **Export accounts**.
2. Take a screenshot of the QR code and copy it to your computer.

## Get the Chrome Extension
1. `git clone https://github.com/ljwljwljwljw/EPFL-StrongAuth-AutoFill`
2. Go to Extensions page by entering `chrome://extensions` in a new tab.
3. Enable Developer Mode by clicking the toggle switch next to **Developer mode**.
4. Click the **Load unpacked** button and select the `EPFL-StrongAuth-AutoFill/auto_fill` directory (sub folder `auto_fill` under `EPFL-StrongAuth-AutoFill`).
5. Click the **options**.
![](./options.png)
6. Upload the QRCode.
7. Go to `https://ewa.epfl.ch/`, after you enter the email and password, click login, the **Secure code** will be automatically filled!