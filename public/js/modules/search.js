export const search = {
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
