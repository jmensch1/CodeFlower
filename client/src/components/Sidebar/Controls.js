import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import SubTabs from './SubTabs'
import ForceControls from 'components/Visualization/ForceDirectedGraph/controls/ForceControls'
import StyleControls from 'components/Visualization/ForceDirectedGraph/controls/StyleControls'
import PositionControls from 'components/Visualization/ForceDirectedGraph/controls/PositionControls'
import ThemeControls from 'components/ThemeControls'
import ColorPicker from 'components/core/ColorPicker'
import Swatch from 'components/core/Swatch'

//////////////////// TAB CONFIG ///////////////////

const Test = () => {
  const [color, setColor] = useState({
    hue: 150,
    saturation: 50,
    lightness: 50,
    alpha: 0.8,
  })

  return (
    <>
      <Swatch color={color} />
      <ColorPicker
        color={color}
        onChange={setColor}
      />
    </>
  )
}

const TABS = [
  {
    type: 'test',
    Component: Test,
  },
  {
    type: 'forces',
    Component: ForceControls,
  },
  {
    type: 'styles',
    Component: StyleControls,
  },
  {
    type: 'position',
    Component: PositionControls,
  },
  {
    type: 'other',
    Component: ThemeControls,
  },
]

/////////////////////// COMPONENT ////////////////////

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  tabs: {
    padding: '0 10px',
  },
  content: {
    flex: 1,
    overflow: 'auto',
    padding: '1.25em',
  },
}))

const Controls = () => {
  const classes = useStyles()
  const [tab, setTab] = useState('test')
  const { Component } = TABS.find((t) => t.type === tab)

  return (
    <div className={classes.root}>
      <div className={classes.tabs}>
        <SubTabs tabs={TABS} activeTab={tab} onChange={setTab} />
      </div>
      <div className={classes.content}>
        <Component />
      </div>
    </div>
  )
}

export default Controls
