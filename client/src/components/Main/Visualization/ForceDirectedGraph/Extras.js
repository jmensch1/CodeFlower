import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useCamera } from 'store/selectors'
import IconButton from '@material-ui/core/IconButton'
import RefreshIcon from '@material-ui/icons/Refresh'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    display: 'flex',
    alignItems: 'center',
  },
  alphaBar: {
    height: '0.8em',
    width: 200,
    marginLeft: 10,
  },
  alphaInner: {
    height: '100%',
    width: ({ alpha }) => `${alpha * 100}%`,
    backgroundColor: theme.palette.action.selected,
  },
  icon: {
    color: theme.palette.text.primary,
    opacity: 0.38,
    display: 'block',
  },
}))

const Extras = ({ alpha, onRestart }) => {
  const classes = useStyles({ alpha })
  const { showAperture } = useCamera()

  if (showAperture) return null
  return (
    <div className={classes.root}>
      <IconButton
        aria-label="restart"
        size="small"
        className={classes.button}
        onClick={onRestart}
      >
        <RefreshIcon className={classes.icon} />
      </IconButton>
      <div className={classes.alphaBar}>
        <div className={classes.alphaInner} />
      </div>
    </div>
  )
}

export default Extras
