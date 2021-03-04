import axios from 'axios'

const CLOUD_NAME = 'dt2rs6yf1'
const UPLOAD_PRESET = 'tahdwqyy'
const TAG = 'codeflower-local'

const FETCH_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image`
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`

export function listImages() {
  const version = Math.ceil(new Date().getTime() / 1000)
  const url = `${FETCH_URL}/list/v${version}/${TAG}.json`

  return axios.get(url)
    .then(({ data: { resources: images }}) => images)
    .catch((err) => [])
}

export function imageUrl(image) {
  const { version, public_id, format } = image
  return `${FETCH_URL}/upload/v${version}/${public_id}.${format}`
}

export function thumbUrl(image, { width = 300, format = 'jpg'} = {}) {
  // https://cloudinary.com/documentation/transformation_reference
  const transforms = `w_${width}`

  const { version, public_id } = image
  return `${FETCH_URL}/upload/${transforms}/v${version}/${public_id}.${format}`
}

export function uploadImage(dataUri, repo) {
  const headers = { 'Content-Type': 'application/json' }

  const data = {
    file: dataUri,
    public_id: `${repo.name}-${Date.now()}`,
    upload_preset: UPLOAD_PRESET,
    tags: TAG,
    context: `repo=${encodeURIComponent(`${repo.name}/${repo.owner}`)}`,
  }

  return axios.post(UPLOAD_URL, JSON.stringify(data), { headers })
}
