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

const geocodingURL = `https://api.openweathermap.org/geo/1.0/direct`;
const qTag = `&q=`;

let exclude = `minutely,hourly,alerts`;
let units = `imperial`;

function createCurrWeatherCard(cityState,data) { //create large card of current weather
    currCardEl.empty(); //clear the card

    let card = $(`<div>`);  //new card
    card.addClass(`card-body`); //add class for bootstrap

    let h3 = $(`<h3>`); //new header
    let dateObj = new Date(data.current.dt*1000);   //convert date from epoch
    let date = dateObj.toLocaleDateString();
    h3.text(`${cityState} (${date})`);   //set date to header

    let img = $(`<img>`);   //get icon
    let iconLink = `https://openweathermap.org/img/wn/${data.current.weather[0].icon}.png`;
    img.attr('src',iconLink);
    h3.append(img);

    let pTemp = $(`<p>`);   //get temperature
    pTemp.text(`Temp: ${data.current.temp} °F`);

    let pWind = $(`<p>`);   //get wind speed
    pWind.text(`Wind: ${data.current.wind_speed} MPH`);

    let pHumidity = $(`<p>`);   //get humidity
    pHumidity.text(`Humidity: ${data.current.humidity}%`);

    let pUVIndex = $(`<p>`);    //get uv index
    let spanUVIndex = $(`<span>`);
    let uvi = data.current.uvi;
    spanUVIndex.text(uvi);

    if(uvi < 3) { //change color based on uv index
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
    pUVIndex.append(spanUVIndex);   //append span to p tag

    currCardEl.append(card.append(h3,pTemp,pWind,pHumidity,pUVIndex));  //append everything
}

function createForecastCards(data) {    //create cards for next 5 day forecast
    forecastCardContainer.empty();  //clear container

    let h3 = $(`<h3>`); //create h3 header and append
    h3.text(`5-Day Forecast:`);
    forecastCardContainer.append(h3);

    let forecast = data.daily;  //get forecast data
    for(let i=1; i<6; i++) {    //only iterate for 5 days
        let card = $(`<div>`);  //create elements
        let cardBody = $(`<div>`);
        let h5Date = $(`<h5>`);
        let imgIcon = $(`<img>`);
        let pTemp = $(`<p>`);
        let pWind = $(`<p>`);
        let pHumidity = $(`<p>`);

        card.addClass(`col card`);  //add classes
        cardBody.addClass(`card-body`);

        let dateObj = new Date(forecast[i].dt*1000);    //get date from epoch
        let date = dateObj.toLocaleDateString();
        h5Date.text(date);

        let iconLink = `https://openweathermap.org/img/wn/${forecast[i].weather[0].icon}.png`;   //get icon
        imgIcon.attr('src',iconLink);

        pTemp.text(`Temp: ${forecast[i].temp.day} °F`); //set text
        pWind.text(`Wind: ${forecast[i].wind_speed} MPH`);
        pHumidity.text(`Humidity: ${forecast[i].humidity}%`);

        forecastCardContainer.append(card.append(cardBody.append(h5Date,imgIcon,pTemp,pWind,pHumidity)));   //append everything
    }
}

function getWeatherData(lat,lon,city,state) { //get weather data from api
    fetch(oneCallURL + apiKey + latTag + lat + lonTag + lon + excludeTag + exclude + unitTag + units)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        let cityState = `${city}, ${state}`;
        createCurrWeatherCard(cityState,data);   //set current weather card
        createForecastCards(data);  //set forecast cards
        saveSearch(city);   //save search input
        showCards();    //reveal cards if not on screen
    });
}

function getLatLon(city) {  //get lat lon data from api using city input
    let lat;
    let lon;
    fetch(geocodingURL + apiKey + qTag + city)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        lat = data[0].lat;
        lon = data[0].lon;
        getWeatherData(lat,lon,data[0].name,data[0].state);  //get weather data using lat lon, pass cityState through
    });
}

function search() { //search from text input
    let city = searchInputEl.val();
    searchInputEl.val('');
    if(city !== ``) {
        getLatLon(city);
    }
}

function saveSearch(city) { //save to search history
    let searches = JSON.parse(localStorage.getItem(`searches`));    //pull from local storage
    if(searches === null) { //if null, make empty array
        searches = [];
    }
    let found = false;
    for(let i=0; i<searches.length; i++) {  //if city exists, set flag to true
        if(searches[i] === city) {
            found = true;
        }
    }
    if(!found) {    //if city exists, dont add to list
        searches.push(city);
    }
    localStorage.setItem(`searches`,JSON.stringify(searches));
    renderSavedSearch();    //render the results
}

function renderSavedSearch() {
    savedCitiesContainer.empty();   //clear search history
    let searches = JSON.parse(localStorage.getItem(`searches`));    //pull from local storage
    if(searches !== null) { //if not empty, iterate
        for(let i=0; i<searches.length; i++) {
            let buttonEl = $(`<button>`);   //new button
            buttonEl.addClass(`btn btn-secondary`); //add class
            buttonEl.text(searches[i]); //set text
            savedCitiesContainer.append(buttonEl);  //append to container
        }
    }
}

function showCards() {  //make cards visible
    currCardEl.css({'display': 'block'});
    forecastCardContainer.css({'display': 'flex'})
}

searchButtonEl.on(`click`, search); //on search button, search using text input
searchInputEl.on(`keypress`,function(event) {   //on enter press
    if(event.which === 13) {
        search();
    }
});

$(document).on(`click`,`.btn-secondary`,function() {    //button listener for search history buttons
    getLatLon($(this).text());  //call function using button text
});

renderSavedSearch();    //render search history on page load
