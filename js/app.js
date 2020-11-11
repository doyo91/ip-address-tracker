// Production
let apiKey = "your_api_key";
const geolocationApiURL = "https://geo.ipify.org/api/v1";

// Development
if (API_KEY) {
  apiKey = API_KEY;
}

// Fetch reutilizable
const fetchData = (endpoint) =>
  fetch(endpoint)
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => alert("Error! something went wrong...", error));

const domainPattern = new RegExp("[www.]?.+.com(.[a-z]+)?");
const IPPattern = new RegExp(
  "^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
);
// Obtención de la data
async function getData(ipAddress) {
  let geolocationData;

  const userEndpoint = "https://api.ipify.org?format=json";
  // IP del user
  const userIP = await fetchData(userEndpoint);
  // Si existe una ip del buscador
  const ip = ipAddress || userIP.ip;

  const geolocationAddressEndpoint = `${geolocationApiURL}?apiKey=${apiKey}&ipAddress=${ip}`;

  const geolocationDomainEndpoint = `${geolocationApiURL}?apiKey=${apiKey}&domain=${ip}`;

  if (domainPattern.test(ip)) {
    geolocationData = await fetchData(geolocationDomainEndpoint);
  }

  if (IPPattern.test(ip)) {
    geolocationData = await fetchData(geolocationAddressEndpoint);
  }

  setViewMap(geolocationData.location.lat, geolocationData.location.lng);
  printData(geolocationData);
}

// Static Data (Seed dev)
// function getStaticData() {
//   const staticEndpoint = "./js/seedData.json";

//   fetch(staticEndpoint)
//     .then((response) => response.json())
//     .then((data) => {
//       setViewMap(data[0].location.lat, data[0].location.lng);
//       printData(data[0]);
//     });
// }

// Map container
const map = L.map("mapid", { zoomControl: false });

function setViewMap(lat, lng) {
  map.setView([lat, lng], 13);

  // Icon
  var locationIcon = L.icon({
    iconUrl: "./images/icon-location.svg",
    iconSize: [30, 45], // size of the icon
    iconAnchor: [15, 22.5], // point of the icon which will correspond to marker's location
  });
  L.marker([lat, lng], {
    icon: locationIcon,
  }).addTo(map);

  // Layer Map
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
  }).addTo(map);
}

// Search
const searchValue = document.getElementById("search");
const searchBtn = document.getElementById("submit");

function ValidateAddress(inputText) {
  if (domainPattern.test(inputText)) {
    return true;
  }

  if (IPPattern.test(inputText)) {
    return true;
  }
  return false;
}

function getInput(e) {
  e.preventDefault();

  let dataInput = searchValue.value.trim();

  const [http, https] = ["http://", "https://"];

  if (dataInput.startsWith(http)) {
    dataInput = dataInput.slice(http.length);
  } else if (dataInput.startsWith(https)) {
    dataInput = dataInput.slice(https.length);
  }

  dataInput =
    dataInput[dataInput.length - 1] === "/"
      ? dataInput.slice(0, dataInput.length - 1)
      : dataInput;

  if (!ValidateAddress(dataInput)) {
    invalidIP.style.display = "block";
    return;
  }
  getData(dataInput);
}

// Info containers
const ipAddress = document.getElementById("IP");
const loc = document.getElementById("location");
const timezone = document.getElementById("timezone");
const isp = document.getElementById("ISP");

// Render data in HTML
function printData(data) {
  ipAddress.innerHTML = data.ip;
  loc.innerHTML = `${data.location.city}, ${data.location.country} ${data.location.postalCode}  `;
  timezone.innerHTML = data.location.timezone;
  isp.innerHTML = data.isp;

  // clean search
  searchValue.value = "";
}

// Invalid IP
const invalidIP = document.querySelector(".invalid-ip");

// Events
searchBtn.addEventListener("click", getInput);
searchValue.addEventListener("focus", () => (invalidIP.style.display = "none"));

// getStaticData();
window.onload = getData();
