let cityName;
let storedCity = JSON.parse(localStorage.getItem("City")) || [];

for (let i = 0; i < storedCity.length; i++) {
    var addCityButtons = document.createElement("button");
    addCityButtons.setAttribute("class", "cityNames");
    addCityButtons.textContent = storedCity[i];
    console.log(storedCity[i]);
    $("#presetCities").append(addCityButtons);
    addWeatherEventListener();
}

var fetchWeather = function (cityName) {
    let weatherAPI = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=908d66bc443a59edcf38648405a06695";
    fetch(weatherAPI)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.cod !== "200") {
                console.log("City not found. Please try again");
                return;
            }
            getCityInfo(data.city.coord.lat, data.city.coord.lon);
        })
        .catch(err => console.log(err));
};


function addWeatherEventListener() {
    var presetCityButtons = document.querySelectorAll(".cityNames");
    presetCityButtons.forEach(function (btn) {
        btn.addEventListener("click", function (e) {
            cityName = e.target.innerText;
            fetchWeather(cityName);
        });
    });
}


var searchButton = document.getElementById("searchBtn");
searchButton.addEventListener("click", function () {
    cityName = $("#cityInput").val();
    fetchWeather(cityName);
    console.log(storedCity);
    storedCity.push(cityName);

    var addNewButton = document.createElement("button");
    addNewButton.setAttribute("class", "cityNames");
    addNewButton.textContent = cityName;
    $("#presetCities").append(addNewButton);

    localStorage.setItem("City", JSON.stringify(storedCity));
    addWeatherEventListener();
});


let toDateTime = function (time) {
    let someDate = new Date();
    someDate.setTime(time * 1000);
    let dd = someDate.getDate();
    let mm = someDate.getMonth() + 1;
    let y = someDate.getFullYear();
    return mm + '/' + dd + '/' + y;
}


var getCityInfo = function (lat, lon) {
    let uvApi = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=908d66bc443a59edcf38648405a06695' + '&units=metric'
    fetch(uvApi)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            $('.cityDate').html(cityName + " (" + toDateTime(data.current.dt) + ")" + `<img src="https://openweathermap.org/img/w/${data.current.weather[0].icon}.png" />`); 
            $('.temperature').text("Temp: " + data.current.temp + " °C");
            $('.wind').text("Wind: " + data.current.wind_speed + " MPH");
            $('.humidity').text("Humidity: " + data.current.humidity + " %");
            $('.uvIndex').html("UV Index: " + `<span class="btnColor">${data.current.uvi}</span>`);
            fiveDayForecast(data);

            if (data.current.uvi <= 2) {
                $(".btnColor").attr("class", "btn btn-success");
            };
            if (data.current.uvi > 2 && data.current.uvi <= 5) {
                $(".btnColor").attr("class", "btn btn-warning");
            };
            if (data.current.uvi > 5) {
                $(".btnColor").attr("class", "btn btn-danger");
            };

        });
};


var fiveDayForecast = function (data) {
    $('.fiveDayForecast').empty();
    for (let i = 1; i < 6; i++) {
        var day = $("<div class='day'><div />")
        $(day).append(toDateTime(data.daily[i].dt));
        $(day).append(`<img src="https://openweathermap.org/img/w/${data.daily[i].weather[0].icon}.png"/>`);
        $(day).append("<p>Temp: " + data.daily[i].temp.day + " °C</p>");
        $(day).append("<p>Wind: " + data.daily[i].wind_speed + " MPH</p>");
        $(day).append("<p>Humidity: " + data.daily[i].humidity + " %</p>");
        $('.fiveDayForecast').append(day)

    };
}
