import * as R from 'ramda'
import { openDB, deleteDB, wrap, unwrap } from 'idb'

// Credit: https://gist.github.com/tommmyy/daf61103d6022cd23d74c71b0e8adc0d
const debounce_ = R.curry((immediate, timeMs, fn) => () => {
  let timeout

  return (...args) => {
    const later = () => {
      timeout = null

      if (!immediate) {
        R.apply(fn, args)
      }
    }

    const callNow = immediate && !timeout

    clearTimeout(timeout)
    timeout = setTimeout(later, timeMs)

    if (callNow) {
      R.apply(fn, args)
    }

    return timeout
  }
})

const fetchRequest = (apiUrl) => fetch(apiUrl)
  .then(response => response.json())

// 24rs in ms = 86400000
const hasPassedADay = R.pipe(
  R.subtract(Date.now),
  R.lt(86400000)
)

const accessResults = R.pipe(
  R.prop('feed'),
  R.prop('results')
)

const checkIfDataReady = (fn) => (app) => R.pipe(
  R.unless(
    R.isNil,
    R.map(fn)
  )
)(app)

const setUpDB = async () => await openDB('app', 1, {
  upgrade (db) {
    db.createObjectStore('applist')
    db.createObjectStore('app-recommendation')
  }
})

const shouldSendRequest = (timestamp) => (callback) => (appData) => R.when(
  R.anyPass(
    [
      R.isNil,
      () => hasPassedADay(timestamp)
      // Also test if page number is greater than the current number
    ]
  ),
  callback
)(appData)

const half = R.divide(R.__, 2)

const hasScrolledHalfPage = R.when(
  R.gte(R.__, half(document.body.scrollHeight))
)

export {
  fetchRequest,
  hasPassedADay,
  accessResults,
  checkIfDataReady,
  setUpDB,
  shouldSendRequest,
  debounce_,
  hasScrolledHalfPage
}
