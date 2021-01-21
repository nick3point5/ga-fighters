function Stats() {
	statStr = [
		'health',
		'mana',
		'attack',
		'defence',
		'spclAttack',
		'spclDefence',
	];

	stat = [];

	for (let i = 0; i < statStr.length; i++) {
		stat.push(document.getElementById(statStr[i]));
	}

	skillpts = +document.getElementById('skillpoints').textContent;

	document.getElementById('skillpoints').textContent = skillpts;

	for (let i = 0, eleUp = null; i < 2; i++) {
		eleUp = document.getElementById(`${statStr[i]}-up-stat-btn`);
		eleUp.addEventListener('click', () => {
			if (skillpts > 0) {
				stat[i].value = +stat[i].value + 20;
				skillpts -= 1;
				document.getElementById('skillpoints').textContent = skillpts;
			}
		});

		const eleDn = document.getElementById(`${statStr[i]}-down-stat-btn`);
		eleDn.addEventListener('click', () => {
			if (+stat[i].value > 0 && +stat[i].value > 20) {
				stat[i].value = +stat[i].value - 20;
				skillpts += 1;
				document.getElementById('skillpoints').textContent = skillpts;
			}
		});
	}

	for (let i = 2, eleUp = null; i < statStr.length; i++) {
		eleUp = document.getElementById(`${statStr[i]}-up-stat-btn`);
		eleUp.addEventListener('click', () => {
			if (skillpts > 0) {
				stat[i].value = +stat[i].value + 1;
				skillpts -= 1;
				document.getElementById('skillpoints').textContent = skillpts;
			}
		});

		const eleDn = document.getElementById(`${statStr[i]}-down-stat-btn`);
		eleDn.addEventListener('click', () => {
			if (+stat[i].value > 0 && +stat[i].value > 1) {
				stat[i].value = +stat[i].value - 1;
				skillpts += 1;
				document.getElementById('skillpoints').textContent = skillpts;
			}
		});
	}
}
function err() {
	if (window.location.search) {
		const error = document.getElementById('error-message');
		error.textContent = window.location.search
			.split('%22')[1]
			.replaceAll('%20', ' ');
		error.classList.remove('hidden');
	}
}
// // ALL MAPS FOR GAME AND RANDOM GENERATING FUNCTION FOR MAPS
// const maps = [
// 	'africa.gif',
// 	'aquarium.gif',
// 	'asia.gif',
// 	'atlantis.gif',
// 	'blockade.gif',
// 	'burnt-down-village.gif',
// 	'china-dark.gif',
// 	'china-light.gif',
// 	'city.gif',
// 	'cliff-side-dark.gif',
// 	'cliff-side.gif',
// 	'corner.gif',
// 	'country-side.gif',
// 	'desert.gif',
// 	'final-arena.gif',
// 	'foggy-forest-cabin.gif',
// 	'fortune-teller.gif',
// 	'gotta-go.gif',
// 	'gym.gif',
// 	'hollywood.gif',
// 	'holy-temple.gif',
// 	'leaf-village.gif',
// 	'market.gif',
// 	'medow.gif',
// 	'monestary.gif',
// 	'old-school.gif',
// 	'peaceful.gif',
// 	'peru.gif',
// 	'pier.gif',
// 	'race-track.gif',
// 	'sewers.gif',
// 	'ship.gif',
// 	'snowy-place.gif',
// 	'spirit-world.gif',
// 	'stream.gif',
// 	'temple-of-doom.gif',
// 	'tokyo.gif',
// 	'train-station.gif',
// 	'truck-stop.gif',
// 	'urinal.gif',
// 	'village.gif',
// 	'windmill.gif',
// ];

// function backg() {
// 	const backg = document.querySelector('.game-window');
// 	let mapChoice = maps[Math.floor(Math.random() * maps.length)];
// 	backg.setAttribute('Style', `background-image: url(/assets/${mapChoice});`);
// }

// document.getElementById('change-map').addEventListener('click', backg());
