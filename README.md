# CntaactSephireVideoSite

ConnectSphere is a Zoom/Microsoft Teams-style website with live browser meetings, a Contact Sales page, and a Chrome/Edge extension popup for hosting or joining meetings.

Live site:

https://zippy-griffin-e2deb1.netlify.app

## Features

- Modern video collaboration landing page
- Host Meeting and Join Meeting flows
- Live video meetings powered by Jitsi Meet
- Copyable meeting links and meeting IDs
- Contact Sales page with a Netlify-ready form
- Thank-you page after form submission
- Chrome/Edge browser extension for quick Host/Join actions
- Responsive design for desktop, tablet, and mobile

## Project Structure

```text
.
├── index.html          # Main website page
├── contact.html        # Contact Sales page
├── thank-you.html      # Form success page
├── styles.css          # Website styles
├── script.js           # Website interactions and meeting logic
├── README.md           # Project instructions
└── extension/
    ├── manifest.json   # Chrome extension config
    ├── popup.html      # Extension popup UI
    ├── popup.css       # Extension popup styles
    └── popup.js        # Extension popup behavior
```

## How The Website Works

The website is a static HTML/CSS/JavaScript site. It does not need Node.js, React, or a backend server.

The meeting feature uses the public Jitsi Meet embed script:

```html
<script src="https://meet.jit.si/external_api.js"></script>
```

When someone clicks **Host Meeting**, the site creates a meeting ID such as:

```text
team-sync-4821
```

The website then opens a Jitsi room using that ID. Another person can join by entering the same meeting ID or by opening the copied meeting link.

## Run Locally

From the project folder:

```bash
cd /Users/muhammadali/zoomSITE
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

To stop the local server, press `Control + C` in the terminal.

## Use Meetings

1. Open the website.
2. Go to the **Live meetings** section.
3. Click **Host Meeting** to create a new meeting.
4. Copy the meeting link or meeting ID.
5. Send it to another person.
6. The other person clicks the link or enters the meeting ID in **Join Meeting**.

The browser will ask for camera and microphone permission.

## Contact Sales Form

The Contact Sales page is:

```text
contact.html
```

The form is configured for Netlify Forms:

```html
<form name="contact-sales" method="POST" data-netlify="true" action="thank-you.html">
```

After deploying to Netlify, form submissions should appear in the Netlify dashboard under **Forms**.

## Deploy To Netlify

1. Go to https://www.netlify.com/
2. Sign in.
3. Open your site dashboard.
4. Drag and drop the project folder or upload the files.
5. Wait for Netlify to publish the site.
6. Open the public URL.

Current public URL:

```text
https://zippy-griffin-e2deb1.netlify.app
```

## Install The Browser Extension Locally

1. Open Chrome or Microsoft Edge.
2. Go to:

```text
chrome://extensions
```

3. Turn on **Developer mode**.
4. Click **Load unpacked**.
5. Select the `extension` folder:

```text
/Users/muhammadali/zoomSITE/extension
```

6. Click the extension icon.
7. Use **Host Meeting** or **Join Meeting**.

## How The Extension Works

The extension does not run the video call inside the popup. Instead, it opens the public website in a new browser tab.

The default website URL is set in:

```text
extension/popup.js
```

Current default:

```js
const defaultAppUrl = "https://zippy-griffin-e2deb1.netlify.app";
```

The extension popup also includes **Website settings**, where a user can change the website URL.

## Publish The Extension Publicly

To let everyone install it from the Chrome Web Store:

1. Go to the Chrome Web Store Developer Dashboard:

```text
https://chrome.google.com/webstore/devconsole
```

2. Create a developer account.
3. Pay Google's one-time developer registration fee.
4. Zip the `extension` folder.
5. Upload the zip file.
6. Add name, description, screenshots, icons, and privacy information.
7. Submit it for review.

After approval, people can install the extension from the Chrome Web Store.

## Update The Website

Edit these files:

- `index.html` for homepage content
- `contact.html` for the Contact Sales page
- `styles.css` for design
- `script.js` for meeting behavior
- `extension/popup.js` for extension behavior

After editing, redeploy the site on Netlify.

## Git Commands

Check changes:

```bash
git status
```

Add files:

```bash
git add .
```

Commit changes:

```bash
git commit -m "Update README"
```

Push to GitHub:

```bash
git push
```

Repository:

```text
https://github.com/Muhammad-Ali-611/CntaactSephireVideoSite
```
