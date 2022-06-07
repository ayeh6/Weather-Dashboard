let searchInputEl = $(`#searchInput`);
let searchButtonEl = $(`#searchButton`);
let savedCitiesContainer = $(`#savedCities`);
let currCardEl = $(`#currCard`);
let forecastCardContainer = $(`#forecastCards`);

const oneCallURL = `https://api.openweathermap.org/data/2.5/onecall`
const latTag = `&lat=`;
const lonTag = `&lon=`;
const excludeTag = `&exclude=`;
const unitTag = `&units=`;
const apiKey = `?appid=04a105d65920036e3fc2f97f7a3b2f34`;

const geocodingURL = `http://api.openweathermap.org/geo/1.0/direct`;
const qTag = `&q=`;

let exclude = `minutely,hourly,alerts`;
let units = `imperial`;

function createCurrWeatherCard(city,data) {
    currCardEl.empty();
    let card = $(`<div>`);
    card.addClass(`card-body`);

    let h3 = $(`<h3>`);
    let dateObj = new Date(data.current.dt*1000);
    let date = dateObj.toLocaleDateString();
    h3.text(`${city} (${date})`);

    let pTemp = $(`<p>`);
    pTemp.text(`Temp: ${data.current.temp}°F`);

    let pWind = $(`<p>`);
    pWind.text(`Wind: ${data.current.wind_speed} MPH`);

    let pHumidity = $(`<p>`);
    pHumidity.text(`Humidity: ${data.current.humidity}%`);

    let pUVIndex = $(`<p>`);
    let spanUVIndex = $(`<span>`);
    let uvi = data.current.uvi;
    spanUVIndex.text(uvi);
    if(uvi < 3) {
        spanUVIndex.css({'background-color': 'green'});
    }
    else if(uvi >= 3 && uvi < 6) {
        spanUVIndex.css({'background-color': 'rgb(222, 222, 33)'});
    }
    else if(uvi >= 6 && uvi < 8) {
        spanUVIndex.css({'background-color': 'orange'});
    }
    else if(uvi >= 8 && uvi < 11) {
        spanUVIndex.css({'background-color': 'red'});
    }
    else if(uvi >= 11) {
        spanUVIndex.css({'background-color': 'purple'});
    }
    pUVIndex.text(`UV Index: `);
    pUVIndex.append(spanUVIndex);

    card.append(h3);
    card.append(pTemp);
    card.append(pWind);
    card.append(pHumidity);
    card.append(pUVIndex);
    currCardEl.append(card);
}

function createForecastCards(data) {

}

function getWeatherData(lat,lon,city) {
    fetch(oneCallURL + apiKey + latTag + lat + lonTag + lon + excludeTag + exclude + unitTag + units)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
        createCurrWeatherCard(city,data);
    });
}

function getLatLon(city) {
    let lat;
    let lon;
    fetch(geocodingURL + apiKey + qTag + city)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
        lat = data[0].lat;
        lon = data[0].lon;
        getWeatherData(lat,lon,data[0].name);
    });
}

function search() {
    let city = searchInputEl.val();
    if(city !== ``) {
        getLatLon(city);
        saveSearch(city);
    }
}

function saveSearch(city) {
    let buttonEl = $(`<button>`);
    buttonEl.addClass(`btn btn-secondary`);
    buttonEl.text(city);
    savedCitiesContainer.append(buttonEl);
}

searchButtonEl.on(`click`, search);

let epoch = 1654718400;
let date = new Date(1654718400*1000);
console.log(date.toLocaleDateString());