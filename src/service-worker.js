import {addLog, addUniqueAmazonJobs} from "./firebase/model.js"


chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "updated_amazon_jobs" && msg.payload?.amazon_jobs?.length) {
    msg.payload.amazon_jobs.forEach(item => {
      addUniqueAmazonJobs(item)
    })
  }
});

const targetURL = import.meta.env.VITE_AMAZON_JOB_URL || "https://www.jobsatamazon.co.uk/app#/jobSearch";
const interval = parseInt(import.meta.env.VITE_RELOAD_FREQUENCY_IN_SECONDS) * 1000;

let intervalId = null;

function findTabAndReload() {
  chrome.tabs.query({}, (tabs) => {
    const targetTab = tabs.find(tab => tab.url && tab.url.includes(targetURL));
    // console.log(`found id: ${targetTab.id}`)

    if (targetTab) {
      chrome.tabs.reload(targetTab.id);
      // console.log(`Reloaded tab with ID: ${targetTab.id}`);

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

// Start the interval when extension is installed or reloaded
chrome.runtime.onInstalled.addListener(() => {
  console.log("Auto Tab Reloader installed.");
  intervalId = setInterval(findTabAndReload, interval);
});

// Also start it when service worker wakes up (cold start)
// findTabAndReload();
intervalId = setInterval(findTabAndReload, interval);









