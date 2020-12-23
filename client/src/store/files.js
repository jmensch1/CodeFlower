import * as api from 'services/api'

export const types = {
  GET_FILE_PENDING: 'files/GET_FILE_PENDING',
  GET_FILE_SUCCESS: 'files/GET_FILE_SUCCESS',
  GET_FILE_ERROR: 'files/GET_FILE_ERROR',
  CLOSE_FILE: 'files/CLOSE_FILE',
}

export const getFile = ({ path, data }) => {
  return async (dispatch, getState) => {
    const state = getState()
    const { repoId } = state.repo
    const { selectedFolder } = state.folders

    // combine path with selected folder
    path = [selectedFolder, path].join('/').replace(/^root\//, '')

    dispatch({
      type: types.GET_FILE_PENDING,
      data: { path, data },
    })

    try {
      const file = await api.getFile({ repoId, path })
      dispatch({
        type: types.GET_FILE_SUCCESS,
        data: { path, data, file },
      })
    } catch(e) {
      dispatch({
        type: types.GET_FILE_ERROR,
      })
    }

  }
}

export const closeFile = () => ({
  type: types.CLOSE_FILE,
})

const initialState = {
  isLoading: false,
  error: null,
  selectedFile: null,
  files: {}
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_FILE_PENDING:
      return {
        ...state,
        selectedFile: action.data,
        isLoading: true,
      }
    case types.GET_FILE_SUCCESS:
      return {
        ...state,
        files: {
          ...state.files,
          [action.data.path]: action.data.file,
        },
        isLoading: false,
      }
    case types.GET_FILE_ERROR:
      return {
        ...state,
        isLoading: false,
        error: {
          message: 'Error loading file.'
        },
      }
    case types.CLOSE_FILE:
      return {
        ...state,
        selectedFile: null,
        error: null,
      }
    default:
      return state
  }
}

export default reducer
