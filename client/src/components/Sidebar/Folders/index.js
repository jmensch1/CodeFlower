import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import {
  useRootFolder,
  useSelectedFolderPath,
  useHighlightedFolderPath,
  useFiles,
} from 'store/selectors'
import { selectFolder, highlightFolder } from 'store/actions/settings'
import { openFile } from 'store/actions/files'
import { isWithinFolder } from 'services/repo'
import Folder from './Folder'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 10,
  },
}))

const Folders = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const selectedFolderPath = useSelectedFolderPath()
  const highlightedFolderPath = useHighlightedFolderPath()
  const rootFolder = useRootFolder()
  const { openedFile } = useFiles()

  const select = useCallback(
    (folderPath) => {
      dispatch(selectFolder(folderPath))
    },
    [dispatch]
  )

  const highlight = useCallback(
    (folderPath) => {
      if (folderPath && isWithinFolder(folderPath, selectedFolderPath))
        dispatch(highlightFolder(folderPath))
      else dispatch(highlightFolder(null))
    },
    [dispatch, selectedFolderPath]
  )

  const clearHighlight = useCallback(() => {
    dispatch(highlightFolder(null))
  }, [dispatch])

  const open = useCallback((file) => dispatch(openFile(file)), [dispatch])

  return (
    <div className={classes.root} onMouseLeave={clearHighlight}>
      <Folder
        folder={rootFolder}
        level={0}
        highlight={highlight}
        highlightedFolderPath={highlightedFolderPath}
        select={select}
        selectedFolderPath={selectedFolderPath}
        openedFilePath={openedFile?.path}
        openFile={open}
      />
    </div>
  )
}

export default Folders
