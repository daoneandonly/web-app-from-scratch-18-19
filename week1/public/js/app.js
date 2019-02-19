;(() => {
  'use strict'

  console.log('Hello Pokémon fan.')

  const main = document.querySelector('main')
  const config = {
    defaultSet: 'sm9',
    baseUrl: 'https://api.pokemontcg.io/v1/cards?pageSize=170&setCode=',
    currentSet: setCode => {
      // check what set should be loaded
      return setCode ? setCode : config.defaultSet
    }
  }
  const url = config.baseUrl + config.defaultSet
  const input = document.querySelector('input')

  const utility = {
    capitalize: word => {
      return word.charAt(0).toUpperCase() + word.slice(1)
    }
    // multiFilter: (data, listOfFilters, filterWord) => {\
    // 	let filteredObject = {}
    //   listOfFilters.forEach(singleFilter => {
    //     api.filter(data, singleFilter, filterWord)
    //   })
    // }
  }
  const api = {
    load: variableUrl => {
      return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest()
        console.log('Requesting data from API')
        request.open('GET', variableUrl, true)
        request.addEventListener('load', () => {
          if (request.status == 200) {
            const data = api.parse(request.responseText)
            console.log('API returned ' + data.cards.length + ' cards')
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
    parse: responseText => {
      return JSON.parse(responseText)
    },
    filter: (data, b, filterWord) => {
      console.log(
        'Filtering for the word "' +
          filterWord +
          '" in the category "' +
          b +
          '"'
      )
      if (filterWord == '') {
        return data
      }
      let filterData = data.cards.filter(x => {
        if (x[b] === undefined) {
          return false
        }
        if (x[b].toLowerCase().includes(filterWord.toLowerCase())) {
          return true
        }
      })
      return { cards: filterData }
    }
  }

  routie({
    '': () => {
      api.load(url).then(data => {
        console.log('Routie on route "/" is triggered.')
        render.allCards(data)
      })
    },
    overview: () => {
      api.load(url).then(data => {
        console.log('Routie on route "overview" is triggered.')
        render.allCards(data)
      })
    },
    '/cards/:id': id => {
      api.load(url).then(data => {
        const currentCard = api.filter(data, 'id', id).cards
        console.log(
          'Showing single page for ' +
            currentCard.length +
            ' card with name "' +
            currentCard[0].name +
            '"'
        )
        main.innerHTML = render.singleCard(currentCard[0])
      })
    }
  })

  const render = {
    allCards: data => {
      // function that renders the text of the card
      let listOfCards = data.cards.map(data => {
        return render.singleCard(data)
      })
      console.log('Rendered ' + listOfCards.length + ' cards')
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
					<a href="#/cards/${data.id}">
						<img class='previewImage' src='${data.imageUrlHiRes}'/>
					</a>
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
      input.placeholder = 'Search by name'
      document.title = 'PokémonTCG Webapp'
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
    const inputValue = e.target.value
    api.load(url).then(data => {
      console.log('Heard a change on Input')
      const newData = api.filter(data, 'name', inputValue)
      render.allCards(newData)
    })
  })
})()
