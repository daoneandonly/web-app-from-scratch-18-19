export const router = () => {
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
      api.get(config.url()).then(data => {
        render.allCards(data)
      })
    },
    '/cards/:id': id => {
      api.get(config.url()).then(data => {
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
      api.get(config.url()).then(data => {
        const newData = dataObject.filterData(data, 'name', inputValue)
        render.allCards(newData)
      })
    },
    '/search&type=:inputValue': inputValue => {
      console.log('Searching for TYPE: ' + inputValue)
      api.get(config.url()).then(data => {
        const newData = dataObject.filterData(data, 'types', inputValue)
        render.allCards(newData)
      })
    },
    '/search&rarity=:inputValue': inputValue => {
      console.log('Searching for RARITY: ' + inputValue)
      api.get(config.url()).then(data => {
        const newData = dataObject.filterData(data, 'rarity', inputValue)
        render.allCards(newData)
      })
    },
    '/search&text=:inputValue': inputValue => {
      console.log('Searching for CARDTEXT: ' + inputValue)
      api.get(config.url()).then(data => {
        const newData = dataObject.filterData(data, 'text', inputValue)
        render.allCards(newData)
      })
    }
  })
}
