import { h, render, Component } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import * as R from 'ramda'
import './appListing.css'
import {
  fetchRequest,
  hasPassedADay,
  accessResults,
  checkIfDataReady,
  setUpDB
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
        await appDB.add('applist', v, 'applist-data')
        await appDB.add('applist', Date.now(), 'timestamp')
        await appDB.add('applist', listingNum, 'page-number')
        return v
      }

      const lastFetchTimestamp = R.defaultTo(0)(await appDB.get('applist', 'timestamp'))

      const shouldGetNewData = (timestamp) => (appData) => R.anyPass(
        [
          R.isNil,
          hasPassedADay(lastFetchTimestamp)
          // Also test if page number is greater than the current number
        ]
      )(appData)

      const response = await R.when(
        shouldGetNewData(lastFetchTimestamp),
        R.pipe(
          R.pipeWith(R.andThen, [
            () => fetchRequest(apiUrl),
            addToDB
          ])
        )
      )(await appDB.get('applist', 'applist-data'))

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
