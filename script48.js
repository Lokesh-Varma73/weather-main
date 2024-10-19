const apiKey = '914ab1f4714de3d0c8d206f07493ace1'; // Your API key
const baseWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
const baseForecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

// Function to fetch current weather
async function getWeatherData(city) {
    const url = `${baseWeatherUrl}?q=${city}&appid=${apiKey}&units=metric`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.cod === 200) {
            updateWeatherWidget(data);
        } else {
            alert('City not found');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data');
    }
}

// Function to fetch 5-day forecast
async function getForecastData(city) {
    const url = `${baseForecastUrl}?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.cod === "200") {
            updateForecastWidget(data);
        } else {
            alert('Forecast data not available');
        }
    } catch (error) {
        console.error('Error fetching forecast data:', error);
    }
}

// Function to update current weather
function updateWeatherWidget(data) {
    const city = data.name;
    const temperature = Math.round(data.main.temp);
    const weatherDescription = data.weather[0].description;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    
    document.querySelector('.city').textContent = city;
    document.querySelector('.temp h1').textContent = `${temperature}°C`;
    document.querySelector('.temp p').textContent = weatherDescription;
    document.querySelector('.extra-info p:nth-child(1)').textContent = `Humidity: ${humidity}%`;
    document.querySelector('.extra-info p:nth-child(2)').textContent = `Wind Speed: ${windSpeed} m/s`;
    
    const weatherIcon = data.weather[0].icon;
    document.querySelector('.icon img').src = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
}

// Function to update the 5-day forecast
function updateForecastWidget(data) {
    const forecastElements = document.querySelectorAll('.forecast-day');
    
    // Filter the forecast data to get one forecast per day (around 12:00 PM)
    const dailyForecast = data.list.filter(forecast => forecast.dt_txt.includes("12:00:00"));

    dailyForecast.forEach((day, index) => {
        if (forecastElements[index]) {
            const date = new Date(day.dt_txt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const temp = Math.round(day.main.temp);
            const icon = day.weather[0].icon;

            // Update forecast day element
            forecastElements[index].querySelector('p:nth-child(1)').textContent = date;
            forecastElements[index].querySelector('img').src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
            forecastElements[index].querySelector('p:nth-child(3)').textContent = `${temp}°C`;
        }
    });
}

// Event listener for search button
document.querySelector('button').addEventListener('click', function() {
    const city = document.querySelector('#search-city').value;
    if (city) {
        getWeatherData(city); // Fetch current weather
        getForecastData(city); // Fetch 5-day forecast
    } else {
        alert('Please enter a city name');
    }
});
