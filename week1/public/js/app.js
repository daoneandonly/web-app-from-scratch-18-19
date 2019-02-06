console.log('Hello World')

var main = document.querySelector('main')
var setCode = 'base2'
var url = 'https://api.pokemontcg.io/v1/cards?setCode=' + setCode
var input = document.querySelector('input')

refreshTitle(setCode)

// eventListener to any change on the input element
input.addEventListener('change', () => {
  setCode = input.value.toLowerCase()
  url = 'https://api.pokemontcg.io/v1/cards?setCode=' + setCode
  refreshTitle(setCode)
  request.open('GET', url, true)
  request.send()
 })

// create new XHR
var request = new XMLHttpRequest()
request.onload = function() {
    if (request.status == 200) {
      console.log("Loaded")
      var data = JSON.parse(request.responseText)
      handleAllCards(data)
  } else {
    console.log("Error!")
  }
}

function refreshTitle (set) {
  var message = 'Now showing ' + set
  document.querySelector('h1').innerText = message
  document.title = message
}

// function that renders the text of the card

function handleAllCards(data) {
  var listOfCards = ''
  // console.log(data.cards[0].attacks)
  data.cards.forEach(function(data) {
    listOfCards += handleSingleCard(data)
  })
  main.innerHTML = listOfCards
}


function handleSingleCard(data){
  // console.log(data.name + " is rendered")



// render the attack and call the costToImage function to load symbols
  function renderAttacks(attacks) {
    var listOfAttacks = ''
    if (attacks != undefined){
    attacks.forEach(function(attack) {
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
    var totalCost = ''
    cost.forEach(function(element) {
      totalCost +=
      `<i class='energy ${element.toLowerCase()}'></i>`
    })
    return totalCost
  }
// create a string of html for the card
  var format =`
  <section class="card">

    <section class='left half'>
      <img class='previewImage' src='${data.imageUrlHiRes}'/>
    </section>

    <section class='right half'>

      <section class='name'>
        <h3>${data.name}</h3>
        <h3>HP: ${data.hp}</h3>
        <p>${data.subtype}</p>
        <p>Type: ${data.types}</p>
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

//open en send initial request
request.open('GET', url, true)
request.send()
