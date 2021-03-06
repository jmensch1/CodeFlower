import React, { useEffect, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useGallery } from 'store/selectors'
import axios from 'axios'

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    position: 'relative',
    backgroundColor: theme.palette.background.default,
    '& svg': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },
  },
}))

async function urlToSvg(url) {
  const { data: xml } = await axios.get(url)
  const dom = new DOMParser()
  const svg = dom.parseFromString(xml, 'image/svg+xml')
  return svg.rootElement
}

const Main = () => {
  const classes = useStyles()
  const container = useRef(null)
  const { selectedImage: image } = useGallery()

  // NOTE: this seems to do the same as the one below, but requires less code
  // See if there are any actual differences
  // useEffect(() => {
  //   if (!image) return
  //
  //   axios.get(image.imageUrl).then(({ data: svgStr }) => {
  //     container.current.innerHTML = svgStr
  //   })
  // }, [image])

  useEffect(() => {
    if (!image) return

    urlToSvg(image.imageUrl).then((svg) => {
      const prevSvg = container.current.querySelector('svg')
      container.current.appendChild(svg)
      if (prevSvg) container.current.removeChild(prevSvg)
    })
  }, [image])

  return <div className={classes.root} ref={container} />
}

export default Main
