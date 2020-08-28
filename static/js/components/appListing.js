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
  shouldSendRequest,
  debounce,
  hasScrolledHalfPage,
  half,
  getAppIdString,
  addTen
} from '../utilities/helper.js'
import { openDB, deleteDB, wrap, unwrap } from 'idb'
import GenreList from './genreList.js'

const AppListing = (props) => {
  const [app, setApp] = useState([])
  const [paginationNum, setPaginationNum] = useState(0)

  useEffect(
    async () => {
      const appDB = setUpDB()

      const apiUrl = 'https://cors-anywhere.herokuapp.com/https://rss.itunes.apple.com/api/v1/hk/ios-apps/top-free/all/100/explicit.json'

      const addToDB = async (v) => {
        await (await appDB).put('applist', v, 'applist-data')
        await (await appDB).put('applist', Date.now(), 'timestamp')
        return v
      }

      const lastFetchTimestamp = R.defaultTo(0)(await (await appDB).get('applist', 'timestamp'))
      const previousAppData = await (await appDB).get('applist', 'applist-data')

      const requestCallback = R.pipe(
        R.pipeWith(R.andThen, [
          async () => await fetchRequest(apiUrl),
          getAppIdString,
          async (id) => await fetchRequest(`https://cors-anywhere.herokuapp.com/https://itunes.apple.com/hk/lookup?id=${id}`),
          R.prop('results'),
          addToDB
        ])
      )

      const response = await shouldSendRequest(lastFetchTimestamp)(requestCallback)(previousAppData)

      const paginatedResponse = R.pipe(
        R.slice(paginationNum, addTen(paginationNum))
      )(response)

      await setApp(paginatedResponse)
    },
    [paginationNum]
  )

  const updatePaginationNumberOnScroll = debounce(
    (event) => {
      if (window.scrollY > half(document.body.scrollHeight)) {
        const newPaginationNum = R.add(10)(paginationNum)
        setPaginationNum(newPaginationNum)
        console.log('Scrolled 50%')
      }
    },
    500)

  useEffect(
    () => {
      window.addEventListener('scroll', updatePaginationNumberOnScroll)
    },
    []
  )

  const renderResult = ({ trackCensoredName, trackViewUrl, genres, artistName, artistViewUrl, artworkUrl512, averageUserRating }) => (
    <li itemProp="itemListElement" itemScope itemType="http://schema.org/MobileApplication">
      <a href={trackViewUrl}>
        <img itemProp="image" src={artworkUrl512} alt={trackCensoredName} loading="lazy" />
      </a>
      <section className="app-info">
        <h3>
          <a href={trackViewUrl}>{trackCensoredName}</a>
        </h3>
        <GenreList data={genres}/>
        <div>
          <a href={artistViewUrl} itemProp="name">{artistName}</a>
        </div>
      </section>
    </li>
  )

  return (
    <section id="app-listing">
      <h2>下載排行榜</h2>
      <ul itemScope itemType="http://schema.org/ItemList">
        {
          checkIfDataReady(renderResult)(app)
        }
      </ul>
    </section>
  )
}

export default AppListing
