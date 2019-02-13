;(() => {
  'use strict'

  console.log('Hello Pokémon fan.')

  const main = document.querySelector('main')
  const config = {
    defaultSet: 'sm2',
    baseUrl: 'https://api.pokemontcg.io/v1/cards?pageSize=170&setCode=',
    currentSet: setCode => {
      // check what set should be loaded
      return setCode ? setCode : config.defaultSet
    }
  }
  const url = config.baseUrl + config.defaultSet
  const input = document.querySelector('input')

  const router = {}

  const api = {
    load: variableUrl => {
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
    },
    parse: '',
    filter: (data, key, filterWord) => {
      let filterData = data.filter(x => x[key] == filterWord)
      return filterData
    }
  }

  const render = {
    allCards: data => {
      // function that renders the text of the card
      const filterData = api.filter(data.cards, 'types', 'Fire')
      let listOfCards = filterData.map(data => {
        return render.singleCard(data)
      })

      console.log('The total of cards I have filtered: ' + listOfCards.length)
      if (listOfCards.length == 0) {
        main.innerHTML = '<h1>No cards found :( </h1>'
      }
      if (listOfCards.length > 0) {
        main.innerHTML = listOfCards.join('')
      }
    },
    singleCard: data => {
      // function that handles individual cards
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
							${render.checkEmpty(data.hp, 'h3')}
							${render.checkEmpty(render.costToImage(data.types), 'p')}
						</section>
						<p>${data.subtype}</p>
					</section>

					<section class='cardAttacks'>
						${render.renderAttacks(data.attacks)}
						${render.checkEmpty(data.text, 'p')}
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
    },
    costToImage: cost => {
      // loop through the text value of an attack and use the <i> as a symbol for every value
      if (cost === undefined) {
        return ''
      }
      let totalCost = cost.map(element => {
        return `<i class='energy ${element.toLowerCase()}'></i>`
      })
      return totalCost.join('')
    },
    renderAttacks: attacks => {
      // render the attack and call the costToImage function to load symbols
      let listOfAttacks = ''
      if (attacks) {
        attacks.forEach(attack => {
          listOfAttacks += `<section class='singleAttack'>
							<section class="attackCost">
								${render.costToImage(attack.cost)}
							</section>
							<section class='attackName'>
								<h3>${attack.name}</h3>
							</section>
							<section class='attackDamage'>
								${render.checkEmpty(attack.damage, 'h3')}
							</section>
							<section class="attackDescription">
								<p>${attack.text}</p>
							</section>
						</section>`
        })
      }
      return listOfAttacks
    },
    refreshTitle: newSet => {
      const message = 'Now showing ' + newSet
      input.placeholder = config.defaultSet
      document.title = message
    },
    checkEmpty: (renderValue, element) => {
      if (renderValue) {
        return `<${element}>${renderValue}</${element}>`
      }
      return ''
    }
  }

  // update title
  render.refreshTitle(config.defaultSet)

  // eventListener to any change on the input element
  input.addEventListener('change', e => {
    const inputValue = e.target.value.toLowerCase()
    const setCode = inputValue ? inputValue : config.defaultSet
    const newUrl = config.baseUrl + config.currentSet(setCode)
    render.refreshTitle(config.currentSet())
    api.load(newUrl).then(data => {
      render.allCards(data)
    })
  })

  api.load(url).then(data => {
    render.allCards(data)
  })
})()
