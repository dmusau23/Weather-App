let currentTempC = null;
let currentTempF = null;
let isCelsius = true;

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const errorDiv = document.querySelector(".error");
const weatherDiv = document.querySelector(".weather");

async function checkWeather(city) {
    if (!city) return; // prevent empty searches

    // Remove extra spaces around commas and parts
  const cleanedInput = city
    .split(",")
    .map(part => part.trim())
    .filter(part => part.length > 0)
    .join(",");

  const response = await fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      encodeURIComponent(cleanedInput) +
      "&appid=9e33984ac6e94f58bec7735f0b268789&units=metric"
  );

    if (response.status == 404) {
        errorDiv.style.display = "block";
        weatherDiv.style.display = "none";
        return;
    }

    const data = await response.json();

    // Store temperatures
    currentTempC = Math.round(data.main.temp);
    currentTempF = Math.round(currentTempC * 9 / 5 + 32);
    isCelsius = true;

    // Update UI
    document.querySelector(".city").textContent = data.name;
    document.querySelector(".temp").textContent = currentTempC + " °C";
    document.querySelector(".humidity").textContent = data.main.humidity + "%";
    document.querySelector(".wind").textContent = data.wind.speed + " km/h";

    // Update icon based on weather
    const weatherMain = data.weather[0].main;
    if (weatherMain === "Clouds") {
        weatherIcon.src = "images/clouds.png";
    } else if (weatherMain === "Clear") {
        weatherIcon.src = "images/clear.png";
    } else if (weatherMain === "Rain") {
        weatherIcon.src = "images/rain.png";
    } else if (weatherMain === "Drizzle") {
        weatherIcon.src = "images/drizzle.png";
    } else if (weatherMain === "Mist") {
        weatherIcon.src = "images/mist.png";
    } else {
        weatherIcon.src = "images/clear.png"; // fallback
    }

    weatherDiv.style.display = "block";
    errorDiv.style.display = "none";
}

function changeTemp() {
    if (currentTempC === null) return; // no data yet
    const tempElement = document.querySelector(".temp");

    if (isCelsius) {
        tempElement.textContent = currentTempF + " °F";
        isCelsius = false;
    } else {
        tempElement.textContent = currentTempC + " °C";
        isCelsius = true;
    }
}

// Event listeners
searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value.trim());
});
