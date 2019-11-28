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
var locationURL = "http://dataservice.accuweather.com/locations/v1/cities/us/search";
var forecastURL = "http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/";

var clientID =  "5e4865c2de614bb4a5b2f590fab22a04";
var clientSID = "b3d12f5e28c346cf90498bc088870505";
var accessToken;

//pull user input from location textbox
function locationInputGetter() {
	var city = document.getElementById("cityLocationInput").value;
	var newLocationURL = locationURL.concat("?apikey=", apiKey, "&q=", city);
	return newLocationURL;
}

//get location key
//GET City Search (results narrowed by countryCode), USA code = US
//http://dataservice.accuweather.com/locations/v1/cities/{countryCode}/search
//location key = key
function getLocationKey() {
	var url = locationInputGetter();
	fetch(url) 
		.then(response => response.json())
		.then(data => {
			console.log(data);
			getHourWeather(data[0].Key);
		});
}

function hourWeatherDisplayHelper(iconNum) {
	//delete all class before adding new classes
	document.getElementById("weatherIcon").className = '';

	//add new classes
	console.log("iconNum: "+iconNum);
	console.log("type of iconNum: "+typeof iconNum);
	document.getElementById("weatherIcon").classList.add("wi");
	if (iconNum >= 10) {
		document.getElementById("weatherIcon").classList.add("icon-accu"+iconNum);
	} else {
		document.getElementById("weatherIcon").classList.add("icon-accu0"+iconNum);
		console.log("iconNum: "+iconNum);
	}
}

//get weather for next hour, needs location key
function getHourWeather(locationKey) {
	//GET 1 Hour of Hourly Forecasts
	var newForecastURL = forecastURL.concat(locationKey,"?apikey=", apiKey);
	console.log("url:"+newForecastURL);
	fetch(newForecastURL)
		.then(response => response.json())
		.then(data => {
		console.log(data);
		hourWeatherDisplayHelper(data[0].WeatherIcon);
	});
}


//redirect user to spotify login
function getAuthorization() {
	var url = "https://accounts.spotify.com/authorize";
	var newURL = url.concat("?client_id=", clientID,
		"&redirect_uri=http://localhost:8000","&response_type=token");
	console.log(newURL);

	//redirect to login for spotify
	window.location.replace(newURL);
}

//get access token from spotify user using implicit grant flow
function getAccessToken() {
	var currURL = window.location.href;
	var token;

	//if access grant, saves access token
	/* http://localhost:8000/
	#access_token=BQCHeBl0bc3knSu7ykvXQ_uNnwhBoASejXEPCjl2JxqOn9u7ntCHt2O7zBmidGg
	UTeWnEadH0dfRhrYF71u_cEBbcj9vx8UX2ljUz1KU3W-ZlB0Pyc_Cj9pn2Q1BmzOPhM-SckwkzCIdA
	EOOiv-lc3JqcR3WPozzQZU&token_type=Bearer&expires_in=3600*/
	if (currURL.includes("access_token",22) == true) {
		token = window.location.hash.replace(/(#access_token=)/, "");
		accessToken = token.replace(/(&token_type=Bearer&expires_in=3600)/, "")
		console.log(accessToken);
	}
}







