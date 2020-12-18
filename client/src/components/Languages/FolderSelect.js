import React from 'react'
import { useDispatch } from 'react-redux'
import { useFolders } from 'store/selectors'
import { selectFolder } from 'store/folders'
import Select from 'components/core/Select'

const FolderSelect = () => {
  const folders = useFolders()
  const dispatch = useDispatch()

  if (!folders || !folders.selectedFolder) return null

  return (
    <div style={{ margin: 10 }}>
      <Select
        value={folders.selectedFolder}
        onChange={e => dispatch(selectFolder(e.target.value))}
        options={folders.folderPaths.map(({ pathName }) => pathName)}
      />
    </div>
  )
}

export default FolderSelect
