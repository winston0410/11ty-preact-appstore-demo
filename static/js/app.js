import { h, render, Component, Fragment } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import AppListing from './components/appListing.js'
import AppRecommendation from './components/appRecommendation.js'
import './app.css'

const container = document.getElementById('primary')

const App = (props) => {
  return (
    <>
      <AppRecommendation />
      <AppListing />
    </>
  )
}

render(<App />, container)
