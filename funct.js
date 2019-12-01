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
var weatherForecast;


var clientID =  "5e4865c2de614bb4a5b2f590fab22a04";
var clientSID = "b3d12f5e28c346cf90498bc088870505";
var accessToken;
var userID;

//organize weather-mood pair into dictionary
var sunny = {
	seed_genre: "summer%2Cpop%2Chappy%2Cindie-pop%2Cdance",
	min_valence: 0.8,
	min_dancibility: 0.5,
	min_energy: 0.8
}

var cloudy = {
	seed_genre: "folk%2Cfunk%2Cguitar%2Cindie%2Crainy-day",
	min_valence: 0.6,
	max_valence: 0.8,
	min_dancibility: 0.2,
	max_dancibility: 0.5,
	min_energy: 0.6,
	max_energy: 0.8
}

var rainy = {
	seed_genre: "study%2Csongwriter%2Cchill%2Cjazz%2Cambient",
	min_valence: 0.4,
	max_valence: 0.6,
	min_dancibility: 0.2,
	max_dancibility: 0.5,
	min_energy: 0.4,
	max_energy: 0.6
}

var snowy = {
	seed_genre: "sleep%2Cambient%2Crainy-day%2Csoundtracks%2Cholidays",
	min_valence: 0.2,
	max_valence: 0.4,
	min_dancibility: 0.0,
	max_dancibility: 0.3,
	min_energy: 0.2,
	max_energy: 0.4
}

var night = {
	seed_genre: "sleep%2Cambient%2Cchill%2Cacoustic%2Csad%2Csoundtracks",
	max_valence: 0.2,
	max_dancibility: 0.2,
	max_energy: 0.2
}



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
	}

	buildRecommendationURL(1);
}

//get weather for next hour, needs location key
function getHourWeather(locationKey) {
	//GET 1 Hour of Hourly Forecasts
	var newForecastURL = forecastURL.concat(locationKey,"?apikey=", apiKey);
	console.log("url:"+newForecastURL);
	fetch(newForecastURL)
		.then(response => response.json())
		.then(data => {
		//assign weather forecast to global variable
		weatherForecast = data[0].WeatherIcon;
		hourWeatherDisplayHelper(data[0].WeatherIcon);
	});
}


//redirect user to spotify login
function getAuthorization() {
	var url = "https://accounts.spotify.com/authorize";
	var newURL = url.concat("?client_id=", clientID,
		"&redirect_uri=http://localhost:8000",
		"&scope=playlist-modify-public%20playlist-modify-private",
		"&response_type=token");

	//redirect to login for spotify
	window.location.replace(newURL);
}

function collectUserInfo(){
	getAccessToken();
	getUserID();
}

//get access token from spotify user using implicit grant flow
function getAccessToken() {
	var currURL = window.location.href;
	var token;

	//if access grant, save access token
	if (currURL.includes("access_token",22) == true) {
		token = window.location.hash.replace(/(#access_token=)/, "");
		accessToken = token.replace(/(&token_type=Bearer&expires_in=3600)/, "");
		console.log(accessToken);
	} /*else {
		alert("Please log in with your Spotify account for full access to features!");
	}*/
	getUserID();
}

//build GET recommendation url
function builderHelper(weatherGroup) {
	console.log(weatherGroup);
	var url = "https://api.spotify.com/v1/recommendations"
	url = url.concat("?", Object.keys(weatherGroup)[0], Object.values(weatherGroup)[0]);
	for (var i=1; i<Object.keys(weatherGroup).length; i++) {
		url = url.concat("&", Object.keys(weatherGroup)[i], "=", Object.values(weatherGroup)[i].toString());
	}
	return url;
}

function buildRecommendationURL(weather) {
	var builtURL;

	if (weather == 1) {
		builtURL = builderHelper(sunny);
	} 
	else if (1 < weather <= 8) {
		builtURL = builderHelper(cloudy);
	} 
	else if (8 < weather <= 16) {
		builtURL = builderHelper(rainy);
	} 
	else if (16 < weather <= 24) {
		builtURL = builderHelper(snowy);
	} 
	else {
		builtURL = builderHelper(night);
	}
	return builtURL;
}

function getRecommendations(url) {
	fetch(url, {
		headers: {
			Accept: "application/json",
			Authorization: "Bearer "+accessToken,
			"Content-Type": "application/json"
		}
	})
		.then(response => response.json())
		.then(data => {
			var trackURIs = []

		//populate array with URIs from tracks
	});
}

//get current user ID
function getUserID(){
	var access = "Bearer "+accessToken;
	const request = async () => {
	    const response = await fetch("https://api.spotify.com/v1/me", {
		headers: {
			Accept: "application/json",
			Authorization: access,
			"Content-Type": "application/json"
		}
	})
		const json = await response.json();
		console.log("json", json);
		userID = json.id;
		console.log("userid", userID);
	}
	request();
}

//create a new playlist
var playlistID;
function createNewPlaylist(){
	console.log("userid in create funct", userID);
	var access = "Bearer "+accessToken;
	var url = "https://api.spotify.com/v1/users/"+userID+"/playlists";
	fetch(url, {
		body: "{\"name\":\"New Playlist\",\"description\":\"New playlist description\",\"public\":true}",
		headers: {
			Accept: "application/json",
			Authorization: access,
			"Content-Type": "application/json"
		},
		method: "POST"
	})
		.then(response => response.json())
		.then(data => {
			console.log(data);
			playlistID = data.id;
	});
}

//add tracks to playlist playlistURI = 62BgcjjA68WDuafi7AtQ9y
function addTracksToPlaylist() {
	var playlistURI = "62BgcjjA68WDuafi7AtQ9y";
	var URIs = "spotify%3Atrack%3A57vxBYXtHMk6H1aD29V7PU%2Cspotify%3Atrack%3A57vxBYXtHMk6H1aD29V7PU";
	var url = "https://api.spotify.com/v1/playlists/"+playlistURI+"/tracks?uris="+URIs;
	var access = "Bearer "+accessToken;
	fetch(url, {
			//credentials: 'include',
			headers: {
				Accept: "application/json",
				Authorization: access,
				"Content-Type": "application/json"
			},
			method: "POST"
		})
	console.log(url)
}
//fetch recommendations from Spotify

//arrange returned tracks from Spotify recommendation
/*https://api.spotify.com/v1/playlists/62BgcjjA68WDuafi7AtQ9y/
tracks?position=1
&uris=spotify%3Atrack%3A57vxBYXtHMk6H1aD29V7PU%2Cspotify%3Atrack%3A57vxBYXtHMk6H1aD29V7PU*/




