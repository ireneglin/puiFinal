/* 
JS functionalities to do

*/

var apiKey = "YP9GsGpyqk2uJxUJyHXFAyx7HBZqpA2H";
var locationURL = "https://dataservice.accuweather.com/locations/v1/cities/us/search";
var forecastURL = "https://dataservice.accuweather.com/forecasts/v1/hourly/1hour/";
var weatherForecast;


var clientID =  "e044cb1522744df7a304d4b149d8e7c2";//"5e4865c2de614bb4a5b2f590fab22a04";
//var clientSID = "b3d12f5e28c346cf90498bc088870505";
var accessToken;
var userID;

//organize weather-mood pair into dictionary
var sunny = {
	seed_genres: "summer%2Cpop%2Chappy%2Cindie-pop%2Cdance",
	min_valence: 0.8,
	min_dancibility: 0.5,
	min_energy: 0.8
}

var cloudy = {
	seed_genres: "folk%2Cfunk%2Cguitar%2Cindie%2Crainy-day",
	min_valence: 0.4,
	max_valence: 0.7,
	min_dancibility: 0.2,
	max_dancibility: 0.5,
	min_energy: 0.4,
	max_energy: 0.7
}

var rainy = {
	seed_genres: "study%2Csongwriter%2Cchill%2Cjazz%2Cambient",
	min_valence: 0.3,
	max_valence: 0.6,
	min_dancibility: 0.2,
	max_dancibility: 0.5,
	min_energy: 0.3,
	max_energy: 0.6
}

var snowy = {
	seed_genres: "sleep%2Cambient%2Crainy-day%2Csoundtracks%2Cholidays",
	min_valence: 0.4,
	max_valence: 0.6,
	min_dancibility: 0.0,
	max_dancibility: 0.3,
	min_energy: 0.2,
	max_energy: 0.4
}

var night = {
	seed_genres: "sleep%2Cambient%2Cchill%2Cacoustic%2Csad%2Csoundtracks",
	max_valence: 0.3,
	max_dancibility: 0.2,
	max_energy: 0.3
}



//pull user input from location textbox
function locationInputGetter() {
	var city = document.getElementById("cityLocationInput").value;
	var newLocationURL = locationURL.concat("?apikey=", apiKey, "&q=", city);
	if (city == "") {
		alert("please input valid US city");
	}
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
	document.getElementById("weatherIcon").classList.add("wi");
	if (iconNum >= 10) {
		document.getElementById("weatherIcon").classList.add("icon-accu"+iconNum);
	} else {
		document.getElementById("weatherIcon").classList.add("icon-accu0"+iconNum);
	}

	buildRecommendationURL(iconNum);
}

//get weather for next hour, needs location key
function getHourWeather(locationKey) {
	//GET 1 Hour of Hourly Forecasts
	var newForecastURL = forecastURL.concat(locationKey,"?apikey=", apiKey);
	fetch(newForecastURL)
		.then(response => response.json())
		.then(data => {
		//assign weather forecast to global variable
		weatherForecast = data[0].WeatherIcon;
		hourWeatherDisplayHelper(data[0].WeatherIcon);
	});
}

/*--Spotify API authorization---------------------------------------------------------*/

//redirect user to spotify login
function getAuthorization() {
	var url = "https://accounts.spotify.com/authorize";
	var newURL = url.concat("?client_id=", clientID,
		"&redirect_uri=https://ireneglin.github.io/puiFinal/",
		"&scope=playlist-modify-public%20playlist-modify-private",
		"&response_type=token");

	//redirect to login for spotify
	window.location.replace(newURL);
}

