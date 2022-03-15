const internalSpan = document.getElementById("internal");
const netSpan = document.getElementById("net");

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

const internalPos = "Summary!C3";
const netPos = "Summary!C5";

const sellPosCount = "Summary!B9";
const buyPosCount = "Summary!C9";

const totalSold = "Summary!B10";
const totalBought = "Summary!C10";

const sellRange = "Summary!B11:B48";
const buyRange = "Summary!C11:C48";

const avgSell = "Summary!B50";
const avgBuy = "Summary!C50";

const totalSoldPlainText = "Summary!F50";
const totalBoughtPlainText = "Summary!G50";

const avgSoldPlainText = "Summary!D50";
const avgBoughtPlainText = "Summary!E50";

const unfixedRange = "UNFIXED!A2:C33";
const totalUnfixed = "UNFIXED!A36";
const averageFixingTarget = "UNFIXED!B36";



let currentPrice;

let totalSoldNumber;
let totalBoughtNumber;

let avgSoldNumber;
let avgBoughtNumber;

// setTimeout(() => {
  
// }, 500);


// setTimeout(() => {


  
//   const soldDifference =  avgSoldNumber - currentPrice;

//   const plValueBHD = (soldDifference * totalSoldNumber * 3.7463)/2.6494990909256;

//   const plValueBHDString = plValueBHD.toFixed(3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); 

//   console.log(plValueBHDString);


 
  
//   sellPLCalc.innerHTML = `<h2>Online Sold</h2><p class="livePL">${totalSoldNumber} TT Sold > Avg Rate $${avgSoldNumber.toFixed(2)}</p><br>
//   <p class="livePL">Live ${plValueBHD>0?"Profit":"Loss"} if Closed Now: </p><br><p>BHD ${plValueBHDString}</p>`
// }, 2000);



async function goldPrice() {
  let resp = await axios.get("https://www.goldapi.io/api/XAU/USD", {
    headers: { "x-access-token": "goldapi-f20pyjatkuagctl5-io" },
  });
  return resp.data.price;
}

async function goldPriceHigh() {
  let resp = await axios.get("https://www.goldapi.io/api/XAU/USD", {
    headers: { "x-access-token": "goldapi-f20pyjatkuagctl5-io" },
  });
  return resp.data.high_price;
}

async function goldPriceLow() {
  let resp = await axios.get("https://www.goldapi.io/api/XAU/USD", {
    headers: { "x-access-token": "goldapi-f20pyjatkuagctl5-io" },
  });
  return resp.data.low_price;
}

function pad(idx) {
  idx = idx.toString();
  if (idx.length < 2) idx = "0" + idx;
  return idx;
}


goldPrice()
  .then((price) => {
    document.getElementById("liveGPrice").textContent = `$${price}`;
  })
  .catch((err) => {
    currentPrice = 0;
    console.log("Error failed to get price:", err);
  });



goldPrice()
  .then((price) => {
    currentPrice = price;
  })
  .catch((err) => {
    currentPrice = 0;
    console.log("Error failed to get price:", err);
  });


goldPriceHigh()
  .then((highPrice) => {
    document.getElementById("gPriceH").textContent = `$${highPrice}`;
  })
  .catch((err) => {
    console.log("Error failed to get high price:", err);
  });

  goldPriceLow()
  .then((lowPrice) => {
    document.getElementById("gPriceL").textContent = `$${lowPrice}`;
  })
  .catch((err) => {
    console.log("Error failed to get low price:", err);
  });

