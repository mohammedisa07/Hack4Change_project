async function fetchData() {

    try {
        const suggestionResponse = await fetch('/api/suggestion');
        if (!suggestionResponse.ok) {
            throw new Error('Network response was not ok');
        }
        const suggestionData = await suggestionResponse.json();
        document.getElementById('suggestion').innerText = suggestionData.suggestion;
    } catch (error) {
        console.error('Fetch error: ', error);
        document.getElementById('suggestion').innerText = "No suggestion available";
    }
}

async function submitQuery(event) {
    event.preventDefault();
    const query = document.getElementById('query').value;
    try {
        const response = await fetch('/api/help', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: query })
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const responseData = await response.json();
        document.getElementById('response').innerText = responseData.response;
    } catch (error) {
        console.error('Fetch error: ', error);
        document.getElementById('response').innerText = "Error submitting query. Please try again.";
    }
}

document.getElementById('farmer-help-form').addEventListener('submit', submitQuery);

document.getElementById('disease-detection-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', document.getElementById('file').files[0]);

    try {
        const response = await fetch('/api/disease-detection', {
            method: 'POST',
            body: formData
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        document.getElementById('result').innerText = result.result;
    } catch (error) {
        console.error('Fetch error: ', error);
        document.getElementById('result').innerText = "Error detecting disease. Please try again.";
    }
});
// script.js
document.getElementById('get-weather-btn').addEventListener('click', function() {
    const city = document.getElementById('city-input').value;
    if (city) {
        getWeather(city);
    } else {
        alert('Please enter a city name');
    }
});

function getWeather(city) {
    const apiKey = 'YOUR_API_KEY_HERE'; // Replace with your OpenWeatherMap API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                document.getElementById('location').innerText = `Location: ${data.name}, ${data.sys.country}`;
                document.getElementById('temperature').innerText = `Temperature: ${data.main.temp} °C`;
                document.getElementById('description').innerText = `Description: ${data.weather[0].description}`;
                document.getElementById('humidity').innerText = `Humidity: ${data.main.humidity}%`;
                document.getElementById('wind').innerText = `Wind Speed: ${data.wind.speed} m/s`;
            } else {
                alert('City not found');
            }
        })
        .catch(error => {
            console.error('Error fetching the weather data:', error);
            alert('Error fetching the weather data');
        });
}

fetchData();

