import { config } from './modules/config.js'
import { utility } from './modules/utility.js'

// router.routie()
;(() => {
  'use strict'

  console.log('Hello Pokémon fan.')

  const dataObject = {
    localStorage: () => {
      return window.localStorage
    },
    setStorage: data => {
      dataObject.localStorage().setItem('data', JSON.stringify(data))
    },
    getData: variableUrl => {
      if (dataObject.localStorage() != '') {
        console.log('Found local data')
        return new Promise((resolve, reject) => {
          resolve(dataObject.getStorage())
        })
      } else {
        return api.load(variableUrl)
      }
    },
    getStorage: () => {
      return api.parse(dataObject.localStorage().getItem('data'))
    },
    filterData: (data, key, filterWord) => {
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
    matchData: (data, key, matchWord) => {
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
    }
  }

  const render = {
    main: document.querySelector('main'),
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
        render.main.innerHTML = `
        <h1>No cards found :(</h1>
          <a href="#/overview" class='back'><button>← Back to list</button></a>`
      }
      if (listOfCards.length > 0) {
        render.main.innerHTML = listOfCards.join('')
      }
    },
    singleCard: data => {
      // function that handles individual cards
      // create a string of html for the card
      let format = `
  		<section class="card">
      <a href="#/overview" class='back'><button>← Back to list</button></a>
  			<section class='left half'>
  				<a href="${data.imageUrlHiRes}" target="_blank">
  					<img class='largeImage' src='${data.imageUrlHiRes}'/>
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
    refreshTitle: data => {
      const header = document.querySelector('h1')
      const titleMessage =
        data.cards[0].series +
        ' ' +
        data.cards[0].set +
        ' (' +
        data.cards.length +
        ' cards)'
      document.title = 'PokémonTCG Webapp: ' + titleMessage
      header.innerHTML = titleMessage
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
    },
    searchLabel: searchName => {
      return `
        <section class='searchLabel ${searchName}'>
          <p>${searchName}</p>
        </section>
      `
    }
  }

  const search = {
    textInput: document.querySelector('.searchField'),
    radioList: document.querySelectorAll('input[type=radio]'),
    inputListen: () => {
      // eventListener to any change on the input element
      search.textInput.addEventListener('keyup', () => {
        console.log('Heard a change on Input')
        search.execute()
      })
    },
    radioListen: () => {
      search.radioList.forEach(currentRadio => {
        currentRadio.addEventListener('click', e => {
          console.log('Heard a change on radio')
          if (currentRadio.checked) {
            render.updateSearch(currentRadio.value)
            search.execute(e)
            search.textInput.focus()
          }
        })
      })
    },
    execute: () => {
      const inputValue = search.textInput.value
      if (inputValue == '' || inputValue.length < 2) {
        window.location.hash = '/overview'
      }
      if (inputValue.length > 1) {
        for (let i = 0; i < search.radioList.length; i++) {
          if (search.radioList[i].checked) {
            window.location.hash =
              '/search&' + search.radioList[i].value + '=' + inputValue
          }
        }
      }
    }
  }

  const app = {
    start: () => {
      search.inputListen()
      search.radioListen()
      render.updateSearch('name')
      routie({
        '': () => {
          api.load(config.url()).then(data => {
            console.log('Routie on route "/" is triggered.')
            render.allCards(data)
            render.refreshTitle(data)
            dataObject.setStorage(data)
          })
        },
        '/overview': () => {
          dataObject.getData(config.url()).then(data => {
            render.allCards(data)
            search.textInput.value = ''
          })
        },
        '/cards/:id': id => {
          dataObject.getData(config.url()).then(data => {
            const currentCard = dataObject.matchData(data, 'id', id).cards
            console.log(
              'Showing single page for ' +
                currentCard.length +
                ' card with name "' +
                currentCard[0].name +
                '"'
            )
            render.main.innerHTML = render.singleCard(currentCard[0])
          })
        },
        '/search&name=:inputValue': inputValue => {
          console.log('Searching for NAME: ' + inputValue)
          dataObject.getData(config.url()).then(data => {
            const newData = dataObject.filterData(data, 'name', inputValue)
            render.allCards(newData)
          })
        },
        '/search&type=:inputValue': inputValue => {
          console.log('Searching for TYPE: ' + inputValue)
          dataObject.getData(config.url()).then(data => {
            const newData = dataObject.filterData(data, 'types', inputValue)
            render.allCards(newData)
          })
        },
        '/search&rarity=:inputValue': inputValue => {
          console.log('Searching for RARITY: ' + inputValue)
          dataObject.getData(config.url()).then(data => {
            const newData = dataObject.filterData(data, 'rarity', inputValue)
            render.allCards(newData)
          })
        },
        '/search&text=:inputValue': inputValue => {
          console.log('Searching for CARDTEXT: ' + inputValue)
          dataObject.getData(config.url()).then(data => {
            const newData = dataObject.filterData(data, 'text', inputValue)
            render.allCards(newData)
          })
        }
      })
    }
  }

  // router.routie()

  app.start()
})()
