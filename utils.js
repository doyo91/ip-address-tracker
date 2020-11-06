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
