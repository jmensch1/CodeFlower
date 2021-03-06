import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    userSelect: 'none',
    fontSize: ({ level }) => `${1 - 0.1 * level}em`,
    marginBottom: '1em',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  arrowAndLabel: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
  },
  arrow: {
    width: '1.5em',
    height: '1.5em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    '& > svg': {
      width: '1em',
      height: '1em',
      '& > polygon': {
        fill: theme.palette.text.primary,
      },
    },
  },
  label: {
    flex: 1,
    fontWeight: 'bold',
  },
  headerRight: {},
  content: {
    marginTop: '0.75em',
    marginBottom: '2em',
    marginLeft: ({ indent }) => (indent ? '1.5em' : 0),
    position: 'relative',
    '& > *:not($mask)': {
      marginBottom: '0.75em',
    },
  },
  mask: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.palette.background.paper,
    opacity: 0.75,
    zIndex: 3,
    cursor: 'default',
  },
}))

const Collapse = ({
  label,
  headerRight,
  disabled,
  indent = true,
  level = 0,
  children,
  initialOpen = false,
}) => {
  const [open, setOpen] = useState(initialOpen)
  const classes = useStyles({ open, indent, level })

  const headerRightContent =
    typeof headerRight === 'function' ? headerRight({ open }) : headerRight

  return (
    <div className={classes.root}>
      <div className={classes.header} onClick={() => setOpen(!open)}>
        <div className={classes.arrowAndLabel}>
          <div className={classes.arrow}>
            <svg viewBox="0 0 20 20">
              <polygon
                points={open ? '5,5 10,15, 15,5' : '5,5 15,10 5,15'}
                className={classes.arrow}
              />
            </svg>
          </div>
          <div className={classes.label}>{label}</div>
        </div>
        <div className={classes.headerRight}>{headerRightContent}</div>
      </div>
      {open && (
        <div className={classes.content}>
          {disabled && <div className={classes.mask} />}
          {children}
        </div>
      )}
    </div>
  )
}

export default Collapse
