export const dataObject = {
  localStorage: () => {
    return window.localStorage
  },
  setStorage: data => {
    dataObject.localStorage().setItem('data', JSON.stringify(data))
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
