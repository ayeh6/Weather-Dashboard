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

function getWeatherData(lat,lon) {
    fetch(oneCallURL + apiKey + latTag + lat + lonTag + lon + excludeTag + exclude + unitTag + units)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
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
        getWeatherData(lat,lon);
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