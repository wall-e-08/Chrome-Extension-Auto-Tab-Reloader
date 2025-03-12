import {addLog, addUniqueAmazonJobs} from "./firebase/model.js"
// import { config } from "./config.js";  // New config file with environment variables


const addReloadInfoInStorage = () => {
  chrome.storage.local.get(["totalReload"], result => {
    let totalReloads = result.totalReload
      , timeNow = new Date().toISOString();
    if (!totalReloads) {
      totalReloads = 1
    } else {
      totalReloads += 1
    }
    chrome.storage.local.set({ totalReload: totalReloads, lastReload: timeNow });

    if (totalReloads%10 === 0) {
      addLog(`Total ${totalReloads} reloads. Last: ${timeNow}`, "DEBUG")
    }
  });
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "updated_amazon_jobs" && msg.payload?.amazon_jobs?.length) {
    msg.payload.amazon_jobs.forEach(item => {
      addUniqueAmazonJobs(item)
    })
  }
});

const targetURL = import.meta.env.VITE_AMAZON_JOB_URL || "https://www.jobsatamazon.co.uk/app#/jobSearch";
const intervalInMinutes = parseInt(import.meta.env.VITE_RELOAD_FREQUENCY_IN_SECONDS || "90") / 60;

function findTabAndReload() {
  addReloadInfoInStorage()
  chrome.tabs.query({}, (tabs) => {
    const targetTab = tabs.find(tab => tab.url && tab.url.includes(targetURL));

    if (targetTab) {
      chrome.tabs.reload(targetTab.id);

      // Listen for tab update to inject content script after reload
      chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
        if (tabId === targetTab.id && info.status === 'complete') {
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ["assets/content.js"]
          });
          chrome.tabs.onUpdated.removeListener(listener); // Clean up listener
        }
      });
    } else {
      addLog(`Target tab not found.`, "ERROR")
    }
  });
}

// When extension is first installed
chrome.runtime.onInstalled.addListener(() => {
  // console.log("Auto Tab Reloader installed. <<ALARM TRIGGERED>>");
  // intervalId = setInterval(findTabAndReload, interval);
  chrome.alarms.create("reloadTabAlarm", {
    periodInMinutes: intervalInMinutes
  });
});

// When browser starts up
chrome.runtime.onStartup.addListener(() => {
  // console.log("chrome.runtime.onStartup. <<ALARM TRIGGERED>>");
  chrome.alarms.create("reloadTabAlarm", {
    periodInMinutes: intervalInMinutes
  });
});

// Alarm event listener
chrome.alarms.onAlarm.addListener((alarm) => {
  // console.log("chrome.alarms.onAlarm. <<findTabAndReload called!!>>");
  if (alarm.name === "reloadTabAlarm") {
    findTabAndReload();
  }
});
