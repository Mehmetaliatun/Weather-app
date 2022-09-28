const form = document.querySelector("section.top-banner form");
const input = document.querySelector(".container input");
const msg = document.querySelector("span.msg");
const list = document.querySelector(".ajax-section .cities");
//! bosluk alt element, nokta class'a sahip oluyor.

localStorage.setItem(
  "tokenKey",
  "K95ur37DbEmBz3Qgg6tB//Up9jcFuA+6IN16UT0At7Y+3oLW53QM0ASTY3DKq/V3"
);
// localStorage.setItem(
//   "tokenKeyEncrypted",
//   EncryptStringAES("3e806d80c568686174a6520843cb0c11")
// );
form.addEventListener("submit", (e) => {
  e.preventDefault();
  getWeatherAppDataFromApi();
});

//*Get api func. (http methods ==Verbs)
const getWeatherAppDataFromApi = async () => {
  //   alert("http request is gone!");
  const tokenKey = DecryptStringAES(localStorage.getItem("tokenKey"));
  //   alert(tokenKey);
  const inputValue = input.value;
  const units = "metric";
  const lang = "tr";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${tokenKey}&units=${units}&lang=${lang}`;

  try {
    const response = await fetch(url).then((response) => response.json());
    console.log(response);

    const { main, sys, weather, name } = response;

    const iconUrl = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
    const iconUrlAWS = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0].icon}.svg`;

    const cityNameSpans = list.querySelectorAll(".city span");
    const cityNameSpansArray = Array.from(cityNameSpans);
    //! foreach array method aliyor.
    if (cityNameSpansArray.length > 0) {
      const filteredArray = cityNameSpansArray.filter(
        (span) => span.innerText == name
      );
      if (filteredArray.length > 0) {
        msg.innerText = `You already know the weather for ${name}, Please search for another city 🤔`;
        //!timeout tek, interval tekrarli
        setTimeout(() => {
          msg.innerText = "";
        }, 5000);
        form.reset();
        return;
      }
    }
    console.log(cityNameSpans);
    const createdLi = document.createElement("li");
    createdLi.classList.add("city");
    createdLi.innerHTML = `<h2 class="city-name" data-name="${name}, ${
      sys.country
    }">
                <span>${name}</span>
                <sup>${sys.country}</sup>
            </h2>
            <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
            <figure>
                <img class="city-icon" src="${iconUrl}">
                <figcaption>${weather[0].description}</figcaption>
            </figure>`;
    //*Append(son) vs. prepend(ilk)
    list.append(createdLi);
    form.reset();
  } catch (error) {
    console.log(error);
    msg.innerText = `404 (City not found)`;
    setTimeout(() => {
      msg.innerText = "";
    }, 5000);
  }
  form.reset();
};
