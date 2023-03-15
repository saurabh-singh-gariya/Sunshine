const wrapper = document.querySelector(".wrapper");
let inputPart = wrapper.querySelector(".input-part");
let infoText = inputPart.querySelector(".info-txt");
let inputField = inputPart.querySelector("input");
let locationBtn = inputPart.querySelector("button");
let weatherParts = wrapper.querySelector(".weather-part");
let weatherIcon = weatherParts.querySelector("img");
let backBtn = wrapper.querySelector(".bx-arrow-back");
let searchBtn = wrapper.querySelector(".searchBtn");
let erroNoInput = wrapper.querySelector(".erroNoInput");

let API;

inputField.addEventListener("keyup", (e) => {
  if (e.key == "Enter" && inputField.value != "") {
    erroNoInput.classList.remove("error1");
    requestAPI(inputField.value);
  } else if (e.key == "Enter" && inputField.value == "") {
    erroNoInput.classList.add("error1");
  }else{
    erroNoInput.classList.remove("error1");
  }
});

searchBtn.addEventListener("click", () => {
  if (inputField.value != "") {
    requestAPI(inputField.value);
    erroNoInput.classList.remove("error1");
  } else if (inputField.value == "") {
    erroNoInput.classList.add("error1");
  }
});

locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Not Supported in your Browser");
  }
});

onError = (error) => {
  infoText.textContent = error.message;
  infoText.classList.add("error");
};

onSuccess = (position) => {
  const { latitude, longitude } = position.coords;
  API = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=1f298a6bf38847623f8e1da121d3ff0b`;
  callAPI();
};

requestAPI = (city) => {
  API = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=1f298a6bf38847623f8e1da121d3ff0b`;
  callAPI();
};

callAPI = () => {
  infoText.textContent = "Getting weather details...";
  infoText.classList.add("pending");
  fetch(API)
    .then((res) => res.json())
    .then((res) => weatherDetails(res))
    .catch((erro) => console.log(erro));
};

weatherDetails = (res) => {
  if (res.cod === "404") {
    infoText.textContent = `${inputField.value} not found`;
    infoText.classList.replace("pending", "error");
  } else {
    /*
    name, temp, humidity, feels_like`
    
    */
    let city = res.name;
    let country = res.sys.country;
    const { description, id } = res.weather[0];
    let { feels_like, humidity, temp } = res.main;
    infoText.classList.remove("pending", "error");
    wrapper.classList.add("active");

    if (id == 800) {
      //clear
      weatherIcon.src = "icons/clear.svg";
    } else if (id >= 200 && id <= 232) {
      //thunder
      weatherIcon.src = "icons/storm.svg";
    } else if (id >= 801 && id <= 804) {
      weatherIcon.src = "icons/cloud.svg";
      //clouds
    } else if (id >= 600 && id <= 622) {
      weatherIcon.src = "icons/snow.svg";
      //snow
    } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
      weatherIcon.src = "icons/rain.svg";
      //rain
    } else {
      weatherIcon.src = "icons/haze.svg";
      //haze
    }
    wrapper.querySelector(".temp .numb").innerHTML = Math.floor(temp);
    wrapper.querySelector(".weather").textContent = description;
    wrapper.querySelector(
      ".location span"
    ).textContent = `${city} , ${country}`;
    wrapper.querySelector(".temp .numb-2").textContent = Math.floor(feels_like);
    wrapper.querySelector(".humidity span").textContent = `${humidity}%`;
  }
};

backBtn.addEventListener("click", () => {
  wrapper.classList.remove("active");
  inputField.value = "";
  infoText.textContent = "Please enter a valide City Name";
});
