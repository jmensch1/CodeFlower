import React, { useEffect, useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import { cameraOn, cameraOff, flash, setTransparency, } from 'store/actions/camera'
import { useCamera } from 'store/selectors'
import SubTabs from '../SubTabs'
import Download from './Download'
import Publish from './Publish'

const TABS = [
  {
    type: 'download',
    Component: Download,
  },
  {
    type: 'publish',
    Component: Publish,
  },
]

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  tabs: {
    padding: '10px 10px 0 10px',
  },
  content: {
    flex: 1,
    overflow: 'auto',
    overscrollBehavior: 'contain',
    padding: 20,
  },
}))

const Camera = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [tab, setTab] = useState('publish')
  const { Component } = TABS.find((t) => t.type === tab)
  const { transparent } = useCamera()

  useEffect(() => {
    dispatch(cameraOn())
    return () => {
      dispatch(cameraOff())
      dispatch(setTransparency(false))
    }
  }, [dispatch])

  const doFlash = useCallback(
    () => dispatch(flash()),
    [dispatch]
  )

  const setTransparent = useCallback((transparent) => {
    dispatch(setTransparency(transparent))
  }, [dispatch])

  return (
    <div className={classes.root}>
      <div className={classes.tabs}>
        <SubTabs tabs={TABS} activeTab={tab} onChange={setTab} />
      </div>
      <div className={classes.content}>
        <Component
          flash={doFlash}
          transparent={transparent}
          setTransparent={setTransparent}
        />
      </div>
    </div>
  )
}

export default Camera
