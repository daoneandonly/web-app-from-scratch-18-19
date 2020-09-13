export const config = {
  baseUrl: 'https://api.pokemontcg.io/v1/cards?pageSize=250&setCode=',
  defaultSet: 'swsh2',
  userSet: null,
  currentSet: () => (config.userSet ? config.userSet : config.defaultSet),
  url: () => (config.baseUrl + config.currentSet())
}
