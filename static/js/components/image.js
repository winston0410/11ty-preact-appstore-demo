import { h, render, Component } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import * as R from 'ramda'

const Image = ({ url, alt }) => {
  return (
    <a>
      <img src={url} alt={alt} loading="lazy" />
    </a>
  )
}

export default Image
