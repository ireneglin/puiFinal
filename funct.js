/* 
JS functionalities to do

1. get location by api, onload
2. display weather
3. define 
*/

//set up function for getting input
//get input
//update url
//GET with url
//parse info from GET
//display parsed GET info

var apiKey = "YP9GsGpyqk2uJxUJyHXFAyx7HBZqpA2H";

//URL helper function
function urlMaker(url, q) {
	var newURL = url.concat("?apikey=", apiKey, "&q=", q);
	//return newURL;
	console.log(newURL);
}


//get location key
//GET City Search (results narrowed by countryCode), USA code = US
//http://dataservice.accuweather.com/locations/v1/cities/{countryCode}/search
//location key = key
function getLocationKey() {
	var lk = null;
	fetch('http://dataservice.accuweather.com/locations/v1/cities/us/search?apikey=YP9GsGpyqk2uJxUJyHXFAyx7HBZqpA2H&q=Pittsburgh') 
		.then(response => response.json())
		.then(data => {
			console.log(data);
			lk = data[0].Key;
			console.log("type:"+typeof data[0].Key +" key: "+data[0].Key);
			getHourWeather(lk);
		});
	
}

//get weather for next hour, needs location key
function getHourWeather(locationKey) {
	//GET 1 Hour of Hourly Forecasts
	var imgSrc = "https://developer.accuweather.com/sites/default/files/";
	var url = "http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/";
	var nu = url.concat(locationKey,"?apikey=", apiKey);
	console.log("url:"+nu);
	fetch(nu)
		.then(response => response.json())
		.then(data => {
		console.log(data);
		document.getElementById("weatherIcon").classList.add("wi");
		document.getElementById("weatherIcon").classList.add("icon-accu"+data[0].WeatherIcon);
	});
}



