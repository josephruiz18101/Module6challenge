const apiKey = '6d47ece6c04f5a34869a57c504957ac0';
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentWeatherDiv = document.getElementById('current-weather');
const forecastDiv = document.getElementById('forecast');
const historyList = document.getElementById('history-list');

searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
        addToHistory(city);
        cityInput.value = '';
    }
});

function fetchWeather(city) {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    Promise.all([
        fetch(currentWeatherUrl).then(response => response.json()),
        fetch(forecastUrl).then(response => response.json())
    ]).then(data => {
        displayCurrentWeather(data[0]);
        displayForecast(data[1]);
    });
}

function displayCurrentWeather(data) {
    if (data.cod !== 200) {
        currentWeatherDiv.innerHTML = `<p>City not found!</p>`;
        return;
    }

    const { name, weather, main, wind } = data;
    const date = new Date().toLocaleDateString();
    currentWeatherDiv.innerHTML = `
        <h2>${name} (${date})</h2>
        <img src="https://openweathermap.org/img/wn/${weather[0].icon}.png" alt="${weather[0].description}">
        <p>Temperature: ${main.temp} °C</p>
        <p>Humidity: ${main.humidity}%</p>
        <p>Wind Speed: ${wind.speed} m/s</p>
    `;
}

function displayForecast(data) {
    const forecastItems = data.list.filter(item => item.dt_txt.includes("12:00:00")).map(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        return `
            <div>
                <h3>${date}</h3>
                <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}">
                <p>Temperature: ${item.main.temp} °C</p>
                <p>Humidity: ${item.main.humidity}%</p>
                <p>Wind Speed: ${item.wind.speed} m/s</p>
            </div>
        `;
    }).join('');
    
    forecastDiv.innerHTML = `<h2>5-Day Forecast</h2>${forecastItems}`;
}

function addToHistory(city) {
    const historyItem = document.createElement('li');
    historyItem.textContent = city;
    historyItem.addEventListener('click', () => fetchWeather(city));
    historyList.appendChild(historyItem);
}
