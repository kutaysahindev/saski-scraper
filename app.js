const axios = require("axios");
const cheerio = require("cheerio");
const dotenv = require("dotenv").config();
const fs = require("fs");
const twilio = require("twilio");

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const phone = process.env.PHONE;
const myPhone = process.env.MY_PHONE;

const client = new twilio(accountSid, authToken);

const url = "https://www.saski.gov.tr/sukesintileri/";

let previousData = "";

const fetchData = async () => {
  try {
    const result = await axios.get(url);
    return cheerio.load(result.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

const sendSMS = (message) => {
  client.messages
    .create({
      body: message,
      from: phone,
      to: myPhone,
    })
    .then((message) => console.log("SMS sent:", message.sid))
    .catch((error) => console.error("Error sending SMS:", error));
};

const scrapeData = async () => {
  const $ = await fetchData();
  if (!$) return [];

  const data = [];

  $("tr").each((i, elem) => {
    const tds = $(elem).find("td");
    const startDate = $(tds[0]).text().trim();
    const endDate = $(tds[1]).text().trim();
    const reason = $(tds[2]).text().trim();
    const location = $(tds[3]).text().trim();

    // Check if location includes the keyword that you want to filter locations by
    if (location.includes("")) {
      const row = `${startDate}, ${endDate}, ${reason}, ${location}`;
      data.push(row);
    }
  });

  return data;
};

const saveData = (data) => {
  try {
    // Read existing data from file, if any
    let existingData = [];
    try {
      existingData = JSON.parse(fs.readFileSync("data.txt", "utf8"));
    } catch (error) {
      // File might not exist yet, which is fine
    }

    // Append new data to existing data
    const newData = existingData.concat(data);

    // Write combined data back to file
    fs.writeFileSync("data.txt", JSON.stringify(newData, null, 2));
  } catch (error) {
    console.error("Error saving data:", error);
  }
};

const formatDataForSMS = (data) => {
  return data
    .map((entry) => {
      const [startDate, endDate, reason, location] = entry.split(", ");
      return `Kutay Su Uyarı Sistemi:\nBaşlangıç : ${startDate}\nBitiş: ${endDate}\nSebep: ${reason}\nKonum: ${location}`;
    })
    .join("\n\n");
};

const checkData = async () => {
  try {
    const newData = await scrapeData();

    // Read existing data from file, if any
    let existingData = [];
    try {
      existingData = JSON.parse(fs.readFileSync("data.txt", "utf8"));
      // console.log("Existing Data:", existingData);
    } catch (error) {
      // File might not exist yet, which is fine
    }

    // Check for new entries in newData
    const newEntries = newData.filter((entry) => !existingData.includes(entry));

    if (newEntries.length > 0) {
      const formattedData = formatDataForSMS(newEntries);
      // console.log("Formatted Data:", formattedData);
      sendSMS(formattedData);
      saveData(newData);
    }
  } catch (error) {
    console.error("Error checking data:", error);
  }
};

// Initial check
checkData();

// 5 minutes interval for periodic checks
setInterval(checkData, 300000);
