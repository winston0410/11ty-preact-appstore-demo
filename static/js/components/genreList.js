import { h, render, Component } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import * as R from 'ramda'
import {
  fetchRequest,
  hasPassedADay,
  accessResults,
  checkIfDataReady,
  renderGenreList
} from '../utilities/helper.js'

const GenreList = ({ data }) => {
  return (
    <ul className="genre-list">
      {
        R.map(
          (genre) => <li>{genre}</li>
        )(data)
      }
    </ul>
  )
}

export default GenreList
