// Address exists
function validateAddress(address) {
  if (!address) {
    alert("📢 Indicate some address");
    return false;
  }
  return true;
}

// Clean address
function cleanAddress(address) {
  address = address.trim();

  const [http, https] = ["http://", "https://"];

  if (address.startsWith(http)) {
    address = address.slice(http.length);
  } else if (address.startsWith(https)) {
    address = address.slice(https.length);
  }

  return address[address.length - 1] === "/"
    ? address.slice(0, address.length - 1)
    : address;
}

function trackAddress(ip) {
  let addressToTrack = ip ? ip : address.value;

  if (validateAddress(addressToTrack)) {
    let cleanedAdderss = cleanAddress(addressToTrack);
    getData(cleanedAdderss);
  }
}

function requestLimit() {
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
}

import { fetchIP, fetchDomain } from "../api/api.js";
import { header } from "../app.js";
import { initMap, customMarker } from "./initMap.js";

const mainCards = document.querySelectorAll(".block-content__content");
let mymap = L.map("mapid").setView([37.4223, -122.085], 13);
initMap(mymap)();

export const sendFetch = (inputValue) => {
  if (header.lastChild == document.querySelector(".form__error"))
    document.querySelector(".form__error").remove();
  const domainPattern = /[www.]?.+\.com(\.[a-z]+)?/g;
  const IPPattern = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/g;

  if (domainPattern.test(inputValue)) {
    fetchDomain(inputValue).then((res) => {
      _populateMainCard(res);
      _moveMap(res);
    });
  }

  if (IPPattern.test(inputValue)) {
    fetchIP(inputValue).then((res) => {
      _populateMainCard(res);
      _moveMap(res);
    });
  }
};

const _populateMainCard = (res) => {
  const populate = [
    res.ip,
    `${res.location.city}, ${res.location.country}, ${res.location.region}`,
    res.location.timezone,
    res.isp,
  ];

  mainCards.forEach((mainCard, index) => {
    mainCard.textContent = "";
    mainCard.textContent = populate[index];
  });
};

const _moveMap = (res) => {
  mymap.flyTo([res.location.lat, res.location.lng], 13);
  L.marker([res.location.lat, res.location.lng], { icon: customMarker }).addTo(
    mymap
  );
};

import { header } from "../app.js";

const errorType = ["valueMissing", "patternMismatch"];
const mensagensErro = {
  valueMissing: "Please Write Something",
  patternMismatch:
    "The pattern must be d[ddd].d[ddd].d[ddd].d[ddd] or www.site.com/site.com/site.com.br",
};

const mensagemErro = (validador) => {
  let mensagem = "";
  errorType.forEach((erro) => {
    if (validador[erro]) {
      mensagem = mensagensErro[erro];
    }
  });
  return mensagem;
};

export const createMessageError = (validador) => {
  const p = document.createElement("p");
  p.classList.add("form__error");
  if (header.lastChild == document.querySelector(".form__error"))
    document.querySelector(".form__error").remove();
  p.textContent = mensagemErro(validador);
  header.appendChild(p);
};

export const fetchIP = (ip) => {
  return fetch(
    `https://geo.ipify.org/api/v1?apiKey=at_cxs8Ky5SR3Cm1QsVJaJ9RIC3faKk4&ipAddress=${ip}`
  ).then((res) => res.json());
};

export const fetchDomain = (domain) => {
  return fetch(
    `https://geo.ipify.org/api/v1?apiKey=at_cxs8Ky5SR3Cm1QsVJaJ9RIC3faKk4&domain=${domain}`
  ).then((res) => res.json());
};

export const fetchMap = (map) => {
  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken:
        "pk.eyJ1IjoiaGlhZ3VlZGVzIiwiYSI6ImNrZjB5b2EyNDF1OXkycmw5NmtpeW40N2IifQ.C9OJBjZ-tiRe2BfnISOppw",
    }
  ).addTo(map);
};

//`?apiKey=at_cxs8Ky5SR3Cm1QsVJaJ9RIC3faKk4&ipAddress=${ip}`,

import { createMessageError } from "./services/formValidator.js";
import { sendFetch } from "./services/sendFetch.js";

const input = document.querySelector(".form__input");
const button = document.querySelector(".form__button");
export const header = document.querySelector(".header");

button.addEventListener("click", (event) => {
  event.preventDefault();
  input.validity.valid
    ? sendFetch(input.value)
    : createMessageError(input.validity);
});
