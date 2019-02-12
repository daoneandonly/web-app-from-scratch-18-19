;(() => {
  'use strict'

  console.log('Hello Pokémon fan.')

  const main = document.querySelector('main')
  const config = {
    defaultSet: 'sm2',
    baseUrl: 'https://api.pokemontcg.io/v1/cards?setCode='
  }
  const url = config.baseUrl + config.defaultSet
  const input = document.querySelector('input')

  refreshTitle(config.defaultSet)
  function currentSet(setCode) {
    return setCode ? setCode : config.defaultSet
  }

  // eventListener to any change on the input element
  input.addEventListener('change', e => {
    const inputValue = e.target.value.toLowerCase()
    const setCode = inputValue ? inputValue : config.defaultSet
    const newUrl = config.baseUrl + currentSet(setCode)
    refreshTitle(currentSet())
    load(newUrl).then(data => {
      handleAllCards(data)
    })
  })

  // create new XHR
  const load = variableUrl => {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest()
      request.open('GET', variableUrl, true)
      request.addEventListener('load', () => {
        if (request.status == 200) {
          const data = JSON.parse(request.responseText)
          console.log('Loaded ' + data.cards.length + ' cards.')
          resolve(data)
        }
        if (request.status >= 400) {
          reject(error)
          console.log('Something went wrong!')
        }
      })
      request.send()
    })
  }

  load(url).then(data => {
    handleAllCards(data)
  })

  function refreshTitle(set) {
    const message = 'Now showing ' + set
    input.placeholder = config.defaultSet
    document.title = message
  }

  // function that renders the text of the card
  function handleAllCards(data) {
    let listOfCards = ''
    data.cards.forEach(data => {
      listOfCards += handleSingleCard(data)
    })
    main.innerHTML = listOfCards
  }

  function checkEmpty(renderValue, element) {
    if (renderValue) {
      return `<${element}>${renderValue}</${element}>`
    }
    return ''
  }

  // function that handles individual cards
  function handleSingleCard(data) {
    // console.log(data.name + " is rendered")

    // render the attack and call the costToImage function to load symbols
    function renderAttacks(attacks) {
      let listOfAttacks = ''
      if (attacks) {
        attacks.forEach(attack => {
          listOfAttacks += `<section class='singleAttack'>
						<section class="attackCost">
							${costToImage(attack.cost)}
						</section>
						<section class='attackName'>
							<h3>${attack.name}</h3>
						</section>
						<section class='attackDamage'>
							${checkEmpty(attack.damage, 'h3')}
						</section>
						<section class="attackDescription">
							<p>${attack.text}</p>
						</section>
					</section>`
        })
      }

      return listOfAttacks
    }
    // loop through the text value of an attack and use the <i> as a symbol for every value
    function costToImage(cost) {
      if (cost === undefined) {
        return ''
      }
      let totalCost = cost.map(element => {
        return `<i class='energy ${element.toLowerCase()}'></i>`
      })
      return totalCost.join('')
    }
    // create a string of html for the card
    let format = `
		<section class="card">
			<section class='left half'>
				<img class='previewImage' src='${data.imageUrlHiRes}'/>
				</section>

				<section class='right half'>

				<section class='cardDetails'>
					<h3>${data.name}</h3>
					<section class='detailsHp'>
						${checkEmpty(data.hp, 'h3')}
						${checkEmpty(costToImage(data.types), 'p')}
					</section>
					<p>${data.subtype}</p>
				</section>

				<section class='cardAttacks'>
					${renderAttacks(data.attacks)}
					${checkEmpty(data.text, 'p')}
				</section>

				<section class="cardArtist">
					<h3>Artist:</h3>
					<p>${data.artist}</p>
				</section>
			</section>
		</section>
		`
    // insert format within main element
    return format
  }
})()
