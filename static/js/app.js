import { h, render, Component } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import AppListing from './components/appListing.js'
import AppRecommendation from './components/appRecommendation.js'

const container = document.getElementById('primary')

const App = (props) => {
  return (
    <AppRecommendation />,
    <AppListing />
  )
}

render(<App />, container)
