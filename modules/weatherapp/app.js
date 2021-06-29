const api_key = "5e15772e5fb2696b8b3415b342f84fa1";
const api_baseUrl = 'https://api.openweathermap.org/data/2.5/';
const default_city = 'Lagos';

// UI Parameters 
let location1 = document.getElementById('w-location'); 
let desc = document.getElementById('w-desc'); 
let string = document.getElementById('w-string'); 
let icon = document.getElementById('w-icon'); 
let details = document.getElementById('w-details'); 
let humidity = document.getElementById('w-humidity'); 
let despoint = document.getElementById('w-despoint'); 
let wind = document.getElementById('w-wind');  
let timezone = document.getElementById('w-timezone');
let sunrise_sunset = document.getElementById('w-sunrise_&_sunset');
let lat_long = document.getElementById('w-lat_long');
let temperature = document.getElementById('w-temperature');
let temp_min_max = document.getElementById('w-temp-min-max');
let pressure = document.getElementById('w-pressure');
let visibility = document.getElementById('w-visibility');
let rain_volume = document.getElementById('w-rain-volume');
let clouds = document.getElementById('w-clouds');
let time_of_computation = document.getElementById('w-computation-time');
let d_date = document.getElementById('w-date');

var locationString;


window.addEventListener('load', () => {
    if (localStorage.getItem('city') === null) {
        getWeatherReportForCity(default_city);
    } else {
        getWeatherReportForCity(localStorage.getItem('city'));
    }
})


const btnChangeLocation = document.getElementById('btn_change_location');

btnChangeLocation.addEventListener("click", (e) => {
    e.preventDefault();

    swal("Enter City name:", {
        content: "input",
      })
      .then((value) => {
        getWeatherReportForCity(value)
      })  
})

const getWeatherReportForCity = async (city) => {
    if (city == '') {
        swal("Invalid Input!", "City cannot be an empty string!", "error");
        return;
    } 

    
    
    await fetch(`${api_baseUrl}weather?q=${city}&units=metric&appid=${api_key}`)
        .then(response => {
            if (!response.ok) {
                swal(response.statusText, "Encountered error while fetching Data", "error");
              } else {
                localStorage.setItem('city', city);
              }
              return response.json()
        })
        .then(data => printUIDetails(data))
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
          });
        return;
}

const printUIDetails = (weather) => {
    getCountry(weather.sys.country);

    desc.textContent = `${weather.weather[0].main}: ${weather.weather[0].description}`;

    icon.setAttribute('src', `http://openweathermap.org/img/w/${weather.weather[0].icon}.png`);
    
    // location1.textContent = `${weather.name}`
    locationString = `${weather.name}`; 

    sunrise_sunset.innerHTML = `<div>Sunrise Time: ${(new Date(weather.sys.sunrise * 1000)).toLocaleTimeString()}. Sunset Time: ${(new Date(weather.sys.sunset * 1000)).toLocaleTimeString()} <br /> <i>Note that this is base on the timezone of your location.</i> </div>`;

    timezone.textContent = `Timezone: GMT ${(weather.timezone / 3600) > 0 ? '+'+(weather.timezone / 3600) : (weather.timezone / 3600)}`;

    lat_long.textContent = `Longitude: ${weather.coord.lon}. Latitude: ${weather.coord.lat}`;

    temperature.textContent = `Temp: ${Math.round(weather.main.temp)}°C`;

    temp_min_max.textContent = `Temp Range: ${Math.round(weather.main.temp_min)}°C / ${Math.round(weather.main.temp_max)}°C`;

    pressure.textContent = `Atmospheric Pressure: ${weather.main.pressure}hPa`;

    humidity.textContent = `Humidity: ${weather.main.humidity}%`; 

    visibility.textContent = `Visibility: ${weather.visibility}m`;

    wind.innerHTML = `<div><strong>Wind</strong>  Speed: ${weather.wind.speed}m/s   Direction: ${weather.wind.deg}degree. ${weather.wind.gust ? 'Gust: '+ weather.wind.gust + 'm/s' : '' }`;

    if (weather.rain && weather.rain['1h']) {
        let w_rainny = document.getElementById('w-rain-volume');
        w_rainny.innerHTML = '';

        let wordContent = 'Rain Volume for the pass 1 hour: ' + weather.rain['1h'] + 'mm';
        
        addHTMLElementToDom('li', wordContent, 'w-rain-volume');
    } else if (weather.rain && weather.rain['3h']) {
        let w_rainny = document.getElementById('w-rain-volume');
        w_rainny.innerHTML = '';
        
        let wordContent = 'Rain Volume for the pass 3 hour: ' + weather.rain['3h'] + 'mm';
        
        addHTMLElementToDom('li', wordContent, 'w-rain-volume');
    }

    clouds.textContent = `Clouds: ${weather.clouds.all}%`;

    time_of_computation.textContent = `Time of Data Computation: ${(new Date(weather.dt * 1000)).toLocaleTimeString()}`;

    d_date.textContent = `${dateFunction(new Date())}`;
}

const addHTMLElementToDom = (tagName, textNode, id) => {
    const newElement = document.createElement(tagName);
    const newContent = document.createTextNode(textNode);
    newElement.appendChild(newContent);
    newElement.setAttribute("id", id);
    newElement.setAttribute("class", "list-group-item");

    let elements = document.getElementsByTagName(tagName);
    let lastElement = elements[elements.length - 1];
    
    lastElement.after(newElement);
}

const getCountry = async (code = 'NG') => {
    await fetch('https://api.first.org/data/v1/countries?limit=251')
        .then(response => response.json())
        .then(data => {
            setCountryAndRegionDetails(data.data[code])
        });
}

const setCountryAndRegionDetails = (data) => {
   location1.textContent = locationString + `, ${data.country}`;
}

const dateFunction = (date_data) => {
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[date_data.getDay()];
    let date = date_data.getDate();
    let month = months[date_data.getMonth()];
    let year = date_data.getFullYear();

   return `${day}, ${date} ${month} ${year}`;
}











