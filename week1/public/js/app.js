(() => {
	console.log('Hello Pokémon fan.')

	const main = document.querySelector('main')
	const defaultSet = 'base2';
	const url = 'https://api.pokemontcg.io/v1/cards?setCode=' + defaultSet
	const input = document.querySelector('input')

	refreshTitle(defaultSet)

	function currentSet(setCode){
		return setCode ? setCode : defaultSet
	}

	// eventListener to any change on the input element
	input.addEventListener('change', (e) => {
		const setCode = e.target.value.toLowerCase() ? e.target.value.toLowerCase() : defaultSet
		const newUrl = 'https://api.pokemontcg.io/v1/cards?setCode=' + currentSet(setCode)
		refreshTitle(currentSet())
		request.open('GET', newUrl, true)
		request.send()
	})

	// create new XHR
	const request = new XMLHttpRequest()
	request.onload = () => {
		if (request.status == 200) {
			const data = JSON.parse(request.responseText)
			console.log("The app loaded " + data.cards.length + " cards from set " + currentSet(input.value.toLowerCase()) + ".")
			handleAllCards(data)
			return
		}
		if (request.error){
			console.log("Error!")
			console.log(request.error)
			return
		}
	}

	function refreshTitle (set) {
		const message = 'Now showing ' + set
		input.placeholder = defaultSet;
		document.title = message
	}

	// function that renders the text of the card

	function handleAllCards(data) {
		let listOfCards = ''
		data.cards.forEach((data) => {
			listOfCards += handleSingleCard(data)
		})
		main.innerHTML = listOfCards
	}


	function handleSingleCard(data){
		// console.log(data.name + " is rendered")



		// render the attack and call the costToImage function to load symbols
		function renderAttacks(attacks) {
			let listOfAttacks = ''
			if (attacks){
				attacks.forEach((attack) => {
					listOfAttacks +=
					`<section class='singleAttack'>
					${costToImage(attack.cost)}
					<h3>${attack.name}</h3>
					<p>${attack.text}</p>
					<h3 class='damage'>${attack.damage}</h3>
					</section>
					`
				})
			}

			return listOfAttacks
		}
		// loop through the text value of an attack and use the <i> as a symbol for every value
		function costToImage(cost){
			if (cost === undefined){return}
			let totalCost = ''
			cost.forEach((element) => {
				totalCost +=
				`<i class='energy ${element.toLowerCase()}'></i>`
			})
			return totalCost
		}
		// create a string of html for the card
		let format =`
		<section class="card">

		<section class='left half'>
		<img class='previewImage' src='${data.imageUrlHiRes}'/>
		</section>

		<section class='right half'>

		<section class='name'>
		<h3>${data.name}</h3>
		<h3>HP: ${data.hp}</h3>
		<p>${data.subtype}</p>
		<p>Type: ${ costToImage(data.types)}</p>
		</section>

		<section class='attack'>
		${renderAttacks(data.attacks)}
		</section>

		<section>
		<h3>Artist</h3>
		<p>${data.artist}</p>
		</section>

		</section>

		</section>
		`
		// insert format within main element
		return format
	}

	//open and send initial request
	request.open('GET', url, true)
	request.send()
})()
