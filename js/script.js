const wrapper = document.querySelector('.wrapper');
const daysWrapper = document.querySelector('.days-wrapper');
const locationWrapper = document.querySelector('.location-wrapper');
const locationImage = document.querySelector('.location-img');
const findBtn = document.querySelector('.search-btn')
const weatherWrapper = document.querySelector('.weather-wrapper');
const currentWrapper = document.querySelector('.current-wrapper');
const arrayOfDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const weatherInfo = document.querySelectorAll('.weather-info');
const timeBar = ['02:00', '05:00', '08:00', '11:00', '14:00', '17:00', '20:00', '23:00'];
const locationCity = document.querySelector('.location-city');
let dayWrap = [];
let currentDataWeather = [];

async function getWeather(url){
    const data = await fetch(url);
    return data.json()
}

let data = getWeather('https://api.weatherapi.com/v1/forecast.json?key=e905556287f443d0976163738202011&q=Kiev&days=10')
.then(value => {
    drawDays(value.forecast.forecastday);
    drawWeather(value.forecast.forecastday[2]);

    currentDataWeather = value;

    dayWrap = document.querySelectorAll('.day');
    dayWrap.forEach(elem => {elem.addEventListener('click', changeDay)});
    dayWrap[0].click();

    wrapper.insertAdjacentHTML('beforeend', `
        <p class="last-update">Last updated: ${value.current.last_updated}</p>
    `)

    return dayWrap, currentDataWeather;
})

function drawDays(arrOfDays){
    arrOfDays.reverse().forEach(elem => {
        daysWrapper.insertAdjacentHTML('afterbegin', `
        <div class="day"> 
        <h2>${elem.date.split('-').splice(1, 2).reverse().join('.')}</h2>
        <h1>${arrayOfDays[new Date(elem.date).getDay()]}</h1>
        <p>min: ${elem.day.mintemp_c}° max: ${elem.day.maxtemp_c}°</p>
        </div>
        `)
    });
}

function drawWeather(currDay){
    let sortedHours = currDay.hour.filter(elem => {
        if(timeBar.includes(elem.time.split(' ')[1])){
            return elem
        }
    })

    sortedHours.forEach((elem, index) => {
        drawInfo(elem, index)
    })
}

function drawInfo(elem, index){
    weatherInfo[index].insertAdjacentHTML('beforeend', `
        <img class="weather-image" src="https:${elem.condition.icon}">
        <p class="info-text">${elem.temp_c}°</p>
        <p class="info-text">${elem.feelslike_c}°</p>
        <p class="info-text">${elem.wind_kph}</p>
        <p class="info-text">${elem.will_it_rain}%</p>
        <p class="info-text">${elem.will_it_snow}%</p>
        
    `)
}

function changeDay(e){
    weatherInfo.forEach(elem => {
        while(elem.children.length > 1){
            elem.removeChild(elem.lastChild)
        }
    })

    dayWrap.forEach(elem => {
        elem.classList.remove('day-active')
    })
    if(e.target.classList.contains('day')){
        e.target.classList.add('day-active');
    }

    let date = this.children[0].innerHTML + "." + new Date().getFullYear();
    date = date.split('.').reverse().join('-');
    
    currentDataWeather.forecast.forecastday.forEach(elem => {
        if(elem.date == date){
            drawWeather(elem)
        }
    })

    currentWrapper.innerHTML = ''
    currentWrapper.insertAdjacentHTML('afterbegin', `
    <div class="current">
        <h3 class="current-temp">Temp: ${currentDataWeather.current.temp_c}°</h3>
        <h3>Feels like: ${currentDataWeather.current.feelslike_c}</h3>
    </div>
        <img src="https:${currentDataWeather.current.condition.icon}">

    `)
}

findBtn.addEventListener('click', changeCity)

function changeCity(){
    let input = document.querySelector('.location-city').value

    let image = getCityPhoto(input)
    image.then(img => {
        img.hits.forEach(image => {
            if(image.tags.includes(input.toLowerCase())){
                locationImage.src = `${image.previewURL}`
            }
        })
    })
    daysWrapper.innerHTML = "";
    currentWrapper.innerHTML = "";
    let data = getWeather(`https://api.weatherapi.com/v1/forecast.json?key=e905556287f443d0976163738202011&q=${input}&days=10`)
    .then(value => {
    drawDays(value.forecast.forecastday);
    drawWeather(value.forecast.forecastday[2]);

    currentDataWeather = value;

    dayWrap = document.querySelectorAll('.day');
    dayWrap.forEach(elem => {elem.addEventListener('click', changeDay)});
    dayWrap[0].click();
    })
}

async function getCityPhoto(city){
    const photo = await fetch(`https://pixabay.com/api/?key=19221038-d65bf18ef460dfe7c26c71801&q=${city}`)
    return photo.json()
}