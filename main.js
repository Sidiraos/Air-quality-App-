const pollutionScale = [
	{
		scale: [0, 50],
		quality: 'Good',
		src: 'happy',
		background: 'linear-gradient(to right, #45B649, #DCE35B)',
	},
	{
		scale: [51, 100],
		quality: 'Moderate',
		src: 'thinking',
		background: 'linear-gradient(to right, #F3F9A7, #CAC531)',
	},
	{
		scale: [101, 150],
		quality: 'Unhealthy',
		src: 'unhealthy',
		background: 'linear-gradient(to right, #F16529, #E44D26)',
	},
	{
		scale: [151, 200],
		quality: 'Bad',
		src: 'bad',
		background: 'linear-gradient(to right, #ef473a, #cb2d3e)',
	},
	{
		scale: [201, 300],
		quality: 'Very bad',
		src: 'mask',
		background: 'linear-gradient(to right, #8E54E9, #4776E6)',
	},
	{
		scale: [301, 500],
		quality: 'Terrible',
		src: 'terrible',
		background: 'linear-gradient(to right, #7a2828, #a73737)',
	},
];

async function getPollutionData() {
	try {
		addLoaderAnimation();
		const response = await fetch(
			'http://api.airvisual.com/v2/nearest_city?key=3a7c3e83-9b8e-41e3-83a3-c1009efc644c'
		);
		if (response.ok) {
			removeLoaderAnimation();
			const data = await response.json();
			const aqi = data.data.current.pollution.aqius;
			const sortedData = {
				city: data.data.city,
				aqi,
				...pollutionScale.find(
					(obj) => aqi >= obj.scale[0] && aqi <= obj.scale[1]
				),
			};
			console.log(data);
			console.log(sortedData.city, sortedData.aqi);
			populateUI(sortedData);
		} else {
			throw new Error(
				'Error fetching' +
					' ' +
					response.status +
					' ' +
					response.statusText
			);
		}
	} catch (error) {
		setTimeout(() => {
			removeLoaderAnimation();
			displayError(error);
		}, 2000);
	}
}

getPollutionData();
const city$ = $('#city');
const emojiImg$ = $('.emojiImg');
const info$ = $('.infoCity');
const pollutionInfo$ = $('#PollutionInfo');
const airIndex$ = $('#airIndex');
const locationPointer = document.querySelector('#location-pointer');
const pollutionScaleInfo = document.querySelector('#pollutionScaleInfo');

function populateUI(data) {
	info$.text('here is ' + data.city + ' situation ');
	city$.text(data.city);
	airIndex$.text(data.aqi);
	emojiImg$.attr('src', `ressources/${data.src}.svg`);
	emojiImg$.attr('alt', data.src + ' emoji');
	$('body').css('background', data.background);
	pollutionInfo$.text(data.quality);
	pointerPlacement(data.aqi);
}

function displayError(text) {
	info$.text(text);
	emojiImg$.attr('src', `ressources/browser.svg`);
	emojiImg$.attr('alt', 'browser emoji');
}

function pointerPlacement(AQIValue) {
	const parentWidth = locationPointer.parentElement.scrollWidth;
	locationPointer.style.transform = `translateX(${
		(AQIValue / 500) * parentWidth
	}px) rotate(180deg)`;
}
function removeLoaderAnimation() {
	$('.loader').removeClass('active');
	$('.app-container').css('visibility', 'visible');
}
function addLoaderAnimation() {
	$('.loader').addClass('active');
	$('.app-container').css('visibility', 'hidden');
}
