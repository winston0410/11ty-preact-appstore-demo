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

  useEffect(
    async () => {
      const apiUrl = `https://cors-anywhere.herokuapp.com/https://rss.itunes.apple.com/api/v1/hk/ios-apps/top-free/all/${listingNum}/explicit.json`
      const response = await fetchRequest(apiUrl)

      setApp(response)
    },
    []
  )

  const renderResult = ({ name, url, genres, artistName, artistUrl }) => (
    <li>
      <a href={url}>{name}</a>
      <div>
        <a href={artistUrl}>{artistName}</a>
      </div>
    </li>
  )

  return (
    <ul id="app-listing">
      {
        R.pipe(
          R.prop('feed'),
          R.prop('results'),
          R.tap(console.log),
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
