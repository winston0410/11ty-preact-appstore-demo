import { h, render, Component } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import './appListing.css'
import * as R from 'ramda'
import {
  fetchRequest
} from '../utilities/helper.js'
import { openDB, deleteDB, wrap, unwrap } from 'idb'

const AppRecommendation = (props) => {
  return (
    <p>This is app recommendation</p>
  )
}

export default AppRecommendation
