import * as R from 'ramda'
import { openDB, deleteDB, wrap, unwrap } from 'idb'

// Credit: https://chrisboakes.com/how-a-javascript-debounce-function-works/
function debounce (callback, wait) {
  let timeout
  return (...args) => {
    const context = this
    clearTimeout(timeout)
    timeout = setTimeout(() => callback.apply(context, args), wait)
  }
}

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
  (v) => R.gte(v, half(document.body.scrollHeight))
)(window.scrollY)

export {
  fetchRequest,
  hasPassedADay,
  accessResults,
  checkIfDataReady,
  setUpDB,
  shouldSendRequest,
  debounce,
  hasScrolledHalfPage,
  half
}
