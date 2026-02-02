// 🔑 ADD YOUR API KEY HERE
const apiKey = "c9ed16e4ba91f0ff594c5f877ad26821";

// 🌡️ Unit (default Celsius)
let unit = "metric";

// 🔍 SEARCH WEATHER BY CITY
function getWeatherByCity() {
  const city = document.getElementById("city").value.trim();

  if (city === "") {
    alert("Please enter a city name");
    return;
  }

  getWeather(null, null, city);
}

// 🌦️ GET WEATHER (CITY OR LOCATION)
function getWeather(lat, lon, cityName) {
  unit = document.getElementById("unitToggle")?.checked ? "imperial" : "metric";

  let url = cityName
    ? `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${unit}`
    : `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.cod !== 200) {
        document.getElementById("weather").innerHTML = "❌ City not found";
        return;
      }

      const condition = data.weather[0].main;
      const icon = getWeatherIcon(condition);
      const tempUnit = unit === "metric" ? "°C" : "°F";

      document.getElementById("weather").innerHTML = `
        <div class="weather-icon">${icon}</div>
        <h2>${data.name}</h2>
        <p>🌡️ Temperature: ${data.main.temp} ${tempUnit}</p>
        <p>☁️ Condition: ${condition}</p>
        <p>💧 Humidity: ${data.main.humidity}%</p>
        <p>🌬️ Wind: ${data.wind.speed} m/s</p>
        <p style="font-size:12px;">📍 Location detected (approximate)</p>
      `;

      // 📅 Get 7-day forecast
      getForecast(data.coord.lat, data.coord.lon);
    })
    .catch(() => {
      document.getElementById("weather").innerHTML = "⚠️ Error fetching data";
    });
}

// 📅 7-DAY FORECAST
function getForecast(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`)
    .then(res => res.json())
    .then(data => {
      const dailyData = data.list.filter((_, index) => index % 8 === 0);

      document.getElementById("forecast").innerHTML = dailyData
        .slice(0, 7)
        .map(day => `
          <div>
            <p>${new Date(day.dt_txt).toDateString().slice(0, 10)}</p>
            <p>${getWeatherIcon(day.weather[0].main)}</p>
            <p>${day.main.temp}°</p>
          </div>
        `)
        .join("");
    });
}

// 📍 CURRENT LOCATION WEATHER
function getCurrentLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation not supported by this browser");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      getWeather(lat, lon);
    },
    () => {
      alert("Location permission denied");
    }
  );
}

// 🌙 DARK MODE TOGGLE
function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

// ☀️ WEATHER ICON LOGIC
function getWeatherIcon(condition) {
  switch (condition) {
    case "Clear":
      return "☀️";
    case "Clouds":
      return "☁️";
    case "Rain":
      return "🌧️";
    case "Thunderstorm":
      return "⛈️";
    case "Snow":
      return "❄️";
    case "Drizzle":
      return "🌦️";
    case "Mist":
    case "Fog":
      return "🌫️";
    default:
      return "🌡️";
  }
}
