export const api = {
  get: variableUrl => {
    if (dataObject.localStorage() != '') {
      console.log('Found local data')
      return new Promise((resolve, reject) => {
        resolve(dataObject.getStorage())
      })
    } else {
      return this.load(variableUrl)
    }
  },
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
