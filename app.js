function searchWeather() {
    let searchInput = document.getElementById("city_input").value;
    let conditionTxt = document.getElementById("condition");



    // fetch current weather data
    if (searchInput !== "") {
        fetch(`https://api.weatherapi.com/v1/current.json?key=d84dfe92dbbc45e9a75210312243009&q=${searchInput}&aqi=no`).then(res => res.json())
            .then(data => {
                currentWatherUpdate(data);
                return searchInput;

            })
            .then(searchInput => {
                //fetch 5 day forcast API data
                return fetch(`https://api.weatherapi.com/v1/forecast.json?key=d84dfe92dbbc45e9a75210312243009&q=${searchInput}&days=5&aqi=no&alerts=no`);
            })
            .then(res => res.json())
            .then(data => {
                forecastUpdate(data.forecast.forecastday);
            })
            .catch((error) => {
                console.error('Faild to fetch weather update !', error);
                alert('Faild to fetch weather update !');

            });

    }

}


function currentWatherUpdate(data) {
    const temperature = data.current.temp_c;
    document.getElementById("temp").textContent = `${temperature}°C`;

    const condition = data.current.condition.text;
    document.getElementById("condition").textContent = `${condition}`;

    const imgContainer = document.getElementById("weatherIcon");
    const image = data.current.condition.icon;
    imgContainer.innerHTML = `<img src="${image}" alt="Weather Icon">`;


    const date = document.getElementById("date");
    const lastUpdatedDate = formatDate(data.location.localtime);
    date.innerText = lastUpdatedDate;

    const clock = document.getElementById("clock");
    const lastUpdatedTime = formatTime(data.location.localtime);
    clock.innerText = lastUpdatedTime;

    const locationtxt = data.location.name;
    document.getElementById("location").textContent = `${locationtxt},${data.location.country}`;


    const humiditytxt = data.current.humidity;
    document.getElementById("humidity").textContent = `${humiditytxt}%`;

    const windspeedtxt = data.current.wind_mph;
    document.getElementById("windspeed").textContent = `${windspeedtxt}mp/h`;

    const pressuretxt = data.current.pressure_mb;
    document.getElementById("pressure").textContent = `${pressuretxt}mb`;

    const visibilitytxt = data.current.vis_km;
    document.getElementById("visibility").textContent = `${visibilitytxt}km`;

    const feelstxt = data.current.feelslike_c;
    document.getElementById("feels").textContent = `${feelstxt}c`;


}

function forecastUpdate(forecastData) {
    for (let i = 0; i < 5 && i < forecastData.length; i++) {
        const day = forecastData[i];
        const dayOfWeek = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
        const maxTemp = Math.round(day.day.maxtemp_c);
        const minTemp = Math.round(day.day.mintemp_c);
        const icon = day.day.condition.icon;

        document.getElementById(`day${i + 1}`).textContent = dayOfWeek;
        document.getElementById(`temp${i + 1}`).textContent = `${maxTemp}°C / ${minTemp}°C`;
        document.getElementById(`icon${i + 1}`).innerHTML = `<img src="${icon}" alt="Weather Icon">`;

    }

}

function formatDate(date) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const d = new Date(date);
    const month = months[d.getMonth()];
    const day = d.getDate();
    const year = d.getFullYear();
    return `${month}${day}, ${year}`;
}

function formatTime(time) {
    const d = new Date(time);
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
}

function formatDateForAPI(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}


document.addEventListener('DOMContentLoaded', function () {
    const searchBtn = document.getElementById("searchBtn");
    if (searchBtn) {
        searchBtn.addEventListener("click", searchWeather);
    } else {
        console.error("Search button not found");
    }

    const cityInput = document.getElementById("city_input");
    if (cityInput) {
        cityInput.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                searchWeather();
            }
        });
    } else {
        console.error("City input not found");
    }
});