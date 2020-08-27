import { h, render, Component } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import './appRecommendation.css'
import * as R from 'ramda'
import {
  fetchRequest,
  hasPassedADay,
  accessResults,
  checkIfDataReady
} from '../utilities/helper.js'
import { openDB, deleteDB, wrap, unwrap } from 'idb'
import GenreList from './genreList.js'

const AppRecommendation = (props) => {
  const [app, setApp] = useState([])

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

  const renderResult = ({ name, url, genres, artistName, artistUrl, artworkUrl100 }) => (
    <li itemProp="itemListElement" itemScope itemType="http://schema.org/MobileApplication">
      <a href={url}>
        <img itemProp="image" src={artworkUrl100} alt={name} loading="lazy" />
      </a>
      <section className="app-info">
        <h2>
          <a href={url}>{name}</a>
        </h2>
        <GenreList data={genres}/>
        <div>
          <a href={artistUrl} itemProp="name">{artistName}</a>
        </div>
      </section>
    </li>
  )

  return (
    <ul id="app-recommendation" itemScope itemType="http://schema.org/ItemList">
      {
        R.pipe(
          accessResults,
          checkIfDataReady(renderResult)
        )(app)
      }
    </ul>
  )
}

export default AppRecommendation
