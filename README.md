##  Auto tab reloader ()


# ⛮ Google Chrome Extension: Auto Tab Reloader
⚠️ Under development

**Auto Tab Reloader** is a Chrome extension currently in development that allows users to automatically reload the active tab at a specified interval to scrap data. This extension is specifically designed for Amazon Jobs to keep track of job listings and automatically refresh the job page to check for new job postings or updates.

---

## Features

- **Auto-reload active tab**: Set a timer to reload the active tab after a certain period.
- **Amazon Jobs support**: Designed specifically to work on Amazon Warehouse Jobs pages.
- **Customizable reload intervals**: Choose the time interval (in seconds) for reloading the tab.

---


## Requirements

- ### Node.js (20.9.0): For local build
- ### Firebase (11.4.0): For storage, local storage is under development
- ### Mailgun: For sending Email to get updated

---

## Installation

### 1. 🔽 Download the project:

- Clone or download the github project to your local machine.
- Create a copy of `.env.template`
- Rename it to `.env`
- Put your 🫣 secrets on that file

### 2. 👷🏽 Install and Build:

- `npm install`
- `npm run build`

### 3. ⚙️ Load the extension into Chrome:

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** (toggle in the top-right corner).
3. Click on **Load unpacked**.
4. Select the `dist` folder containing the extension files.

The extension will now be available in your Chrome browser.

---

## Usage

  The extension will automatically reload the active tab at the specified interval.

  Currently, this extension works only on **[Amazon Warehouse Jobs](https://www.jobsatamazon.co.uk/app#/jobSearch)** pages.

---

## Development

This extension is under active development. Here's how you can contribute:

### 1. Clone the repository:

```bash
git clone https://github.com/wall-e-08/auto-tab-reloader.git
```

### 2. Make your awesome contribution:

- Since this extension is currently under development and I have no idea what will be the final result, I welcome any type of your contribution.

### 3. Submit Pull Request:

- After making any changes submit a pull request.

---

## License

This project is licensed under the MIT License - see the [LICENSE](https://raw.githubusercontent.com/wall-e-08/Chrome-Extension-Auto-Tab-Reloader/refs/heads/master/LICENSE) file for details.
