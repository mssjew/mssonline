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

const internalPos = "Summary!C3";
const netPos = "Summary!C5";

const sellPosCount = "Summary!B9";
const buyPosCount = "Summary!C9";

const totalSold = "Summary!B10";
const totalBought = "Summary!C10";

const sellRange = "Summary!B11:B32";
const buyRange = "Summary!C11:C32";

const avgSell = "Summary!B34";
const avgBuy = "Summary!C34";

// LIST MAKER FUNCTION
function listMakerSell(list, content) {
  const listItem = document.createElement("li");
  list.appendChild(listItem);
  listItem.textContent = content;
  

}

function listMakerBuy(list, content) {
  const listItem = document.createElement("li");
  list.appendChild(listItem);
  listItem.textContent = content;
  
}

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

// SELL POSITION COUNT
axios
  .get(
    `https://sheets.googleapis.com/v4/spreadsheets/1OJaJ-yJX6vDt6PtUcw4KK5T59JKYAAd4j0NkZext6Jo/values/${sellRange}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
  )
  .then((resp) => {
    sellPosCountElement.textContent = resp.data.values.length;
  })
  .catch((err) => {
    console.error(err);
  });

// TOTAL SOLD TT
axios
  .get(
    `https://sheets.googleapis.com/v4/spreadsheets/1OJaJ-yJX6vDt6PtUcw4KK5T59JKYAAd4j0NkZext6Jo/values/${totalSold}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
  )
  .then((resp) => {
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
    resp.data.values.forEach((element) => {
      listMakerSell(sellList, element);
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
    avgSellElement.textContent = resp.data.values[0];
  })
  .catch((err) => {
    console.error(err);
  });

// -------------------- SELL SIDE END ---------------------

// ------------------

// -------------------- BUY SIDE START ---------------------

// BUY POSITION COUNT
axios
  .get(
    `https://sheets.googleapis.com/v4/spreadsheets/1OJaJ-yJX6vDt6PtUcw4KK5T59JKYAAd4j0NkZext6Jo/values/${buyRange}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
  )
  .then((resp) => {
    buyPosCountElement.textContent = resp.data.values.length;
  })
  .catch((err) => {
    console.error(err);
  });

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
    resp.data.values.forEach((element) => {
      listMakerBuy(buyList, element);
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
    avgBuyElement.textContent = resp.data.values[0];
  })
  .catch((err) => {
    console.error(err);
  });

// -------------------- BUY SIDE END ---------------------



// -------------------- Live Price --------------------
const priceSpan = document.getElementById("price");

var myHeaders = new Headers();
myHeaders.append("x-access-token", "goldapi-f20pyjatkuagctl5-io");
myHeaders.append("Content-Type", "application/json");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};


fetch("https://www.goldapi.io/api/XAU/USD", requestOptions)
  .then(response => response.json())
  .then(result => priceSpan.textContent = result.price)
  .catch(error => console.log('error', error));






// -------------------- Closing Today --------------------

function cardMaker(e) {

  function getNum(arr) {
    
    const profit = arr.split("");


    if (profit[0] === "-") {
      profit.splice(1, 4);
    } else {
      profit.splice(0, 4);
    }

    
    for (let i = 0; i < profit.length; i++){
        if (profit[i] === ",") {
          profit.splice(i,1);
        }
    }
  
    let num = profit.join('');
  
    let retval = parseFloat(num);

    return retval
  }


  const totalProfit = getNum(e[3]);
  const perTT = getNum(e[4]);

  const cardDiv = document.createElement("div");
  const divr1 = document.createElement("div");
  const divr2 = document.createElement("div");
  const divr3 = document.createElement("div");
  const divr4 = document.createElement("div");
  const divr5 = document.createElement("div");
  const divSep = document.createElement("br");
 
  
  cardDiv.appendChild(divr1);
  cardDiv.appendChild(divr2);
  cardDiv.appendChild(divr3);
  cardDiv.appendChild(divr4);
  cardDiv.appendChild(divr5);
  cardDiv.appendChild(divSep);


  cardDiv.classList.add("card");
  divr1.classList.add("row1");
  divr2.classList.add("row2");
  divr3.classList.add("row3");
  divr4.classList.add("row4");
  divr5.classList.add("row5");


  divr1.textContent = "Amount: " + e[0];
  divr2.textContent = "Buy Price: " + e[1];
  divr3.textContent = "Sell Price: " + e[2];
  divr4.textContent = "Profit: BD " + totalProfit;
  divr5.textContent = "Per TT: BD " + perTT;

  if (totalProfit > 0 && perTT > 0) {
    divr4.classList.add("rowProfit");
    divr5.classList.add("rowProfit");
  } else {
    divr4.classList.add("rowLoss");
    divr5.classList.add("rowLoss");
  }
  

  return cardDiv;
}


const todaySection = document.getElementById("todaySec");

const amtToday = "Summary!B49:F60";

// Today Closing
axios
  .get(
    `https://sheets.googleapis.com/v4/spreadsheets/1OJaJ-yJX6vDt6PtUcw4KK5T59JKYAAd4j0NkZext6Jo/values/${amtToday}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`
  )
  .then((resp) => {
    resp.data.values.forEach(function(e) {
      todaySection.appendChild(cardMaker(e));
    });
  })
  .catch((err) => {
    console.error(err);
  });