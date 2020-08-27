import { h, render, Component } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import * as R from 'ramda'
import './appListing.css'
import {
  fetchRequest
} from '../utilities/helper.js'

const AppListing = (props) => {
  const [app, setApp] = useState([])

  const [listingNum, setListingNum] = useState(10)

  const accessResults = R.pipe(
    R.prop('feed'),
    R.prop('results')
  )

  useEffect(
    async () => {
      const apiUrl = `https://cors-anywhere.herokuapp.com/https://rss.itunes.apple.com/api/v1/hk/ios-apps/top-free/all/${listingNum}/explicit.json`

      const response = await fetchRequest(apiUrl)

      const appIdString = await R.pipe(
        accessResults,
        R.pluck('id'),
        R.join(',')
      )(response)

      const appDetails = await fetchRequest(`https://cors-anywhere.herokuapp.com/https://itunes.apple.com/hk/lookup?id=${appIdString}`)

      const finalResponse = R.prop('results')(appDetails)

      console.log(finalResponse)

      setApp(finalResponse)
    },
    []
  )

  const renderResult = ({ trackCensoredName, trackViewUrl, genres, artistName, artistViewUrl, artworkUrl512, averageUserRating }) => (
    <li>
      <a href={trackViewUrl}>
        <img src={artworkUrl512} alt={trackCensoredName} loading="lazy" />
      </a>
      <a href={trackViewUrl}>{trackCensoredName}</a>
      <div>
        <a href={artistViewUrl}>{artistName}</a>
      </div>
    </li>
  )

  return (
    <ul id="app-listing">
      {
        R.pipe(
          R.unless(
            R.isNil,
            R.map(renderResult)
          )
        )(app)
      }
    </ul>
  )
}

export default AppListing
