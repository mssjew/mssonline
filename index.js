const str = "dddd";

const p = document.getElementById("tester");



axios.get("https://sheets.googleapis.com/v4/spreadsheets/1OJaJ-yJX6vDt6PtUcw4KK5T59JKYAAd4j0NkZext6Jo/values/Sep21!A1:B2?key=AIzaSyDmbXdZsgesHy5afOQOZSr9hgDeQNTC6Q4")
.then(resp => {
  console.log(resp);
  p.textContent = resp.data.majorDimension;
  

})
.catch(err => {
  console.error(err);
})