const ONLINE_SHEET_KEY = "1OJaJ-yJX6vDt6PtUcw4KK5T59JKYAAd4j0NkZext6Jo";
const DAILY_FIXING_SHEET_KEY = "1On8IDb0uBl6DKtH95yMSU2DkULE-IsDWwwc4L0ODXNs";

const internalSpan = document.getElementById("internal");
const netSpan = document.getElementById("net");

const lastUpdatedSpan = document.getElementById("lastUpdated");
const hoursAgo = document.getElementById("hoursAgo");

const sellList = document.getElementById("sell");
const buyList = document.getElementById("buy");

const sellPosCountElement = document.getElementById("numSoldPos");
const buyPosCountElement = document.getElementById("numBoughtPos");

const totalSoldElement = document.getElementById("totalSold");
const totalBoughtElement = document.getElementById("totalBought");

const avgSellElement = document.getElementById("avgSell");
const avgBuyElement = document.getElementById("avgBuy");

const sellPLCalc = document.getElementById("sellPL");

const unfixTable = document.getElementById("unfixTable");

const totalUnfixP = document.getElementById("totalUnfix");
const averageUnfixTargetP = document.getElementById("averageUnfixTarget");

const unfixedDiv = document.getElementById("unfixedSection");
const livePLDiv = document.getElementById("livePLSection");
const oldUnfixDiv = document.getElementById("oldUnfixSection");

const thisMonth = document.getElementById("currMonth");
const totalTrades = document.getElementById("totalTrades");
const profitTrades = document.getElementById("profitTrades");
const lossTrades = document.getElementById("lossTrades");
const tradingLoss = document.getElementById("tradingLoss");
const tradingProfit = document.getElementById("tradingProfit");
const grossProfit = document.getElementById("grossProfit");

let loader = `<div class="container">
<p>Calculating Profit/Loss</p>   
 <div class="progress2 progress-moved">
   <div class="progress-bar2" >
   </div>                       
 </div> 
</div>`;

livePLDiv.innerHTML = loader;

const lastUpdatedCell = "Summary!A1";

const internalPos = "Summary!C3";
const netPos = "Summary!C5";

const sellPosCount = "Summary!B9";
const buyPosCount = "Summary!C9";

const totalSold = "Summary!B10";
const totalBought = "Summary!C10";

const sellRange = "Summary!B11:B48";
const buyRange = "Summary!C11:C48";

const sellRangeDates = "Summary!A11:B48";
const buyRangeDates = "Summary!C11:D48";

const avgSell = "Summary!B50";
const avgBuy = "Summary!C50";

const totalSoldPlainText = "Summary!F50";
const totalBoughtPlainText = "Summary!G50";

const avgSoldPlainText = "Summary!D50";
const avgBoughtPlainText = "Summary!E50";

const unfixedRange = "UNFIXED!A2:C27";
const totalUnfixed = "UNFIXED!A30";
const averageFixingTarget = "UNFIXED!B30";
const averageFixingWithoutOld = "UNFIXED!A32:B32";

const monthlyStats = "Summary!C91:103";

var currentPrice;

let totalSoldNumber;
let totalBoughtNumber;

let avgSoldNumber;
let avgBoughtNumber;

function toggleUnfixed() {
  unfixedDiv.style.display = "flex";
  livePLDiv.style.display = "none";
  oldUnfixDiv.style.display = "none";
}

function togglePL() {
  unfixedDiv.style.display = "none";
  livePLDiv.style.display = "flex";
  oldUnfixDiv.style.display = "none";
}

function toggleOldUnfix() {
  unfixedDiv.style.display = "none";
  livePLDiv.style.display = "none";
  oldUnfixDiv.style.display = "flex";
}

