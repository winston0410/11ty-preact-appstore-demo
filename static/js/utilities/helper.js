import * as R from 'ramda'
import { openDB, deleteDB, wrap, unwrap } from 'idb'

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

export {
  fetchRequest,
  hasPassedADay,
  accessResults,
  checkIfDataReady,
  setUpDB
}
