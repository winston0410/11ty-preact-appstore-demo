import { h, render, Component } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import * as R from 'ramda'
import './appListing.css'
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

const AppListing = (props) => {
  const [app, setApp] = useState([])

  const [listingNum, setListingNum] = useState(10)

  useEffect(
    async () => {
      const appDB = setUpDB()

      const apiUrl = `https://cors-anywhere.herokuapp.com/https://rss.itunes.apple.com/api/v1/hk/ios-apps/top-free/all/${listingNum}/explicit.json`

      const addToDB = async (v) => {
        await (await appDB).put('applist', v, 'applist-data')
        await (await appDB).put('applist', Date.now(), 'timestamp')
        await (await appDB).put('applist', listingNum, 'page-number')
        return v
      }

      const lastFetchTimestamp = R.defaultTo(0)(await (await appDB).get('applist', 'timestamp'))
      const previousAppData = await (await appDB).get('applist', 'applist-data')

      const getAppIdString = R.pipe(
        accessResults,
        R.pluck('id'),
        R.join(',')
      )

      const requestCallback = R.pipe(
        R.pipeWith(R.andThen, [
          async () => await fetchRequest(apiUrl),
          R.tap(console.log),
          getAppIdString,
          async (id) => await fetchRequest(`https://cors-anywhere.herokuapp.com/https://itunes.apple.com/hk/lookup?id=${id}`),
          R.tap(console.log),
          R.prop('results'),
          addToDB
        ])
      )

      const response = await shouldSendRequest(lastFetchTimestamp)(requestCallback)(previousAppData)

      await setApp(response)
    },
    [listingNum]
  )

  // const checkScrollPosition = () => {
  //   const addTen = R.add(10)
  //
  //   const newListingNum = addTen(listingNum)
  //
  //   setListingNum(newListingNum)
  // }

  const renderResult = ({ trackCensoredName, trackViewUrl, genres, artistName, artistViewUrl, artworkUrl512, averageUserRating }) => (
    <li itemProp="itemListElement" itemScope itemType="http://schema.org/MobileApplication">
      <a href={trackViewUrl}>
        <img itemProp="image" src={artworkUrl512} alt={trackCensoredName} loading="lazy" />
      </a>
      <section className="app-info">
        <h2>
          <a href={trackViewUrl}>{trackCensoredName}</a>
        </h2>
        <GenreList data={genres}/>
        <div>
          <a href={artistViewUrl} itemProp="name">{artistName}</a>
        </div>
      </section>
    </li>
  )

  return (
    <ul id="app-listing" itemScope itemType="http://schema.org/ItemList">
      {
        checkIfDataReady(renderResult)(app)
      }
    </ul>
  )
}

export default AppListing
