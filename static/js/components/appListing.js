import { h, render, Component } from 'preact'
import { useState, useEffect } from 'preact/hooks'

const AppListing = (props) => {
  useEffect(
    async () => {
      const apiUrl = 'https://rss.itunes.apple.com/api/v1/hk/ios-apps/top-free/all/10/explicit.json'
      return await fetch(apiUrl)
        .then(response => response.json())
    }
  )

  return (
    <ul>
      <li>
      </li>
    </ul>
  )
}

export default AppListing
