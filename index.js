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
function listMaker(list, content) {
  const listItem = document.createElement("li");
  list.appendChild(listItem);
  listItem.textContent = content;
}

// INTERNAL POSITION 
axios.get(`https://sheets.googleapis.com/v4/spreadsheets/1OJaJ-yJX6vDt6PtUcw4KK5T59JKYAAd4j0NkZext6Jo/values/${internalPos}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`)
.then(resp => {
  internalSpan.textContent = resp.data.values[0];
})
.catch(err => {
  console.error(err);
})

// NET POSITION 
axios.get(`https://sheets.googleapis.com/v4/spreadsheets/1OJaJ-yJX6vDt6PtUcw4KK5T59JKYAAd4j0NkZext6Jo/values/${netPos}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`)
.then(resp => {
  netSpan.textContent = resp.data.values[0];
})
.catch(err => {
  console.error(err);
})


// -------------------- SELL SIDE START ---------------------

// SELL POSITION COUNT
axios.get(`https://sheets.googleapis.com/v4/spreadsheets/1OJaJ-yJX6vDt6PtUcw4KK5T59JKYAAd4j0NkZext6Jo/values/${sellRange}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`)
.then(resp => {
  sellPosCountElement.textContent = resp.data.values.length;
})
.catch(err => {
  console.error(err);
})

// TOTAL SOLD TT
axios.get(`https://sheets.googleapis.com/v4/spreadsheets/1OJaJ-yJX6vDt6PtUcw4KK5T59JKYAAd4j0NkZext6Jo/values/${totalSold}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`)
.then(resp => {
  totalSoldElement.textContent = resp.data.values[0];
})
.catch(err => {
  console.error(err);
})

// SELL LIST 
axios.get(`https://sheets.googleapis.com/v4/spreadsheets/1OJaJ-yJX6vDt6PtUcw4KK5T59JKYAAd4j0NkZext6Jo/values/${sellRange}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`)
.then(resp => {
  resp.data.values.forEach(element => {
    listMaker(sellList, element);
  });
})
.catch(err => {
  console.error(err);
})

// AVG SOLD PRICE
axios.get(`https://sheets.googleapis.com/v4/spreadsheets/1OJaJ-yJX6vDt6PtUcw4KK5T59JKYAAd4j0NkZext6Jo/values/${avgSell}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`)
.then(resp => {
  avgSellElement.textContent = resp.data.values[0];
})
.catch(err => {
  console.error(err);
})

// -------------------- SELL SIDE END ---------------------


// ------------------


// -------------------- BUY SIDE START ---------------------

// BUY POSITION COUNT
axios.get(`https://sheets.googleapis.com/v4/spreadsheets/1OJaJ-yJX6vDt6PtUcw4KK5T59JKYAAd4j0NkZext6Jo/values/${buyRange}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`)
.then(resp => {
  buyPosCountElement.textContent = resp.data.values.length;
})
.catch(err => {
  console.error(err);
})

// TOTAL BOUGHT TT
axios.get(`https://sheets.googleapis.com/v4/spreadsheets/1OJaJ-yJX6vDt6PtUcw4KK5T59JKYAAd4j0NkZext6Jo/values/${totalBought}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`)
.then(resp => {
  totalBoughtElement.textContent = resp.data.values[0];
})
.catch(err => {
  console.error(err);
})

// BUY LIST 
axios.get(`https://sheets.googleapis.com/v4/spreadsheets/1OJaJ-yJX6vDt6PtUcw4KK5T59JKYAAd4j0NkZext6Jo/values/${buyRange}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`)
.then(resp => {
  resp.data.values.forEach(element => {
    listMaker(buyList, element);
  });
})
.catch(err => {
  console.error(err);
})

// AVG BUY PRICE
axios.get(`https://sheets.googleapis.com/v4/spreadsheets/1OJaJ-yJX6vDt6PtUcw4KK5T59JKYAAd4j0NkZext6Jo/values/${avgBuy}?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4`)
.then(resp => {
  avgBuyElement.textContent = resp.data.values[0];
})
.catch(err => {
  console.error(err);
})

// -------------------- BUY SIDE END ---------------------



