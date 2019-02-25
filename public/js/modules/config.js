export const config = {
  baseUrl: 'https://api.pokemontcg.io/v1/cards?pageSize=250&setCode=',
  defaultSet: 'sm7',
  currentSet: setCode => {
    // check what set should be loaded
    return setCode ? setCode : config.defaultSet
  },
  url: () => {
    return config.baseUrl + config.defaultSet
  }
}
