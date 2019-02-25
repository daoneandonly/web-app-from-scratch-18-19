export const render = {
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
      render.main.innerHTML = '<h1>No cards found :( </h1>'
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
