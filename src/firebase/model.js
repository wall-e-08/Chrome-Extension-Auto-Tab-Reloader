import {doc, getDoc, setDoc, addDoc, collection} from "firebase/firestore";
import {convertTimeToReadable, sendMailgunEmail, sha256, sortObjByKey} from "../utils.js";
import {db} from "./init.js";


export const addLog = async (logText, logLevel="DEBUG") => {
  let emot = {
    DEBUG: '✅',
    WARNING: '⚠️',
    ERROR: '❌'
  };

  try {
    await addDoc(collection(db, process.env.FIRESTORE_COLLECTION_NAME__LOG), {
      level: logLevel,
      log: `${emot[logLevel]} ${logText}`,
      createdAt: new Date().toISOString()
    });
  } catch (e) {
    console.error("Error adding log: ", e);
  }
}

export const addUniqueAmazonJobs = async jobData => {
  try {
    const hashId = await sha256(JSON.stringify(sortObjByKey(jobData)));

    const jobRef = doc(db, process.env.FIRESTORE_COLLECTION_NAME__JOB, hashId);
    const docSnap = await getDoc(jobRef);

    if (docSnap.exists()) {
      console.warn("Job already exists with hash ID:", hashId);
    } else {
      await sendMailgunEmail(jobData.Location,
        `<h1>New jobData found at Amazon at ${convertTimeToReadable(new Date())}</h1>
          <span><b>Title:</b> <h4 style="display: inline">${jobData.Title}</h4></span>
          <p><b>Location:</b> ${jobData.Location}</p>
          <p><b>Pay:</b> ${jobData["Pay rate"]} ${jobData.Type}</p>
          <p><b>Type:</b> ${jobData.Type} (${jobData.Duration})</p>
          <p><a href=${process.env.AMAZON_JOB_URL || "https://www.jobsatamazon.co.uk/app#/jobSearch"}>
            Click to apply</a></p>
      `)

      await setDoc(jobRef, {
        ...jobData,
        dateTime: new Date().toISOString()
      });

      await addLog(`Job added with hash ID: ${hashId}`, "DEBUG");
    }
  } catch (e) {
    if (!(e instanceof Error)) {
      e = new Error(e);
    }
    await addLog(`Something wrong with firebase => ${e.name}: ${e.message}`, "ERROR")
  }
}