//get access token from spotify user using implicit grant flow
function getAccessToken() {
	var currURL = window.location.href;
	var token;

	//if access grant, save access token
	if (currURL.includes("access_token",22) == true) {
		token = window.location.hash.replace(/(#access_token=)/, "");
		accessToken = token.replace(/(&token_type=Bearer&expires_in=3600)/, "");
	} /*else {
		alert("Please log in with your Spotify account for full access to features!");
	}*/
	getUserID();
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
		userID = json.id;
	}
	request();
}

/*--Spotify API recommendations, building playlist--------------------------------*/
function songsStart() {
	createNewPlaylist();
	getRecommendations();
	addTracksToPlaylist();
}


//create a new playlist
var playlistID;
function createNewPlaylist(){//callback){
	var access = "Bearer "+accessToken;
	var url = "https://api.spotify.com/v1/users/"+userID+"/playlists";
	const request = async () => {
	    const response = await 	fetch(url, {
		body: "{\"name\":\""+currWeather+"\",\"description\":\"made by accuspot\",\"public\":true}",
		headers: {
			Accept: "application/json",
			Authorization: access,
			"Content-Type": "application/json"
		},
		method: "POST"
	})
		const json = await response.json();
		playlistID = json.id;
	};
	request();
	//callback();
}

//make rec URL spotify:playlist:3vQAo3evqhXylSJUQZV85j
function buildTracksToPlaylistURL() {
	var url = "https://api.spotify.com/v1/playlists/"+playlistID+"/tracks?uris="+trackURIs.join("%2C");
	console.log("ttop url", url);
	return url;
}

//add tracks to playlist playlistURI = 62BgcjjA68WDuafi7AtQ9y
async function addTracksToPlaylist() {
	var url = buildTracksToPlaylistURL();
	var access = "Bearer " + accessToken;
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

	await getRecommendations();
}

//build GET recommendation url
function builderHelper(weatherGroup) {
	//console.log(weatherGroup);
	var url = "https://api.spotify.com/v1/recommendations"
	url = url.concat("?", Object.keys(weatherGroup)[0], "=", Object.values(weatherGroup)[0]);
	for (var i=1; i<Object.keys(weatherGroup).length; i++) {
		url = url.concat("&", Object.keys(weatherGroup)[i], "=", Object.values(weatherGroup)[i].toString());
	}
	var urlName = [url, "weatherGroup"];
	return urlName;
}

//fetch recommendations from Spotify
var currWeather;
function buildRecommendationURL(weather) {
	var builtURL;
	console.log("weather", weather);
	console.log("curr w", currWeather);

	if (weather === 1) {
		builtURL = builderHelper(sunny);
		currWeather = "sunny";
		console.log("curr sunny", currWeather);
	} 
	else if (1 < weather <= 11) {
		builtURL = builderHelper(cloudy);
		currWeather = "cloudy";
		console.log("curr cloud", currWeather);
	} 
	else if (11 < weather <= 18) {
		builtURL = builderHelper(rainy);
		currWeather = "rainy";
		console.log("curr rain", currWeather);
	} 
	else if (18 < weather <= 32) {
		builtURL = builderHelper(snowy);
		currWeather = "snowy";
		console.log("curr snow", currWeather);
	} 
	else {
		builtURL = builderHelper(night);
		currWeather = "night";
		console.log("curr night", currWeather);
	}
	return builtURL;
}

//fetch recommendations from spotify
var trackURIs
function getRecommendations(){//callback) {
	var urlName = buildRecommendationURL(weatherForecast);
	var url = urlName[0];
	const request = async () => {
	    const response = await fetch(url, {
		headers: {
			Accept: "application/json",
			Authorization: "Bearer "+accessToken,
			"Content-Type": "application/json"
		}
	})
		const json = await response.json();
		console.log("json", json);
		//populate array with URIs from tracks
		trackURIs = [];
		var tracks = json.tracks;
		for (var i = 0; i <= tracks.length-1; i++) {
			trackURIs.push(tracks[i].uri);
		}
		console.log(trackURIs)
	};
	request();
	//callback();
}

/*var trackURIs
function getRecommendations(){//callback) {
	var urlName = buildRecommendationURL(weatherForecast);
	var url = urlName[0];
	var playlistName = urlName[1];
	const request = async () => {
	    const response = await fetch(url, {
		headers: {
			Accept: "application/json",
			Authorization: "Bearer "+accessToken,
			"Content-Type": "application/json"
		}
	})
		const json = await response.json();
		console.log("json", json);
		//populate array with URIs from tracks
		trackURIs = [];
		var tracks = json.tracks;
		for (var i = 0; i <= tracks.length-1; i++) {
			trackURIs.push(tracks[i].uri);
		}
		console.log(trackURIs)
	};
	request();
	//callback();
}*/

//arrange returned tracks from Spotify recommendation

//songs start