// LIST MAKER FUNCTION
function listMakerSell(list, content, idx) {
  if (content[0].length > 23) {
    var listedSellValue = content[0].slice(15, 23);
  } else {
    var listedSellValue = content[0].slice(14, 22);
  }
  const sellPrice = parseFloat(listedSellValue.replace(",", ""));

  const listItem = document.createElement("li");
  list.appendChild(listItem);

  if (content[0].length <= 23) {
    listItem.textContent = "\xa0" + content;
  } else {
    listItem.textContent = content;
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
  list.appendChild(listItem);

  if (content[0].length <= 25) {
    listItem.textContent = "\xa0" + content;
  } else {
    listItem.textContent = content;
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


// UNFIXED RANGE
// DAILY FIXING SHEET
axios
  .get(
    `https://sheets.googleapis.com/v4/spreadsheets/1On8IDb0uBl6DKtH95yMSU2DkULE-IsDWwwc4L0ODXNs/values/${unfixedRange}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
  )
  .then((resp) => {
    resp.data.values.forEach((row) => {
      unfixedRowMaker(row);
    });
  })
  .catch((err) => {
    console.error(err);
  });


// TOTAL UNFIXED 
// DAILY FIXING SHEET
axios
  .get(
    `https://sheets.googleapis.com/v4/spreadsheets/1On8IDb0uBl6DKtH95yMSU2DkULE-IsDWwwc4L0ODXNs/values/${totalUnfixed}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
  )
  .then((resp) => {
    totalUnfixP.textContent = resp.data.values[0][0];
  })
  .catch((err) => {
    console.error(err);
  });

// UNFIXED AVERAGE TARGET
// DAILY FIXING SHEET
axios
  .get(
    `https://sheets.googleapis.com/v4/spreadsheets/1On8IDb0uBl6DKtH95yMSU2DkULE-IsDWwwc4L0ODXNs/values/${averageFixingTarget}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
  )
  .then((resp) => {
    averageUnfixTargetP.textContent = resp.data.values[0][0];
  })
  .catch((err) => {
    console.error(err);
  });

// TOTAL SOLD PLAIN TEXT
axios
  .get(
    `https://sheets.googleapis.com/v4/spreadsheets/1OJaJ-yJX6vDt6PtUcw4KK5T59JKYAAd4j0NkZext6Jo/values/${totalSoldPlainText}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
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
    `https://sheets.googleapis.com/v4/spreadsheets/1OJaJ-yJX6vDt6PtUcw4KK5T59JKYAAd4j0NkZext6Jo/values/${totalBoughtPlainText}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
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
    `https://sheets.googleapis.com/v4/spreadsheets/1OJaJ-yJX6vDt6PtUcw4KK5T59JKYAAd4j0NkZext6Jo/values/${avgSoldPlainText}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
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
    `https://sheets.googleapis.com/v4/spreadsheets/1OJaJ-yJX6vDt6PtUcw4KK5T59JKYAAd4j0NkZext6Jo/values/${avgBoughtPlainText}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
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
    `https://sheets.googleapis.com/v4/spreadsheets/1OJaJ-yJX6vDt6PtUcw4KK5T59JKYAAd4j0NkZext6Jo/values/${internalPos}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
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
    `https://sheets.googleapis.com/v4/spreadsheets/1OJaJ-yJX6vDt6PtUcw4KK5T59JKYAAd4j0NkZext6Jo/values/${netPos}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
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
//     `https://sheets.googleapis.com/v4/spreadsheets/1OJaJ-yJX6vDt6PtUcw4KK5T59JKYAAd4j0NkZext6Jo/values/${sellRange}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
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
    `https://sheets.googleapis.com/v4/spreadsheets/1OJaJ-yJX6vDt6PtUcw4KK5T59JKYAAd4j0NkZext6Jo/values/${totalSold}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
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
    `https://sheets.googleapis.com/v4/spreadsheets/1OJaJ-yJX6vDt6PtUcw4KK5T59JKYAAd4j0NkZext6Jo/values/${sellRange}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
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
    `https://sheets.googleapis.com/v4/spreadsheets/1OJaJ-yJX6vDt6PtUcw4KK5T59JKYAAd4j0NkZext6Jo/values/${avgSell}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
  )
  .then((resp) => {
    if (resp.data.values[0][0] === "#DIV/0!") {
      avgSellElement.textContent = "";
      avgPriceSoldTTBars = "Zero Buy Positions";
    } else {
      avgPriceSoldTTBars = resp.data.values[0];
      avgSellElement.textContent = "AVG SELL: "+resp.data.values[0];
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
//     `https://sheets.googleapis.com/v4/spreadsheets/1OJaJ-yJX6vDt6PtUcw4KK5T59JKYAAd4j0NkZext6Jo/values/${buyRange}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
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
    `https://sheets.googleapis.com/v4/spreadsheets/1OJaJ-yJX6vDt6PtUcw4KK5T59JKYAAd4j0NkZext6Jo/values/${totalBought}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
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
    `https://sheets.googleapis.com/v4/spreadsheets/1OJaJ-yJX6vDt6PtUcw4KK5T59JKYAAd4j0NkZext6Jo/values/${buyRange}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
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
    `https://sheets.googleapis.com/v4/spreadsheets/1OJaJ-yJX6vDt6PtUcw4KK5T59JKYAAd4j0NkZext6Jo/values/${avgBuy}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
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
    `https://sheets.googleapis.com/v4/spreadsheets/1OJaJ-yJX6vDt6PtUcw4KK5T59JKYAAd4j0NkZext6Jo/values/${amtToday}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
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
    `https://sheets.googleapis.com/v4/spreadsheets/1OJaJ-yJX6vDt6PtUcw4KK5T59JKYAAd4j0NkZext6Jo/values/${totalDailyP}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
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
