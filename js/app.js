// Search
const searchAddress = document.getElementById("searchAddress");
const btnSearch = document.getElementById("submit");
// Info containers
const ipAddress = document.getElementById("IP");
const loc = document.getElementById("location");
const timezone = document.getElementById("timezone");
const isp = document.getElementById("ISP");
// Map container
const map = L.map("mapid", { zoomControl: false });

// Production
let api_key = "your_api_key";
let ip = "";
const url = "https://geo.ipify.org/api/v1";

// Development
if (API_KEY) {
  api_key = API_KEY;
}

function setLayerMap() {
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Con mapbox, se necesita token
  /*  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken: "Your token",
    }
  ).addTo(map); */
}

function setViewMap(data) {
  map.setView([data[0].location.lat, data[0].location.lng], 13);
  var locationIcon = L.icon({
    iconUrl: "./images/icon-location.svg",
    iconSize: [30, 45], // size of the icon
    iconAnchor: [15, 22.5], // point of the icon which will correspond to marker's location
  });
  L.marker([data[0].location.lat, data[0].location.lng], {
    icon: locationIcon,
  }).addTo(map);
}

// Obtención de la IP usuario
function getIP() {
  fetch("https://api.ipify.org?format=json")
    .then((response) => response.json())
    .then((data) => getAddress(data.ip));
}

// function requestLimit() {
//   fetch(`https://geo.ipify.org/service/account-balance?apiKey=${api_key}`, {
//     method: "GET",
//     mode: "no-cors",
//     credentials: "include",
//     headers: {
//       "Access-Control-Allow-Origin": "*",
//     },
//   })
//     .then((response) => response.json())
//     .then((data) => console.log(data.credits));
// }

// Llamada Api datos IP
function getAddress(ip) {
  if (ip) {
    fetch(`${url}?apiKey=${api_key}&ipAddress=${ip}`)
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((err) => {
        alert("Ops! algo no va bien...", err);
      });
  }
}

function getSeed() {
  fetch("./js/seedData.json")
    .then((response) => response.json())
    .then((data) => {
      printData(data);
      setViewMap(data);
    })
    .catch((error) => console.log(error));
}

function trackAddress(ip) {
  let addressToTrack = ip ? ip : address.value;

  if (validateAddress(addressToTrack)) {
    let cleanedAdderss = cleanAddress(addressToTrack);
    fetchAddress(cleanedAdderss);
  }
}

// Renderizado datos en el HTML
function printData(data) {
  ipAddress.innerHTML = data[0].ip;
  loc.innerHTML = `${data[0].location.city}, ${data[0].location.country} ${data[0].location.postalCode}  `;
  timezone.innerHTML = data[0].location.timezone;
  isp.innerHTML = data[0].isp;

  searchAddress.value = "";
}

// Buscador
btnSearch.onclick = trackAddress;
searchAddress.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    trackAddress();
  }
});

setLayerMap();
getSeed();
