import { h, render, Component } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import './appListing.css'
import * as R from 'ramda'
import {
  fetchRequest,
  hasPassedADay
} from '../utilities/helper.js'
import { openDB, deleteDB, wrap, unwrap } from 'idb'

const AppRecommendation = (props) => {
  const [app, setApp] = useState([])

  const accessResults = R.pipe(
    R.prop('feed'),
    R.prop('results')
  )

  useEffect(
    async () => {
      const appDB = await openDB('app', 1, {
        upgrade (db) {
          db.createObjectStore('app-recommendation')
        }
      })

      const apiUrl = 'https://cors-anywhere.herokuapp.com/https://rss.itunes.apple.com/api/v1/hk/ios-apps/top-grossing/all/10/explicit.json'

      const response = await fetchRequest(apiUrl)

      console.log(response)

      setApp(response)
    },
    []
  )

  return (
    <p>This is app recommendation</p>
  )
}

export default AppRecommendation
