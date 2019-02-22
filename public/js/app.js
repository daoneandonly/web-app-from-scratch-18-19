;(() => {
  'use strict'

  console.log('Hello Pokémon fan.')

  const localStorage = window.localStorage
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

  const utility = {
    capitalize: word => {
      return word.charAt(0).toUpperCase() + word.slice(1)
    },
    setStorage: data => {
      localStorage.setItem('data', JSON.stringify(data))
    },
    getStorage: () => {
      return api.parse(localStorage.getItem('data'))
    }
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
    filter: (data, key, filterWord) => {
      console.log(
        'Filtering for the word "' +
          filterWord +
          '" in the category "' +
          key +
          '"'
      )
      if (filterWord == '') {
        return data
      }
      let filterData = data.cards.filter(x => {
        if (x[key] === undefined) {
          return false
        }
        if (
          x[key]
            .toString()
            .toLowerCase()
            .includes(filterWord.toLowerCase())
        ) {
          return true
        }
      })
      return { cards: filterData }
    },
    match: (data, key, matchWord) => {
      console.log(
        'Matched for the word "' + matchWord + '" in the category "' + key + '"'
      )
      if (matchWord == '') {
        return data
      }
      let filterData = data.cards.filter(x => {
        if (x[key] === undefined) {
          return false
        }
        if (x[key] == matchWord) {
          return true
        }
      })
      return { cards: filterData }
    }
  }

  const render = {
    allCards: data => {
      // function that renders the text of the card
      let listOfCards = data.cards.map(data => {
        return `
        <section class="smallCard">
          <a href="#/cards/${data.id}">
						<img class='previewImage' src='${data.imageUrl}'/>
					</a>
        </section>
        `
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
      <a href="#/overview" class='back'><button>← Back to list</button></a>
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
      document.title = 'PokémonTCG Webapp'
    },
    updateSearch: searchBy => {
      const input = document.querySelector('.searchField')
      input.placeholder = 'Search by ' + searchBy
    },
    checkEmpty: (renderValue, element) => {
      if (renderValue) {
        return `<${element}>${renderValue}</${element}>`
      }
      return ''
    }
  }

  const init = {
    inputListen: () => {
      // eventListener to any change on the input element
      const input = document.querySelector('.searchField')
      input.addEventListener('change', e => {
        console.log('Heard a change on Input')
        const inputValue = e.target.value
        if (inputValue == '') {
          window.location.hash = '/overview'
          render.updateSearch('name')
        }
        if (inputValue != '') {
          var radioStatus = document.querySelectorAll('input[type=radio]')
          console.log(radioStatus)
          if (radioStatus[0].checked) {
            window.location.hash = '/search&name=' + inputValue
          }
          if (radioStatus[1].checked) {
            window.location.hash = '/search&type=' + inputValue
          }
        }
      })
    },
    radioListen: () => {
      const radioList = document.querySelectorAll('input[type=radio]')
      radioList.forEach(currentRadio => {
        currentRadio.addEventListener('click', () => {
          if (currentRadio.checked) {
            render.updateSearch(currentRadio.value)
          }
        })
      })
    },
    start: () => {
      init.inputListen()
      render.updateSearch('name')
      init.radioListen()
    }
  }

  routie({
    '': () => {
      api.load(url).then(data => {
        console.log('Routie on route "/" is triggered.')
        render.allCards(data)
        utility.setStorage(data)
      })
    },
    '/overview': () => {
      const localData = utility.getStorage()
      console.log('Routie on route "overview" is triggered.')
      if (localData != '') {
        console.log('Found local data for overview!')
        render.allCards(localData)
      }
      if (localData == undefined) {
        api.load(url).then(data => {
          render.allCards(data)
        })
      }
    },
    '/cards/:id': id => {
      const localData = utility.getStorage()
      if (localData != '') {
        console.log('Found local data for a single card!')
        const currentCard = api.match(localData, 'id', id).cards
        main.innerHTML = render.singleCard(currentCard[0])
      }
      if (localData == undefined) {
        api.load(url).then(data => {
          const currentCard = api.match(data, 'id', id).cards
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
    },
    '/search&name=:inputValue': inputValue => {
      console.log('Searching for NAME: ' + inputValue)
      const localData = utility.getStorage()
      if (localData != '') {
        console.log('Found local data for a search entree')
        const newData = api.filter(localData, 'name', inputValue)
        render.allCards(newData)
      }
      if (localData == undefined) {
        api.load().then(data => {
          const newData = api.filter(data, 'name', inputValue)
          render.allCards(newData)
        })
      }
    },
    '/search&type=:inputValue': inputValue => {
      console.log('Searching for TYPE: ' + inputValue)
      const localData = utility.getStorage()
      if (localData != '') {
        console.log('Found local data for a search entree')
        console.log(localData)
        const newData = api.filter(localData, 'types', inputValue)
        render.allCards(newData)
      }
      if (localData == undefined) {
        api.load().then(data => {
          console.log(data)
          const newData = api.filter(data, 'types', inputValue)
          render.allCards(newData)
        })
      }
    }
  })
  // update title
  render.refreshTitle(config.defaultSet)

  init.start()
})()
