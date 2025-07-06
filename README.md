# OAuth Connections Viewer

OAuth Connections Viewer is a Chrome extension that allows you to view OAuth connection history (names, images) from various platforms such as Google, Naver, and Kakao at a glance.

<div style="display:flex;align-items:center;justify-content:center"> 
    <a href="https://github.com/kimhyunmook/OAuth-Connections-Viewer/releases">
        <img src="https://img.shields.io/badge/download-blue">
    </a>
</div>

## Key Features

- **Google, Naver, Kakao** account connected external service lists can be viewed at once
- Dark mode support and theme toggle
- Storage data deletion button provided
- Loading UI and login detection guidance
- **Search functionality** across all platforms with real-time filtering

---

## Installation

1. Download the ZIP file from <a href="https://github.com/kimhyunmook/OAuth-Connections-Viewer/releases"><img src="https://img.shields.io/badge/download-blue"></a>
2. Navigate to <a href="https://chrome://extensions">`chrome://extensions`</a> in Chrome browser
3. Enable **Developer mode** in the top right corner
4. Click "Load unpacked extension" and select the project folder
5. Once the extension is added, you can run it by clicking the icon in the top right corner of the browser

---

## How to Use

1. Click the extension icon to open the popup
2. Click the desired platform button (Google, Naver, Kakao) to view the list of connected services
3. Use the search box to find specific services across all platforms
4. Click "Delete Storage Data" button to delete all saved connection information
5. Dark mode/Light mode can be switched using the 🌙/☀️ button in the top right corner
6. If there is no connection information or login is required, a guidance message or notification will be displayed

### Search Features

- **Real-time search**: Start typing to search across all platforms
- **Highlighted results**: Search terms are highlighted in the results
- **Platform grouping**: Results are grouped by platform (Google, Naver, Kakao)
- **Minimum 2 characters**: Search activates after typing 2 or more characters

---

## Privacy Policy

- **<a href="https://kimhyunmook.github.io/oauth-policy/">View Privacy Policy</a>**

---

## Development and Contribution

- This project is developed based on TypeScript, Webpack, and Chrome Extension Manifest V3
- After modifying the code, bundle it with `npm install` → `npm run build`
- PRs and issues are welcome!

### Main Folder Structure

```
myOauth/
├── src/
│   ├── assets/         # Icons and images
│   ├── config/         # Platform-specific configurations
│   ├── helpers/        # Main logic and utilities
│   ├── styles/         # CSS files
│   ├── popup.html      # Popup UI
│   └── popup.ts        # Popup script
├── manifest.json       # Chrome extension configuration
├── README.md           # Documentation (English)
├── README.ko.md        # Documentation (Korean)
└── ...
```

---

## Screenshots

### Default

<img width="430" height="439" alt="Image" src="https://github.com/user-attachments/assets/d9c74e1c-bec3-415e-bf64-cce66de97a5f" />

### Loading OAuth List

<img width="442" height="617" alt="Image" src="https://github.com/user-attachments/assets/4ea510b6-f4e3-43fb-ba3d-a5afd1c83edb" />

### Login Required Alert

<img width="460" height="433" alt="Image" src="https://github.com/user-attachments/assets/4fb23a0d-4d95-482e-bb3a-2b76acfeefc9" />

### Storage Data Deletion

<img width="462" height="430" alt="Image" src="https://github.com/user-attachments/assets/7ab982e1-1f98-4288-9387-7e5260ba1642" />

## License

This project is licensed under the MIT License.

---

## Contact

- Please contact us through issues or PRs.

---

## Language

- [English](README.md) (Current)
- [한국어](README.ko.md)
