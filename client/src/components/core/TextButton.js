import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: 'transparent',
    border: `1px ${theme.palette.divider} solid`,
    textTransform: 'lowercase',
    padding: '0.25em 1em',
    fontWeight: 'normal',
  },
}))

const TextButton = ({ label, className, ...rest }) => {
  const classes = useStyles()
  return (
    <Button
      variant="text"
      className={clsx(classes.root, className)}
      disableRipple
      {...rest}
    >
      {label}
    </Button>
  )
}

export default TextButton