axios
  .get(
    `https://sheets.googleapis.com/v4/spreadsheets/${ONLINE_SHEET_KEY}/values/${lastUpdatedCell}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
  )
  .then((resp) => {
    let data = resp.data.values[0][0];

    // the variable data above is a string in the format of "DAY MONTH DD YYYY HHMM"
    // we need to parse it to get the date and time
    // then we can calculate the hours ago

    // split the string by space and remove the last two elements
    let dateFormatted = data.split(" ").slice(0, -2).join(" ");

    let time24 = data.split(" ")[4];

    // convert 4 digit 24 hour to 12 hour time and add pm or am
    let timeFormatted = time24.slice(0, -2) + ":" + time24.slice(-2);
    console.log(timeFormatted);

    const dateParts = data.split(" ");
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Get the date components
    const month = months.indexOf(dateParts[1]);
    const day = parseInt(dateParts[2]);
    const year = parseInt(dateParts[3]);

    // Get the time components
    const militaryTime = parseInt(dateParts[4]);
    const hours = Math.floor(militaryTime / 100);
    const minutes = militaryTime % 100;

    // Create the date object and set the time
    const date = new Date(year, month, day);
    date.setHours(hours, minutes);

    // Calculate the time difference in minutes
    const timeDifference = Math.abs(date.getTime() - Date.now());
    const millisecondsPerMinute = 60000;

    if (timeDifference >= 60 * millisecondsPerMinute) {
      // Time difference is one hour or more, round to nearest hour
      const hoursDifference = Math.round(timeDifference / 3600000);

      //if the difference is greater than 24 hours, display days ago
      // else if the difference is less than 24 hours, display hours ago
      if (hoursDifference >= 24) {
        lastUpdatedSpan.innerHTML =  Math.round(hoursDifference / 24) + " days ago.";
      } else {
        lastUpdatedSpan.innerHTML =  hoursDifference + " hours ago.";
      }
    } else {
      // Time difference is less than one hour, round to nearest minute
      const minutesDifference = Math.round(
        timeDifference / millisecondsPerMinute
      );

      if (minutesDifference === 0) {
        lastUpdatedSpan.innerHTML =  "Just now.";
      } else {
        lastUpdatedSpan.innerHTML =  minutesDifference + " minutes ago.";
      }
      
    }

    // const timeDifference = Math.round(Math.abs((date.getTime() - Date.now()) / 3600000));

    // // 
    // //if timeDifference is less than 24 hours, display hours ago
    // //if timeDifference is more than 24 hours, display days ago
    // //if timeDifference is less than

    // if (timeDifference < 24) {
    //   lastUpdatedSpan.innerHTML =  timeDifference + " hours ago.";
    // } else {
    //   lastUpdatedSpan.innerHTML =  Math.round(timeDifference / 24) + " days ago.";
    // }

    hoursAgo.innerHTML = "(" + dateFormatted + " " + timeFormatted + ")";
  })
  .catch((err) => {
    console.error(err);
  });

async function goldPrice() {
  let resp = await axios.get("https://www.goldapi.io/api/XAU/USD", {
    headers: { "x-access-token": "goldapi-f20pyjatkuagctl5-io" },
  });
  return resp.data.price;
}

async function goldPrice2() {
  let resp = await axios.get(
    "https://marketdata.tradermade.com/api/v1/live?currency=XAUUSD&api_key=gUkkarv9QS3rDdC4nbNk"
  );
  return resp.data.quotes[0].ask;
}

function pad(idx) {
  idx = idx.toString();
  if (idx.length < 2) idx = "0" + idx;
  return idx;
}

function parseDate(str) {
  let monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  var ymd = str.split("-");
  return new Date("20" + ymd[2], monthNames.indexOf(ymd[1]), ymd[0]);
}

function dateDiff(first, second) {
  return Math.floor((second - first) / (1000 * 60 * 60 * 24));
}
goldPrice2()
  .then((price) => {
    currentPrice = price;
  })
  .catch((err) => {
    currentPrice = 0;
    console.log("Error failed to get price:", err);
  });

// LIST MAKER FUNCTION
function listMakerSell(list, content, idx) {
  if (content[1].length > 23) {
    var listedSellValue = content[1].slice(15, 23);
  } else {
    var listedSellValue = content[1].slice(14, 22);
  }
  const sellPrice = parseFloat(listedSellValue.replace(",", ""));

  const listItem = document.createElement("li");
  const positionDate = document.createElement("p");

  positionDate.classList.add("posDate");

  list.appendChild(positionDate);
  list.appendChild(listItem);

  if (content[1].length <= 23) {
    listItem.textContent = "\xa0" + content[1];
  } else {
    listItem.textContent = content[1];
  }

  const days = dateDiff(parseDate(content[0]), new Date());

  if (content[0] === "#N/A") {
    positionDate.textContent = "";
  } else if (days == 0) {
    positionDate.textContent =
      "\xa0\xa0\xa0\xa0" + content[0] + "\xa0\xa0\xa0" + "TODAY";
    positionDate.classList.add("yellowB");
  } else {
    positionDate.textContent =
      days == 1
        ? "\xa0\xa0\xa0\xa0" + content[0] + "\xa0\xa0\xa0" + "YESTERDAY"
        : "\xa0\xa0\xa0\xa0" + content[0] + "\xa0\xa0\xa0" + days + " days";
  }
  const signal = document.createElement("span");
  signal.classList.add("signalSign");

  listItem.appendChild(signal);

  setTimeout(() => {
    if (currentPrice > 0 && !isNaN(sellPrice)) {
      if (currentPrice > sellPrice) {
        signal.innerHTML = " &#128308;";
      } else {
        signal.innerHTML = " &#128994;";
      }
    } else {
      signal.innerHTML = "";
    }
  }, 1000);

  const indexVal = document.createElement("span");
  indexVal.classList.add("index");
  listItem.prepend(indexVal);
  indexVal.textContent = pad(idx + 1) + ".  ";
}

function listMakerBuy(list, content, idx) {
  if (content[0].length > 25) {
    var listedBuyValue = content[0].slice(17, 25);
  } else {
    var listedBuyValue = content[0].slice(16, 24);
  }

  const buyPrice = parseFloat(listedBuyValue.replace(",", ""));

  const listItem = document.createElement("li");
  const positionDate = document.createElement("p");

  positionDate.classList.add("posDate");

  list.appendChild(positionDate);
  list.appendChild(listItem);

  const days = dateDiff(parseDate(content[1]), new Date());

  if (content[1] === "#N/A") {
    positionDate.textContent = "";
  } else if (days == 0) {
    positionDate.textContent =
      "\xa0\xa0\xa0\xa0" + content[1] + "\xa0\xa0\xa0" + "TODAY";
    positionDate.classList.add("yellowB");
  } else {
    positionDate.textContent =
      days == 1
        ? "\xa0\xa0\xa0\xa0" + content[1] + "\xa0\xa0\xa0" + "YESTERDAY"
        : "\xa0\xa0\xa0\xa0" + content[1] + "\xa0\xa0\xa0" + days + " days";
  }

  if (content[0].length <= 25) {
    listItem.textContent = "\xa0" + content[0];
  } else {
    listItem.textContent = content[0];
  }

  const signal = document.createElement("span");
  signal.classList.add("signalSign");

  listItem.appendChild(signal);

  setTimeout(() => {
    if (currentPrice > 0 && !isNaN(buyPrice)) {
      if (currentPrice > buyPrice) {
        signal.innerHTML = " &#128994;";
      } else {
        signal.innerHTML = " &#128308;";
      }
    } else {
      signal.innerHTML = "";
    }
  }, 1000);

  const indexVal = document.createElement("span");
  indexVal.classList.add("index");
  listItem.prepend(indexVal);
  indexVal.textContent = pad(idx + 1) + ".  ";
}

function unfixedRowMaker(list) {
  const trow = document.createElement("tr");
  const td1 = document.createElement("td");
  const td2 = document.createElement("td");
  const td3 = document.createElement("td");

  unfixTable.appendChild(trow);
  trow.appendChild(td1);
  trow.appendChild(td2);
  trow.appendChild(td3);

  td1.textContent = list[0];
  td2.textContent = list[1];
  td3.textContent = list[2];
}

function unfixedTotalRow() {
  const trow = document.createElement("tr");
  const td = document.createElement("td");
  const trow2 = document.createElement("tr");
  const td2 = document.createElement("td");
  const trow3 = document.createElement("tr");
  const td3 = document.createElement("td");
  const trow4 = document.createElement("tr");
  const td4 = document.createElement("td");
  const trow5 = document.createElement("tr");
  const td5 = document.createElement("td");
  const trow6 = document.createElement("tr");
  const td6 = document.createElement("td");

  td.setAttribute("colspan", "3");
  td2.setAttribute("colspan", "3");
  td3.setAttribute("colspan", "3");
  td4.setAttribute("colspan", "3");
  td5.setAttribute("colspan", "3");
  td6.setAttribute("colspan", "3");

  unfixTable.appendChild(trow);
  unfixTable.appendChild(trow2);
  unfixTable.appendChild(trow3);
  unfixTable.appendChild(trow4);
  unfixTable.appendChild(trow5);
  unfixTable.appendChild(trow6);
  trow.appendChild(td);
  trow2.appendChild(td2);
  trow3.appendChild(td3);
  trow4.appendChild(td4);
  trow5.appendChild(td5);
  trow6.appendChild(td6);

  td.textContent = "TOTAL PENDING FIXING";
  td3.textContent = "AVERAGE FIXING TARGET";
  td5.textContent = "WITHOUT OLD POSITIONS";

  getTotalUnfixed().then((total) => {
    td2.textContent = total;
  });

  getUnfixedTarget().then((target) => {
    td4.textContent = target;
  });

  getUnfixedTargetWithoutOld().then((target) => {
    td6.textContent = `${target[0][0]} with avg. ${target[0][1]}`;
  });

  td.style.backgroundColor = "rgb(44, 44, 44)";
  td.style.color = "white";

  td3.style.backgroundColor = "rgb(44, 44, 44)";
  td3.style.color = "white";

  td2.style.color = "crimson";
  td2.style.fontWeight = "bold";
  td2.style.fontSize = "2.4rem";

  td4.style.color = "crimson";
  td4.style.fontWeight = "bold";
  td4.style.fontSize = "2.4rem";

  td5.style.backgroundColor = "rgb(44, 44, 44)";
  td5.style.color = "white";

  td6.style.color = "crimson";
  td6.style.fontWeight = "bold";
  td6.style.fontSize = "2rem";
}

// UNFIXED RANGE
// DAILY FIXING SHEET
axios
  .get(
    `https://sheets.googleapis.com/v4/spreadsheets/${DAILY_FIXING_SHEET_KEY}/values/${unfixedRange}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
  )
  .then((resp) => {
    resp.data.values.forEach((row) => {
      unfixedRowMaker(row);
    });
    unfixedTotalRow();
  })
  .catch((err) => {
    console.error(err);
  });

