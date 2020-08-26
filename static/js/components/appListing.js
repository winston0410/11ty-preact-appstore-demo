import { h, render, Component } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import * as R from 'ramda'

const AppListing = (props) => {
  const [app, setApp] = useState([])

  useEffect(
    async () => {
      const apiUrl = 'https://cors-anywhere.herokuapp.com/' + 'https://rss.itunes.apple.com/api/v1/hk/ios-apps/top-free/all/10/explicit.json'
      const response = await fetch(apiUrl)
        .then(response => response.json())

      setApp(response)
    },
    []
  )

  const renderResult = ({ name, url, genres }) => (
    <li>
      <a href={url}>{name}</a>
    </li>
  )

  return (
    <ul>
      {
        R.pipe(
          R.prop('feed'),
          R.prop('results'),
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
