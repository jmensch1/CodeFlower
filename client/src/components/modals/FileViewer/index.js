import React, { useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useModal, useFiles } from 'store/selectors'
import { closeModal } from 'store/actions/modals'
import { getFile } from 'store/actions/files'
import { makeStyles } from '@material-ui/core/styles'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Modal from 'components/core/Modal'

const useStyles = makeStyles((theme) => ({
  root: {},
  progress: {
    position: 'absolute',
    zIndex: 1,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  header: {
    textAlign: 'center',
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  meta: {
    fontStyle: 'italic',
  },
  code: {
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    fontSize: 14,
    margin: 0,
  },
}))

const FileViewer = () => {
  const {
    isOpen,
    params: { filePath, metadata },
  } = useModal('fileViewer')
  const classes = useStyles()
  const dispatch = useDispatch()
  const { files, isLoading, error } = useFiles()

  const file = files[filePath]

  useEffect(() => {
    if (isOpen && !file) dispatch(getFile(filePath))
  }, [isOpen, file, filePath, dispatch])

  const close = useCallback(() => {
    dispatch(closeModal('fileViewer'))
  }, [dispatch])

  if (!isOpen) return null

  return (
    <Modal open={isOpen} onClose={close}>
      <DialogTitle className={classes.header}>
        <Typography className={classes.name} variant="h6" component="div">
          {metadata.name}
        </Typography>
        {metadata.languageUnknown ? (
          <Typography className={classes.meta} variant="body2" component="div">
            Language unknown
          </Typography>
        ) : (
          <Typography className={classes.meta} variant="body2" component="div">
            {metadata.size} lines of {metadata.language}
          </Typography>
        )}
        {/*<Typography className={classes.meta} variant="body2" component="div">
          {filePath.split('/').join(' • ')}
        </Typography>*/}
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={close}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {isLoading ? (
          <div className={classes.progress}>
            <CircularProgress color="inherit" />
          </div>
        ) : (
          <pre className={classes.code}>
            <code>{file || (error && error.message)}</code>
          </pre>
        )}
      </DialogContent>
    </Modal>
  )
}

export default FileViewer
