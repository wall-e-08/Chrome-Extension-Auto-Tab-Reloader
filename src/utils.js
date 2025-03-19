import {addLog} from "./firebase/model.js";

export const sha256 = async (message) => {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const sortObjByKey = obj => Object.keys(obj)
  .sort() // Sorts keys alphabetically
  .reduce((sortedObj, key) => {
    sortedObj[key] = obj[key];
    return sortedObj;
  }, {});

// Use Intl.DateTimeFormat to format for London (GMT/BST)
export const convertTimeToReadable = (date, locale="en-GB") => {
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };

  const formattedDate = new Intl.DateTimeFormat(locale, options).format(date)
  return formattedDate;
}

export const sendMailgunEmail = async (_location, _html) => {
  const formData = new FormData();
  formData.append('from',import.meta.env.VITE_MAILGUN_FROM);
  formData.append('to', import.meta.env.VITE_MAILGUN_TO);
  formData.append('subject', `✅ Amazon job at ${_location}`);
  formData.append('html', _html);
  formData.append('h:Priority', 'high');  // useless
  formData.append('h:X-Category', 'personal');  // useless

  const response = await fetch(import.meta.env.VITE_MAILGUN_URL, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa('api:' + import.meta.env.VITE_MAILGUN_API_KEY),  // Basic Auth for Mailgun
    },
    body: formData,
  });

  if (!response.ok) {
    await addLog(`Error sending email. Response status: ${response.status}`, "ERROR")
  }

  const respData = await response.json();
  await addLog(`Email sent: ${respData?.message || "-"}`, "DEBUG")
}