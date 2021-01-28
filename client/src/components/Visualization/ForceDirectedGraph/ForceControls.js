import React, { useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { SmartSlider } from 'components/core/Slider'
import { useVisForces } from 'store/selectors'
import { setVisForces } from 'store/actions/settings'
import { useDispatch } from 'react-redux'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 10,
    '& > *': {
      marginBottom: 12,
    }
  },
  instructions: {
    fontSize: '0.875em',
    fontStyle: 'italic',
    marginBottom: 16,
  },
}))

const ForceControls = () => {
  const classes = useStyles()
  const visForces = useVisForces()
  const dispatch = useDispatch()

  const onChangeForces = useCallback((visForces) => {
    dispatch(setVisForces(visForces))
  }, [dispatch])

  if (!visForces) return null
  return (
    <div className={classes.root}>
      <div className={classes.instructions}>
        Adjust the&nbsp;
        <a
          href="https://github.com/d3/d3-force"
          target="_blank"
          rel="noreferrer">
          d3 forces
        </a>
        &nbsp;that apply to the graph.
      </div>
      <SmartSlider
        label='alpha decay'
        range={[0, 0.1, 0.001]}
        obj={visForces}
        path='alphaDecay'
        onChange={onChangeForces}
      />
      <SmartSlider
        label='charge strength'
        range={[-500, 0, 1]}
        obj={visForces}
        path='charge.strength'
        onChange={onChangeForces}
      />
      <SmartSlider
        label='charge distance min/max'
        range={[1, 2000]}
        obj={visForces}
        path='charge.distance'
        onChange={onChangeForces}
      />
      <SmartSlider
        label='link distance: files'
        range={[0, 150, 1]}
        obj={visForces}
        path='link.distance.files'
        onChange={onChangeForces}
      />
      <SmartSlider
        label='link distance: folders'
        range={[0, 150, 1]}
        obj={visForces}
        path='link.distance.folders'
        onChange={onChangeForces}
      />
      <SmartSlider
        label='link strength'
        range={[0, 1, 0.01]}
        obj={visForces}
        path='link.strength'
        onChange={onChangeForces}
      />
      <SmartSlider
        label='link iterations'
        range={[0, 10, 1]}
        obj={visForces}
        path='link.iterations'
        onChange={onChangeForces}
      />
      <SmartSlider
        label='force x/y strength'
        range={[0, 1, 0.01]}
        obj={visForces}
        path='forceXY.strength'
        onChange={onChangeForces}
      />
      <SmartSlider
        label='force center strength'
        range={[0, 1, 0.01]}
        obj={visForces}
        path='center.strength'
        onChange={onChangeForces}
      />
    </div>
  )
}

export default ForceControls
