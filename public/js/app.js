// Config file
import { config } from './modules/config.js'

// Helper functions
import { utility } from './modules/utility.js'

;(() => {
  'use strict'

  const dataObject = {
    localStorage: () => {
      return window.localStorage
    },
    setStorage: data => {
      dataObject.localStorage().setItem(config.currentSet(), JSON.stringify(data))
    },
    getData: variableUrl => {
      if (dataObject.localStorage().getItem(config.currentSet())) {
        return new Promise((resolve, reject) => {
          resolve(dataObject.getStorage())
        })
      } else {
        return api.load(variableUrl)
      }
    },
    getStorage: () => {
      return api.parse(dataObject.localStorage().getItem(config.currentSet()))
    },
    filterData: (data, key, filterWord) => {
      if (filterWord == '') {
        return data
      }
      let filterData = data.cards.filter(x => {

        function checkFilter (key, path) {
          if (
            path[key]
              .toString()
              .toLowerCase()
              .includes(filterWord.toLowerCase())
        ) {
            return true
          }
        }

        if (key === 'text') {
          if (checkFilter('name', x)) {
            return true
          }
        }

        if (key === 'text' && x.ability) {
          if (checkFilter('text', x.ability) || checkFilter('name', x.ability)) {
            return true
          }
        }

        if (key === 'text' && x.attacks) {
          for (let i = 0; i < x.attacks.length; i++) {
            if (checkFilter('text', x.attacks[i]) || checkFilter('name', x.attacks[i])) {
              return true
            }
          }
        }
        
        if (x[key] === undefined) {
          return false
        }

        return checkFilter(key, x)        
      })
      return { cards: filterData }
    },
    matchData: (data, key, matchWord) => {
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
        request.open('GET', variableUrl, true)
        request.addEventListener('load', () => {
          if (request.status == 200) {
            const data = api.parse(request.responseText)
            data.cards.sort((a, b) => (Number(a.number) > Number(b.number)) || a.number.includes('a') ? 1 : -1)
            resolve(data)
          }
          if (request.status >= 400) {
            reject(error)
            throw new error('Something went wrong with getting the data!')
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
      if (listOfCards.length == 0) {
        render.main.innerHTML = `
        <h1>No cards found :(</h1>
          <a href="#/overview" class='back'><button>← Back to list</button></a>`
      }
      if (listOfCards.length > 0) {
        render.main.innerHTML = listOfCards.join('')
      }
    },
    singleCard: data => (`
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
            <p>
              <em>
                ${data.subtype} 
                ${data.evolvesFrom ? `(evolves from ${data.evolvesFrom})`: ''}
              </em>
            </p>
  				</section>

  				<section class='cardAttacks'>
            ${data.ability ? `
              <h3 class="ability">${data.ability.name}</h3>
              <p>${data.ability.text}</p>`
               : ''
            }
  					${render.renderAttacks(data.attacks)}
            ${render.checkEmpty(data.text, 'p')}
  				</section>

          <section class="cardFooter">
          ${data.weaknesses ? (`
            <section class="weakness">
              <h4>Weakness</h4>
              <p>${render.costToImage([data.weaknesses[0].type])} ${data.weaknesses[0].value}</p>
            </section>`
          ) : ''}
          ${data.resistances ? (`
            <section class="resistance">
              <h4>Resistance</h4>
              <p>${render.costToImage([data.resistances[0].type])} ${data.resistances[0].value}</p>
            </section>`
          ) : ''}
          
          ${data.resistances ? (`
            <section class="retreat">
              <h4>Retreat</h4>
              <p>${render.costToImage(data.retreatCost)}</p>
            </section>`
          ) : ''}
          
            <p>#${data.number}</p>
            <img src="https://images.pokemontcg.io/${data.setCode}/symbol.png" 
              class="setImage"
            />
              <section class="cardArtist">
                <h3>Artist:</h3>
                <p>${data.artist}</p>
            </section>
          </section>
  			</section>
  		</section>
  		`
    ),
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
        search.execute()
      })
    },
    radioListen: () => {
      search.radioList.forEach(currentRadio => {
        currentRadio.addEventListener('click', e => {
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
          dataObject.getData(config.url()).then(data => {
            render.allCards(data)
            dataObject.setStorage(data)
          })
        },
        '/overview': () => {
          dataObject.getData(config.url()).then(data => {
            render.allCards(data)
            render.refreshTitle(data)
          })
        },
        '/cards/:id': id => {
          dataObject.getData(config.url()).then(data => {
            const currentCard = dataObject.matchData(data, 'id', id).cards
            render.main.innerHTML = render.singleCard(currentCard[0])
          })
        },
        '/search&name=:inputValue': inputValue => {
          dataObject.getData(config.url()).then(data => {
            const newData = dataObject.filterData(data, 'name', inputValue)
            render.allCards(newData)
          })
        },
        '/search&type=:inputValue': inputValue => {
          dataObject.getData(config.url()).then(data => {
            const newData = dataObject.filterData(data, 'types', inputValue)
            render.allCards(newData)
          })
        },
        '/search&rarity=:inputValue': inputValue => {
          dataObject.getData(config.url()).then(data => {
            const newData = dataObject.filterData(data, 'rarity', inputValue)
            render.allCards(newData)
          })
        },
        '/search&text=:inputValue': inputValue => {
          dataObject.getData(config.url()).then(data => {
            const newData = dataObject.filterData(data, 'text', inputValue)
            render.allCards(newData)
          })
        },
        '/set/:set': set => {
          config.userSet = set
          dataObject.getData(config.url()).then( data => {
            render.allCards(data)
            render.refreshTitle(data)
            dataObject.setStorage(data)
          })
        }
      })
    }
  }

  app.start()
})()
