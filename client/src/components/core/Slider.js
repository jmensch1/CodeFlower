import React, { useCallback, useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import MuiSlider from '@material-ui/core/Slider'
import { getPath, setPath, hasPath } from 'services/utils'
import clsx from 'clsx'
import { hueGradient, lightnessGradient, opacityGradient } from 'services/utils'

const THUMB_SIZE = 8

const useSliderStyles = makeStyles(theme => ({
  root: {
    color: theme.palette.text.primary,
  },
  rail: {
    height: 1,
    left: -THUMB_SIZE / 2,
    width: `calc(100% + ${THUMB_SIZE}px)`,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    marginTop: -THUMB_SIZE / 2,
    marginLeft: -THUMB_SIZE / 2,
  },
  hue: {
    background: hueGradient(),
    opacity: 1,
  },
  lightness: {
    background: lightnessGradient(),
    opacity: 1,
  },
  opacity: {
    background: opacityGradient(),
    opacity: 1,
  }
}))

const useStyles = makeStyles(theme => ({
  root: {},
  labelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.875em',
    '& > label': {
      // fontStyle: 'italic',
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    }
  },
  slider: {
    padding: `0 ${THUMB_SIZE / 2}px`,
  },
}))

export const SmartSlider = ({
  range,
  obj,
  defaultObj,
  path,
  onChange,
  label,
  transform = { in: (x) => x, out: (x) => x },
  gradient,
  isOpen = true,
  ...rest
}) => {
  const classes = useStyles()
  const sliderClasses = useSliderStyles({ gradient })
  const [open, setOpen] = useState(isOpen)

  const handleChange = useCallback((e, newVal) => {
    onChange(setPath(obj, path, transform.out(newVal)))
  }, [obj, path, onChange, transform])

  const [min, max, step] = range || []

  const value = hasPath(obj, path)
    ? transform.in(getPath(obj, path))
    : transform.in(getPath(defaultObj, path))

  useEffect(() => {
    setOpen(!!isOpen)
  }, [isOpen])

  return (
    <div className={classes.root}>
      {label && (
        <div className={classes.labelRow} onClick={() => setOpen(!open)}>
          <label>{ label }</label>
          <span>
            { value instanceof Array ? `${value[0]}/${value[1]}` : value }
          </span>
        </div>
      )}
      {open && (
        <div className={classes.slider}>
          <MuiSlider
            classes={{
              root: sliderClasses.root,
              rail: clsx(sliderClasses.rail, sliderClasses[gradient]),
              thumb: sliderClasses.thumb,
            }}
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleChange}
            track={false}
            { ...rest }
          />
        </div>
      )}
    </div>
  )
}

export default SmartSlider
