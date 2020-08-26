import { h, render, Component } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import AppListing from './components/appListing.js'

const container = document.getElementById('primary')

const App = (props) => {
  return (
    <p>Hello world</p>,
    <AppListing />
  )
}

render(<App />, container)
