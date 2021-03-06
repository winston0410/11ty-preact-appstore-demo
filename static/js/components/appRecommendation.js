import { h, render, Component } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import './appRecommendation.css'
import * as R from 'ramda'
import {
  fetchRequest,
  hasPassedADay,
  accessResults,
  checkIfDataReady,
  setUpDB,
  shouldSendRequest
} from '../utilities/helper.js'
import { openDB, deleteDB, wrap, unwrap } from 'idb'
import GenreList from './genreList.js'

const AppRecommendation = (props) => {
  const [app, setApp] = useState([])

  useEffect(
    async () => {
      const appDB = setUpDB()

      const apiUrl = 'https://cors-anywhere.herokuapp.com/https://rss.itunes.apple.com/api/v1/hk/ios-apps/top-grossing/all/10/explicit.json'

      const addToDB = async (v) => {
        await (await appDB).put('app-recommendation', v, 'app-recommendation-data')
        await (await appDB).put('app-recommendation', Date.now(), 'timestamp')
        return v
      }

      const lastFetchTimestamp = R.defaultTo(0)(await (await appDB).get('app-recommendation', 'timestamp'))
      const previousAppData = await (await appDB).get('app-recommendation', 'app-recommendation-data')

      const callback = R.pipeWith(R.andThen, [
        () => fetchRequest(apiUrl),
        addToDB
      ])

      const response = await shouldSendRequest(lastFetchTimestamp)(callback)(previousAppData)

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
        <h3>
          <a href={url}>{name}</a>
        </h3>
        <div>
          <a href={artistUrl} itemProp="name">{artistName}</a>
        </div>
      </section>
    </li>
  )

  return (
    <section id="app-recommendation">
      <h2>推介</h2>
      <ul itemScope itemType="http://schema.org/ItemList">
        {
          R.pipe(
            accessResults,
            checkIfDataReady(renderResult)
          )(app)
        }
      </ul>
    </section>
  )
}

export default AppRecommendation
