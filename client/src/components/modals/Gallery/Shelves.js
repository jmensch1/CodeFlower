import React, { useRef, useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import useSize from 'hooks/useSize'
import Shelf from './Shelf'
import {
  THUMB_WIDTH,
  THUMB_SPACING,
  LEFT_MARGIN,
} from './config'

const useStyles = makeStyles((theme) => ({
  root: {},
}))

const Shelves = ({ images, selectedImage, onSelect }) => {
  const classes = useStyles()
  const container = useRef(null)
  const dimensions = useSize(container)

  const shelves = useMemo(() => {
    if (!dimensions || !images) return []

    const { width } = dimensions
    const shelfWidth = width - 1.5 * LEFT_MARGIN - THUMB_WIDTH + THUMB_SPACING
    const numPerShelf = Math.max(1, Math.floor(shelfWidth / THUMB_SPACING))
    const numShelves = Math.ceil(images.length / numPerShelf)

    return Array.from({ length: numShelves }).map((_, idx) => {
      return images.slice(idx * numPerShelf, (idx + 1) * numPerShelf)
    })
  }, [dimensions, images])

  return (
    <div className={classes.root} ref={container}>
      {shelves.map((shelf, idx) => (
        <Shelf
          key={idx.toString()}
          images={shelf}
          onSelect={onSelect}
          selectedImage={selectedImage}
        />
      ))}
    </div>
  )
}

export default Shelves
