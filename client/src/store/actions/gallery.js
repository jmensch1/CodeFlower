import {
  listImages,
  uploadImage,
  uploadImageData,
  getImageData,
  getSvgString,
} from 'services/gallery'
import { colorString } from 'services/utils'
import { select } from 'store/selectors'

export const types = {
  GET_IMAGES_SUCCESS: 'gallery/GET_IMAGES_SUCCESS',
  SELECT_IMAGE: 'gallery/SELECT_IMAGE',
  PREVIEW_IMAGE: 'gallery/PREVIEW_IMAGE',
  PUBLISH_IMAGE_PENDING: 'gallery/PUBLISH_IMAGE_PENDING',
  PUBLISH_IMAGE_SUCCESS: 'gallery/PUBLISH_IMAGE_SUCCESS',
  PUBLISH_IMAGE_FAILURE: 'gallery/PUBLISH_IMAGE_FAILURE',
  PUBLISH_RESET: 'gallery/PUBLISH_RESET',
  RESTORE_IMAGE: 'gallery/RESTORE_IMAGE',
}

export const getImages = () => {
  return async (dispatch) => {
    const images = await listImages()
    return dispatch({
      type: types.GET_IMAGES_SUCCESS,
      data: images,
    })
  }
}

export const selectImage = (selectedImage) => ({
  type: types.SELECT_IMAGE,
  data: selectedImage,
})

export const getPreview = () => {
  return async (dispatch, getState) => {
    const state = getState()
    const { getSvgUri, flash } = select.camera(state)

    await flash()
    const dataUri = await getSvgUri()
    return dispatch({
      type: types.PREVIEW_IMAGE,
      data: dataUri,
    })
  }
}

export const publishImage = () => {
  return async (dispatch, getState) => {
    dispatch({ type: types.PUBLISH_IMAGE_PENDING })

    const state = getState()
    const repo = select.repo(state)
    const selectedFolderPath = select.selectedFolderPath(state)
    const { previewImage } = select.gallery(state)
    const visStyles = select.visStyles(state)
    const visForces = select.visForces(state)
    const visPosition = select.visPosition(state)

    const { repoId, owner, name } = repo
    const { fill } = visStyles.background
    const backgroundColor = colorString(fill)
    const imageId = `${name}-${Date.now()}`

    try {
      const [image] = await Promise.all([
        uploadImage(previewImage, imageId, {
          repoId,
          owner,
          name,
          backgroundColor,
        }),
        uploadImageData(
          {
            repo,
            selectedFolderPath,
            vis: {
              styles: visStyles,
              forces: visForces,
              position: visPosition,
            },
          },
          imageId
        ),
      ])

      dispatch({
        type: types.PUBLISH_IMAGE_SUCCESS,
        data: image,
      })
      dispatch(getImages())
    } catch (error) {
      dispatch({
        type: types.PUBLISH_IMAGE_FAILURE,
        data: error.message,
      })
    }
  }
}

export const restoreImage = (image) => {
  return async (dispatch, getState) => {
    const [data, svgString] = await Promise.all([
      getImageData(image),
      getSvgString(image),
    ])
    data.svgString = svgString

    dispatch({
      type: types.RESTORE_IMAGE,
      data,
    })
  }
}

export const publishReset = () => ({
  type: types.PUBLISH_RESET,
})

const initialState = {
  images: null,
  selectedImage: null,
  previewImage: null,
  isPublishing: false,
  publishedImage: null,
  publishError: null,
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_IMAGES_SUCCESS:
      return {
        ...state,
        images: action.data,
        selectedImage: action.data[0],
      }
    case types.SELECT_IMAGE:
      return {
        ...state,
        selectedImage: action.data,
      }
    case types.PREVIEW_IMAGE: {
      return {
        ...state,
        previewImage: action.data,
      }
    }
    case types.PUBLISH_IMAGE_PENDING:
      return {
        ...state,
        isPublishing: true,
        publishedImage: null,
        publishError: null,
      }
    case types.PUBLISH_IMAGE_SUCCESS:
      return {
        ...state,
        isPublishing: false,
        publishedImage: action.data,
      }
    case types.PUBLISH_IMAGE_FAILURE:
      return {
        ...state,
        isPublishing: false,
        publishError: action.data,
      }
    case types.PUBLISH_RESET:
      return {
        ...state,
        isPublishing: false,
        previewImage: null,
        publishedImage: null,
        publishError: null,
      }
    default:
      return state
  }
}

export default reducer
