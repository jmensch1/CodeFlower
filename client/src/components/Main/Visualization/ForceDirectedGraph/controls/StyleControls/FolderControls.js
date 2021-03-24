import React, { useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch } from 'react-redux'
import { useVisStyles } from 'store/selectors'
import { updateVisStyles } from 'store/actions/vis'
import Slider from 'components/core/Slider'
import ColorPicker from 'components/core/ColorPicker'
import Swatch from 'components/core/Swatch'
import Collapse from 'components/core/Collapse'
import { getPaths, createUpdaters } from 'services/utils'

const useStyles = makeStyles((theme) => ({
  root: {},
}))

const PATHS = [
  'folders.fill',
  'folders.radius',
  'folders.stroke',
  'folders.strokeWidth',
]

const RANGES = {
  'folders.radius': [0, 20, 0.5],
  'folders.strokeWidth': [0, 10, 0.5],
}

const FolderControls = () => {
  const classes = useStyles()
  const visStyles = useVisStyles()
  const dispatch = useDispatch()

  const values = useMemo(() => {
    return getPaths(visStyles, PATHS)
  }, [visStyles])

  const updaters = useMemo(() => {
    return createUpdaters(PATHS, updateVisStyles, dispatch)
  }, [dispatch])

  if (!visStyles) return null
  return (
    <div className={classes.root}>
      <Collapse
        label="fill"
        level={1}
        headerRight={<Swatch color={values['folders.fill']} />}
      >
        <ColorPicker
          color={values['folders.fill']}
          onChange={updaters['folders.fill']}
        />
      </Collapse>
      <Collapse
        label="radius"
        level={1}
        headerRight={values['folders.radius'].toFixed(1)}
      >
        <Slider
          range={RANGES['folders.radius']}
          value={values['folders.radius']}
          onChange={updaters['folders.radius']}
        />
      </Collapse>

      <Collapse
        label="stroke"
        level={1}
        headerRight={<Swatch color={values['folders.stroke']} />}
      >
        <ColorPicker
          color={values['folders.stroke']}
          onChange={updaters['folders.stroke']}
        />
      </Collapse>

      <Collapse
        label="stroke width"
        level={1}
        headerRight={values['folders.strokeWidth'].toFixed(1)}
      >
        <Slider
          range={RANGES['folders.strokeWidth']}
          value={values['folders.strokeWidth']}
          onChange={updaters['folders.strokeWidth']}
        />
      </Collapse>
    </div>
  )
}

export default FolderControls
