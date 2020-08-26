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

      await console.log(response)
    }
  )

  return (
    <ul>
      {
        R.map(
          (app) => <li>Hello</li>
        )(app)
      }
    </ul>
  )
}

export default AppListing
