import { watchSelector } from 'watch-selector-visible-area'

window.cancleWatch = watchSelector('.hello', x => console.log('change happen', new Date(), x))