// TOTAL UNFIXED
// DAILY FIXING SHEET
async function getTotalUnfixed() {
  let resp = await axios.get(
    `https://sheets.googleapis.com/v4/spreadsheets/${DAILY_FIXING_SHEET_KEY}/values/${totalUnfixed}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
  );
  return resp.data.values[0][0];
}

// UNFIXED AVERAGE TARGET
// DAILY FIXING SHEET

async function getUnfixedTarget() {
  let resp = await axios.get(
    `https://sheets.googleapis.com/v4/spreadsheets/${DAILY_FIXING_SHEET_KEY}/values/${averageFixingTarget}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
  );
  return resp.data.values[0][0];
}

async function getUnfixedTargetWithoutOld() {
  let resp = await axios.get(
    `https://sheets.googleapis.com/v4/spreadsheets/${DAILY_FIXING_SHEET_KEY}/values/${averageFixingWithoutOld}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
  );
  return resp.data.values;
}

// TOTAL SOLD PLAIN TEXT
axios
  .get(
    `https://sheets.googleapis.com/v4/spreadsheets/${ONLINE_SHEET_KEY}/values/${totalSoldPlainText}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
  )
  .then((resp) => {
    totalSoldNumber = parseFloat(resp.data.values[0][0]);
  })
  .catch((err) => {
    console.error(err);
  });

// TOTAL BOUGHT PLAIN TEXT
axios
  .get(
    `https://sheets.googleapis.com/v4/spreadsheets/${ONLINE_SHEET_KEY}/values/${totalBoughtPlainText}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
  )
  .then((resp) => {
    totalBoughtNumber = parseFloat(resp.data.values[0][0]);
  })
  .catch((err) => {
    console.error(err);
  });

// AVG SOLD PLAIN TEXT
axios
  .get(
    `https://sheets.googleapis.com/v4/spreadsheets/${ONLINE_SHEET_KEY}/values/${avgSoldPlainText}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
  )
  .then((resp) => {
    avgSoldNumber = parseFloat(resp.data.values[0][0]);
  })
  .catch((err) => {
    console.error(err);
  });

// AVG BOUGHT PLAIN TEXT
axios
  .get(
    `https://sheets.googleapis.com/v4/spreadsheets/${ONLINE_SHEET_KEY}/values/${avgBoughtPlainText}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
  )
  .then((resp) => {
    avgBoughtNumber = parseFloat(resp.data.values[0][0]);
  })
  .catch((err) => {
    console.error(err);
  });

// INTERNAL POSITION
axios
  .get(
    `https://sheets.googleapis.com/v4/spreadsheets/${ONLINE_SHEET_KEY}/values/${internalPos}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
  )
  .then((resp) => {
    internalSpan.textContent = resp.data.values[0];
  })
  .catch((err) => {
    console.error(err);
  });

// NET POSITION
axios
  .get(
    `https://sheets.googleapis.com/v4/spreadsheets/${ONLINE_SHEET_KEY}/values/${netPos}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
  )
  .then((resp) => {
    netSpan.textContent = resp.data.values[0];
  })
  .catch((err) => {
    console.error(err);
  });

// -------------------- SELL SIDE START ---------------------

// // SELL POSITION COUNT
// axios
//   .get(
//     `https://sheets.googleapis.com/v4/spreadsheets/${ONLINE_SHEET_KEY}/values/${sellRange}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
//   )
//   .then((resp) => {
//     if (resp.data.values[0][0] === "#N/A") {
//       sellPosCountElement.textContent = 0;
//     } else {
//       sellPosCountElement.textContent = resp.data.values[0][0];
//     }
//   })
//   .catch((err) => {
//     console.error(err);
//   });

// TOTAL SOLD TT
axios
  .get(
    `https://sheets.googleapis.com/v4/spreadsheets/${ONLINE_SHEET_KEY}/values/${totalSold}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
  )
  .then((resp) => {
    totalSoldTTBars = resp.data.values[0];
    totalSoldElement.textContent = resp.data.values[0];
  })
  .catch((err) => {
    console.error(err);
  });

// SELL LIST
axios
  .get(
    `https://sheets.googleapis.com/v4/spreadsheets/${ONLINE_SHEET_KEY}/values/${sellRangeDates}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
  )
  .then((resp) => {
    resp.data.values.forEach((element, idx) => {
      listMakerSell(sellList, element, idx);
    });
  })
  .catch((err) => {
    console.error(err);
  });

// AVG SOLD PRICE
axios
  .get(
    `https://sheets.googleapis.com/v4/spreadsheets/${ONLINE_SHEET_KEY}/values/${avgSell}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
  )
  .then((resp) => {
    if (resp.data.values[0][0] === "#DIV/0!") {
      avgSellElement.textContent = "";
      avgPriceSoldTTBars = "Zero Buy Positions";
    } else {
      avgPriceSoldTTBars = resp.data.values[0];
      avgSellElement.textContent = "AVG SELL: " + resp.data.values[0];
    }
  })
  .catch((err) => {
    console.error(err);
  });

// -------------------- SELL SIDE END ---------------------

// ------------------

// -------------------- BUY SIDE START ---------------------

// BUY POSITION COUNT
// axios
//   .get(
//     `https://sheets.googleapis.com/v4/spreadsheets/${ONLINE_SHEET_KEY}/values/${buyRange}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
//   )
//   .then((resp) => {
//     console.log(resp.data.values);
//     if (resp.data.values[0][0] === "#N/A") {
//       buyPosCountElement.textContent = "NO BUY POSITIONS";
//     } else {
//       buyPosCountElement.textContent = "IN " + resp.data.values.length + " POSITIONS";
//     }
//   })
//   .catch((err) => {
//     console.error(err);
//   });

// TOTAL BOUGHT TT
axios
  .get(
    `https://sheets.googleapis.com/v4/spreadsheets/${ONLINE_SHEET_KEY}/values/${totalBought}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
  )
  .then((resp) => {
    totalBoughtElement.textContent = resp.data.values[0];
  })
  .catch((err) => {
    console.error(err);
  });

// BUY LIST
axios
  .get(
    `https://sheets.googleapis.com/v4/spreadsheets/${ONLINE_SHEET_KEY}/values/${buyRangeDates}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
  )
  .then((resp) => {
    resp.data.values.forEach((element, idx) => {
      listMakerBuy(buyList, element, idx);
    });
  })
  .catch((err) => {
    console.error(err);
  });

// AVG BUY PRICE
axios
  .get(
    `https://sheets.googleapis.com/v4/spreadsheets/${ONLINE_SHEET_KEY}/values/${avgBuy}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
  )
  .then((resp) => {
    if (resp.data.values[0][0] === "#DIV/0!") {
      avgBuyElement.textContent = "";
    } else {
      avgBuyElement.textContent = "AVG BUY: " + resp.data.values[0];
    }
  })
  .catch((err) => {
    console.error(err);
  });

// -------------------- BUY SIDE END ---------------------

// -------------------- Live Price --------------------
// const priceSpan = document.getElementById("price");

// var myHeaders = new Headers();
// myHeaders.append("x-access-token", "goldapi-f20pyjatkuagctl5-io");
// myHeaders.append("Content-Type", "application/json");

// var requestOptions = {
//   method: 'GET',
//   headers: myHeaders,
//   redirect: 'follow'
// };

// fetch("https://www.goldapi.io/api/XAU/USD", requestOptions)
//   .then(response => response.json())
//   .then(result => priceSpan.textContent = result.price)
//   .catch(error => console.log('error', error));

// -------------------- Closing Today --------------------

function getNum(arr) {
  const profit = arr.split("");

  if (profit[0] === "-") {
    profit.splice(1, 4);
  } else {
    profit.splice(0, 4);
  }

  for (let i = 0; i < profit.length; i++) {
    if (profit[i] === ",") {
      profit.splice(i, 1);
    }
  }

  let num = profit.join("");

  let retval = parseFloat(num);

  return retval;
}

function cardMaker(e, idx) {
  const totalProfit = getNum(e[3]);
  const perTT = getNum(e[4]);

  const divHolder = document.createElement("div");
  const num = document.createElement("h3");

  const cardDiv = document.createElement("div");
  const divr1 = document.createElement("div");
  const divr2 = document.createElement("div");
  const divr3 = document.createElement("div");
  const divr4 = document.createElement("div");
  const divr5 = document.createElement("div");
  // const divSep = document.createElement("br");

  divHolder.classList.add("divHolder");
  num.classList.add("numIdx");
  divHolder.appendChild(num);
  divHolder.appendChild(cardDiv);
  cardDiv.appendChild(divr1);
  cardDiv.appendChild(divr2);
  cardDiv.appendChild(divr3);
  cardDiv.appendChild(divr4);
  cardDiv.appendChild(divr5);
  // cardDiv.appendChild(divSep);

  cardDiv.classList.add("card");
  divr1.classList.add("row1");
  divr2.classList.add("row2");
  divr3.classList.add("row3");
  divr4.classList.add("row4");
  divr5.classList.add("row5");

  num.textContent = idx + 1;
  divr1.textContent = "Amount: " + e[0];
  divr2.textContent = "Buy Price: " + e[1];
  divr3.textContent = "Sell Price: " + e[2];
  divr4.textContent = "Profit: BD " + totalProfit.toFixed(3);
  divr5.textContent = "Per TT: BD " + perTT.toFixed(3);

  if (totalProfit > 0 && perTT > 0) {
    divr4.classList.add("rowProfit");
    divr5.classList.add("rowProfit");
  } else {
    divr4.classList.add("rowLoss");
    divr5.classList.add("rowLoss");
  }

  return divHolder;
}

const todaySection = document.getElementById("todaySec");

const amtToday = "Summary!B65:F85";

// Today Closing
axios
  .get(
    `https://sheets.googleapis.com/v4/spreadsheets/${ONLINE_SHEET_KEY}/values/${amtToday}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
  )
  .then((resp) => {
    if (resp.data.values[0][0] === "#N/A") {
      const noneP = document.createElement("p");
      noneP.classList.add("card");
      todaySection.appendChild(noneP);
      noneP.textContent = "None";
    } else {
      resp.data.values.forEach(function (e, idx) {
        todaySection.appendChild(cardMaker(e, idx));
      });
    }
  })
  .catch((err) => {
    console.error(err);
  });

const totalDailyP = "Summary!E88";
const totalDailyHTML = document.getElementById("dailyProfit");

// Total Daily Profit
axios
  .get(
    `https://sheets.googleapis.com/v4/spreadsheets/${ONLINE_SHEET_KEY}/values/${totalDailyP}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
  )
  .then((resp) => {
    const profitTot = getNum(resp.data.values[0][0]);

    if (isNaN(profitTot)) {
      totalDailyHTML.classList.add("hide");
    } else if (profitTot > 0) {
      totalDailyHTML.textContent = "Profit Today: BD " + profitTot.toFixed(3);
      totalDailyHTML.classList.add("rowProfit");
    } else {
      totalDailyHTML.textContent = "Loss Today: BD " + profitTot.toFixed(3);
      totalDailyHTML.classList.add("rowLoss");
    }
  })
  .catch((err) => {
    console.error(err);
  });

// MONTHLY PERFORMANCE

axios
  .get(
    `https://sheets.googleapis.com/v4/spreadsheets/${ONLINE_SHEET_KEY}/values/${monthlyStats}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
  )
  .then((resp) => {
    const monthlyProfitData = resp.data.values[0][0];
    const totalTradesData = resp.data.values[10][0];
    const profitTradesData = resp.data.values[2][0];
    const lossTradesData = resp.data.values[4][0];
    const tradingProfitData = resp.data.values[6][0];
    const tradingLossData = resp.data.values[8][0];
    const currentMonthData = resp.data.values[12][0];

    thisMonth.textContent = currentMonthData;
    totalTrades.textContent = totalTradesData;

    profitTrades.textContent = profitTradesData;
    profitTrades.style.color = "forestgreen";

    lossTrades.textContent = lossTradesData;
    lossTrades.style.color = "crimson";

    tradingLoss.textContent = tradingLossData;
    tradingLoss.style.color = "crimson";

    tradingProfit.textContent = tradingProfitData;
    tradingProfit.style.color = "forestgreen";

    grossProfit.textContent = monthlyProfitData;
    grossProfit.style.color =
      monthlyProfitData[0] === "B" ? "forestgreen" : "crimson";
  })
  .catch((err) => {
    console.error(err);
  });

// MONTHLY PERFORMANCE END

var liveSellTotalPL = 0;
var liveBuyTotalPL = 0;
var sellPositions = [];
var sellAmounts = [];
var buyPositions = [];
var buyAmounts = [];

const customProfit = (price) => {
  let sellCustomPL = 0;
  let buyCustomPL = 0;
  let customProfitAmount = 0;

  for (let i = 0; i < sellPositions.length; i++) {
    sellCustomPL += (sellPositions[i] - price) * sellAmounts[i] * 3.746 * 0.377;
  }

  for (let i = 0; i < buyPositions.length; i++) {
    buyCustomPL += (price - buyPositions[i]) * buyAmounts[i] * 3.746 * 0.377;
  }

  customProfitAmount = sellCustomPL + buyCustomPL;

  return customProfitAmount.toLocaleString("en-US", {
    style: "currency",
    currency: "BHD",
    minimumIntegerDigits: 5,
    maximumFractionDigits: 0,
    signDisplay: "exceptZero",
  });
};

const customSellProfit = (price) => {
  let sellCustomPL = 0;

  for (let i = 0; i < sellPositions.length; i++) {
    sellCustomPL += (sellPositions[i] - price) * sellAmounts[i] * 3.746 * 0.377;
  }

  return sellCustomPL.toLocaleString("en-US", {
    style: "currency",
    currency: "BHD",
    minimumIntegerDigits: 5,
    maximumFractionDigits: 0,
    signDisplay: "exceptZero",
  });
};

const customBuyProfit = (price) => {
  let buyCustomPL = 0;

  for (let i = 0; i < buyPositions.length; i++) {
    buyCustomPL += (price - buyPositions[i]) * buyAmounts[i] * 3.746 * 0.377;
  }

  return buyCustomPL.toLocaleString("en-US", {
    style: "currency",
    currency: "BHD",
    minimumIntegerDigits: 5,
    maximumFractionDigits: 0,
    signDisplay: "exceptZero",
  });
};

function getSellProfit(content) {
  if (content[0] === "#N/A") {
    return " ---------- -----------";
  }
  if (currentPrice) {
    if (content[0].length > 23) {
      var listedSellValue = content[0].slice(15, 23);
    } else {
      var listedSellValue = content[0].slice(14, 22);
    }
    let sellPrice = parseFloat(listedSellValue.replace(",", ""));

    sellPositions.push(sellPrice);

    if (content[0].length > 23) {
      var listedSellAmount = content[0].slice(0, 4);
    } else {
      var listedSellAmount = content[0].slice(0, 3);
    }

    let sellAmount = parseFloat(listedSellAmount);

    sellAmounts.push(sellAmount);

    let pAndL = (sellPrice - currentPrice) * sellAmount * 3.746 * 0.377;
    let perTT_PL = (sellPrice - currentPrice) * 3.746 * 0.377;

    liveSellTotalPL += pAndL;

    let formattedPL = pAndL.toLocaleString("en-US", {
      style: "currency",
      currency: "BHD",
      minimumIntegerDigits: 5,
      maximumFractionDigits: 0,
      signDisplay: "exceptZero",
    });

    let formattedPerTT = perTT_PL.toLocaleString("en-US", {
      style: "currency",
      currency: "BHD",
      minimumIntegerDigits: 3,
      maximumFractionDigits: 3,
      signDisplay: "exceptZero",
    });

    return formattedPL + formattedPerTT;
  } else {
    return "Error.     Refresh page.";
  }

  // if ((formattedPL.length = 11)) {
  //   return formattedPL + formattedPerTT;
  // } else {
  //   return "+" + formattedPL + formattedPerTT;
  // }
}

function getBuyProfit(content) {
  if (content[0] === "#N/A") {
    return " ---------- -----------";
  }
  if (currentPrice) {
    if (content[0].length > 25) {
      var listedBuyValue2 = content[0].slice(17, 25);
    } else {
      var listedBuyValue2 = content[0].slice(16, 24);
    }

    let buyPrice = parseFloat(listedBuyValue2.replace(",", ""));

    buyPositions.push(buyPrice);

    if (content[0].length > 25) {
      var listedBuyAmount = content[0].slice(0, 4);
    } else {
      var listedBuyAmount = content[0].slice(0, 3);
    }

    let buyAmount = parseFloat(listedBuyAmount);

    buyAmounts.push(buyAmount);

    let pAndL2 = (currentPrice - buyPrice) * buyAmount * 3.746 * 0.377;
    let perTT_PL = (currentPrice - buyPrice) * 3.746 * 0.377;

    liveBuyTotalPL += pAndL2;

    let formattedPL = pAndL2.toLocaleString("en-US", {
      style: "currency",
      currency: "BHD",
      minimumIntegerDigits: 5,
      maximumFractionDigits: 0,
      signDisplay: "exceptZero",
    });

    let formattedPerTT = perTT_PL.toLocaleString("en-US", {
      style: "currency",
      currency: "BHD",
      minimumIntegerDigits: 3,
      maximumFractionDigits: 3,
      signDisplay: "exceptZero",
    });

    return formattedPL + formattedPerTT;
  } else {
    return "Error.     Refresh page.";
  }
}

setTimeout(() => {
  axios
    .get(
      `https://sheets.googleapis.com/v4/spreadsheets/${ONLINE_SHEET_KEY}/values/${sellRange}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
    )
    .then((resp) => {
      livePLDiv.innerHTML = "";

      const livePLHeader = document.createElement("h1");
      livePLDiv.appendChild(livePLHeader);
      livePLHeader.innerHTML = "Live P/L for all<br>Open Positions";
      livePLHeader.classList.add("today");

      const infoP = document.createElement("p");
      livePLDiv.appendChild(infoP);
      infoP.innerHTML = `Calculated on live gold price of $${currentPrice}`;
      infoP.style.lineHeight = 1.2;
      infoP.style.fontWeight = 100;
      infoP.style.width = "80%";

      livePLDiv.appendChild(document.createElement("br"));
      livePLDiv.appendChild(document.createElement("br"));

      const plTable = document.createElement("table");
      livePLDiv.appendChild(plTable);

      const sellHeader = document.createElement("tr");
      plTable.appendChild(sellHeader);

      const sellLabel = document.createElement("td");
      sellHeader.appendChild(sellLabel);
      sellLabel.textContent = "SELL POSITIONS";
      sellLabel.colSpan = 3;

      const labelRow = document.createElement("tr");
      const th2 = document.createElement("th");
      const th3 = document.createElement("th");

      plTable.appendChild(labelRow);
      labelRow.appendChild(th2);
      labelRow.appendChild(th3);
      th2.textContent = "Profit/Loss";
      th3.textContent = "Per TT";

      th2.style.backgroundColor = "black";
      th3.style.backgroundColor = "black";

      th2.style.color = "white";
      th3.style.color = "white";

      resp.data.values.forEach((element, idx) => {
        const preRow = document.createElement("tr");
        const positionText = document.createElement("td");
        positionText.colSpan = 2;

        plTable.appendChild(preRow);
        preRow.appendChild(positionText);
        positionText.textContent =
          element[0] === "#N/A" ? "No Sell Positions" : element[0];
        // positionText.style.backgroundColor = "#0D3D56";
        positionText.style.color = "#333333";
        positionText.style.fontWeight = "bold";

        const trow = document.createElement("tr");
        const td2 = document.createElement("td");
        const td3 = document.createElement("td");

        trow.style.borderBottom = "3pt solid black";

        plTable.appendChild(trow);
        trow.appendChild(td2);
        trow.appendChild(td3);
        let data = getSellProfit(element);

        td2.textContent = data.slice(0, 11);
        td3.textContent = data.slice(11);

        if (data[0] === "+") {
          trow.style.color = "forestgreen";
        }
        if (data[0] === "-") {
          trow.style.color = "crimson";
        }

        // if (data[0] === "-") eachItem.style.color = "red";
        // if (data[0] === "+") eachItem.style.color = "green";
        // list.appendChild(eachItem);
        // eachItem.textContent = pad(idx + 1) + ". " + data;
      });

      let formattedTotalSellPL = liveSellTotalPL.toLocaleString("en-US", {
        style: "currency",
        currency: "BHD",
        minimumIntegerDigits: 5,
        maximumFractionDigits: 0,
        signDisplay: "exceptZero",
      });

      const totalRowLabel = document.createElement("tr");
      const tdTotal = document.createElement("td");

      plTable.appendChild(totalRowLabel);
      totalRowLabel.appendChild(tdTotal);
      totalRowLabel.style.borderTop = "3pt solid black";
      totalRowLabel.style.borderBottom = "3pt solid black";
      tdTotal.colSpan = 3;
      tdTotal.textContent =
        formattedTotalSellPL[0] === "+"
          ? `Total Profit: ${formattedTotalSellPL}`
          : `Total Loss: ${formattedTotalSellPL}`;
      tdTotal.style.fontSize = "2.1rem";
    })
    .catch((err) => {
      let p = document.createElement("p");
      livePLDiv.appendChild(p);
      p.textContent = "Error fetching sell position data. Refresh the page.";
      console.error(err);
    });
}, 1500);

setTimeout(() => {
  axios
    .get(
      `https://sheets.googleapis.com/v4/spreadsheets/${ONLINE_SHEET_KEY}/values/${buyRange}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
    )
    .then((resp) => {
      livePLDiv.appendChild(document.createElement("br"));
      livePLDiv.appendChild(document.createElement("br"));
      livePLDiv.appendChild(document.createElement("br"));
      livePLDiv.appendChild(document.createElement("br"));

      const plTable2 = document.createElement("table");
      livePLDiv.appendChild(plTable2);

      const buyHeader = document.createElement("tr");
      plTable2.appendChild(buyHeader);

      const buyLabel = document.createElement("td");
      buyHeader.appendChild(buyLabel);
      buyLabel.textContent = "BUY POSITIONS";
      buyLabel.colSpan = 3;

      const labelRow = document.createElement("tr");
      const th2 = document.createElement("th");
      const th3 = document.createElement("th");

      plTable2.appendChild(labelRow);
      labelRow.appendChild(th2);
      labelRow.appendChild(th3);

      th2.textContent = "Profit/Loss";
      th3.textContent = "Per TT";

      th2.style.backgroundColor = "black";
      th3.style.backgroundColor = "black";

      th2.style.color = "white";
      th3.style.color = "white";

      resp.data.values.forEach((element, idx) => {
        const preRow = document.createElement("tr");
        const positionText = document.createElement("td");
        positionText.colSpan = 2;

        plTable2.appendChild(preRow);
        preRow.appendChild(positionText);
        positionText.textContent =
          element[0] === "#N/A" ? "No Buy Positions" : element[0];
        // positionText.style.backgroundColor = "#0D3D56";
        positionText.style.color = "#333333";
        positionText.style.fontWeight = "bold";

        const trow = document.createElement("tr");
        const td2 = document.createElement("td");
        const td3 = document.createElement("td");

        trow.style.borderBottom = "3pt solid black";

        plTable2.appendChild(trow);
        trow.appendChild(td2);
        trow.appendChild(td3);
        let data = getBuyProfit(element);

        td2.textContent = data.slice(0, 11);
        td3.textContent = data.slice(11);

        if (data[0] === "+") {
          trow.style.color = "forestgreen";
        }
        if (data[0] === "-") {
          trow.style.color = "crimson";
        }

        // if (data[0] === "-") eachItem.style.color = "red";
        // if (data[0] === "+") eachItem.style.color = "green";
        // list.appendChild(eachItem);
        // eachItem.textContent = pad(idx + 1) + ". " + data;
      });

      let formattedTotalBuyPL = liveBuyTotalPL.toLocaleString("en-US", {
        style: "currency",
        currency: "BHD",
        minimumIntegerDigits: 5,
        maximumFractionDigits: 0,
        signDisplay: "exceptZero",
      });

      const totalRowLabel = document.createElement("tr");
      const tdTotal = document.createElement("td");

      totalRowLabel.style.borderTop = "3pt solid black";
      totalRowLabel.style.borderBottom = "3pt solid black";

      plTable2.appendChild(totalRowLabel);
      totalRowLabel.appendChild(tdTotal);
      tdTotal.colSpan = 3;
      tdTotal.textContent =
        formattedTotalBuyPL[0] === "+"
          ? `Total Profit: ${formattedTotalBuyPL}`
          : `Total Loss: ${formattedTotalBuyPL}`;
      tdTotal.style.fontSize = "2.1rem";
    })
    .catch((err) => {
      let p = document.createElement("p");
      livePLDiv.appendChild(p);
      p.textContent = "Error fetching buy position data. Refresh the page.";
      console.error(err);
    });
}, 2500);

var customBuy = document.createElement("p");
var customSell = document.createElement("p");

setTimeout(() => {
  livePLDiv.appendChild(document.createElement("br"));
  livePLDiv.appendChild(document.createElement("br"));
  livePLDiv.appendChild(document.createElement("br"));
  livePLDiv.appendChild(document.createElement("br"));

  livePLDiv.appendChild(customSell);
  livePLDiv.appendChild(customBuy);
  customBuy.innerHTML =
    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
  customSell.innerHTML =
    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

  livePLDiv.appendChild(document.createElement("br"));
  livePLDiv.appendChild(document.createElement("br"));

  const totalPL_Table = document.createElement("table");
  const row1 = document.createElement("tr");
  const row2 = document.createElement("tr");
  const row3 = document.createElement("tr");

  const total_Label = document.createElement("td");
  const totalPL = document.createElement("td");
  totalPL.setAttribute("id", "allProfitID");
  const allRow = document.createElement("td");
  allRow.setAttribute("id", "allBoxMiddleCell");

  livePLDiv.appendChild(totalPL_Table);
  totalPL_Table.appendChild(row1);
  totalPL_Table.appendChild(row2);
  totalPL_Table.appendChild(row3);

  row1.appendChild(total_Label);
  row2.appendChild(allRow);
  row3.appendChild(totalPL);

  total_Label.textContent = "All Open Positions";

  totalPL_Table.style.border = "2pt solid black";

  total_Label.style.fontSize = "2.1rem";

  const totalPLValue = liveBuyTotalPL + liveSellTotalPL;

  let formattedTotalPL = totalPLValue.toLocaleString("en-US", {
    style: "currency",
    currency: "BHD",
    minimumIntegerDigits: 5,
    maximumFractionDigits: 0,
    signDisplay: "exceptZero",
  });

  allRow.textContent =
    formattedTotalPL[0] === "+"
      ? `Total Profit at $${currentPrice}`
      : `Total Loss at $${currentPrice}`;
  allRow.style.backgroundColor = "black";
  allRow.style.color = "white";
  allRow.style.fontSize = "2.1rem";

  totalPL.textContent =
    totalPLValue === 0 ? `Error. Refresh Page.` : formattedTotalPL;

  totalPL.style.color = formattedTotalPL[0] === "+" ? "forestgreen" : "crimson";
  totalPL.style.fontSize = "2.3rem";
  totalPL.style.fontWeight = "bold";
  totalPL.style.fontStyle = "normal";
}, 3500);

setTimeout(() => {
  customProfit(currentPrice);

  const sliderDiv = document.createElement("div");
  livePLDiv.appendChild(sliderDiv);
  livePLDiv.appendChild(document.createElement("br"));
  livePLDiv.appendChild(document.createElement("br"));
  sliderDiv.classList.add("slidecontainer");
  sliderDiv.innerHTML =
    '<br><p id="demo"></p><input type="range" min="1700" max="2000" value="1850" class="slider" id="myRange">';

  var slider = document.getElementById("myRange");
  var output = document.getElementById("demo");
  let finalProfit = document.getElementById("allProfitID");
  let allBoxMiddle = document.getElementById("allBoxMiddleCell");

  let resetButton = document.createElement("button");
  resetButton.textContent = "Reset to Live P/L";
  resetButton.classList.add("reset");

  output.innerHTML = "Check Total P/L at any price."; // Display the default slider value

  // Update the current slider value (each time you drag the slider handle)
  slider.oninput = function () {
    livePLDiv.appendChild(resetButton);

    let selectedPrice = this.value;
    output.innerHTML = `Selected Price = $` + selectedPrice;

    let customPL = customProfit(selectedPrice);
    finalProfit.innerHTML = customPL;

    let customSellPL = customSellProfit(selectedPrice);
    customSell.textContent = `Sell Positions = ${customSellPL}`;
    if (customSellPL[0] === "B") {
      customSell.style.color = "gray";
    } else {
      customSell.style.color =
        customSellPL[0] === "+" ? "forestgreen" : "crimson";
    }

    let customBuyPL = customBuyProfit(selectedPrice);

    customBuy.textContent = `Buy Positions = ${customBuyPL}`;

    if (customBuyPL[0] === "B") {
      customBuy.style.color = "gray";
    } else {
      customBuy.style.color =
        customBuyPL[0] === "+" ? "forestgreen" : "crimson";
    }

    finalProfit.style.color = customPL[0] === "+" ? "forestgreen" : "crimson";

    allBoxMiddle.textContent =
      customPL[0] === "+"
        ? `Total Profit at $${selectedPrice}`
        : `Total Loss at $${selectedPrice}`;
  };

  resetButton.onclick = function () {
    output.innerHTML = "Check Total P/L at any price.";
    // document.getElementById("myRange").setAttribute('value', "1850");

    let livePL = customProfit(currentPrice);

    customBuy.textContent = "";
    customSell.textContent = "";

    finalProfit.innerHTML = livePL;
    finalProfit.style.color = livePL[0] === "+" ? "forestgreen" : "crimson";
    allBoxMiddle.textContent =
      livePL[0] === "+"
        ? `Total Profit at $${currentPrice}`
        : `Total Loss at $${currentPrice}`;
  };
}, 4500);
