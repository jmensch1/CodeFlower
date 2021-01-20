import { useEffect } from 'react'
import {
  useSelectedLanguage,
  useLanguageIds,
  useLanguageColors,
  useHighlightedAuthorId,
  useFolderIds,
  useHighlightedFolderPath,
  useVisStyles,
} from 'store/selectors'
import { partition, multiClassSelector as select } from 'services/utils'

export default function useAddStyles({ nodeG, node, linkG, link }) {
  const selectedLanguage = useSelectedLanguage()
  const languageColors = useLanguageColors()
  const languageIds = useLanguageIds()
  const highlightedAuthorId = useHighlightedAuthorId()
  const folderIds = useFolderIds()
  const highlightedFolderPath = useHighlightedFolderPath()
  const visStyles = useVisStyles()

  //// FILES ////

  // fill
  useEffect(() => {
    node
      .filter('.file')
      .style('fill', (d) => languageColors[d.data.language])
  }, [node, languageColors])

  // opacity (TODO: combine with fill)
  useEffect(() => {
    node.filter('.file').style('fill-opacity', visStyles.files.fill.alpha)
  }, [node, visStyles.files.fill.alpha])

  // stroke
  useEffect(() => {
    node.filter('.file').style('stroke', visStyles.files.stroke)
  }, [node, visStyles.files.stroke])

  // stroke-width
  useEffect(() => {
    node.filter('.file').style('stroke-width', visStyles.files.strokeWidth)
  }, [node, visStyles.files.strokeWidth])

  // radius
  useEffect(() => {
    const { coeff, exponent } = visStyles.files.radius
    node.attr('r', (d) => {
      return d.children ? 3.5 : coeff * Math.pow(d.data.size, exponent) || 1
    })
  }, [node, visStyles.files.radius])

  //// FOLDERS ////

  // fill
  useEffect(() => {
    node.filter('.folder').style('fill', visStyles.folders.fill)
  }, [node, visStyles.folders.fill])

  // stroke
  useEffect(() => {
    node.filter('.folder').style('stroke', visStyles.folders.stroke)
  }, [node, visStyles.folders.stroke])

  // stroke-width
  useEffect(() => {
    node.filter('.folder').style('stroke-width', visStyles.folders.strokeWidth)
  }, [node, visStyles.folders.strokeWidth])

  //// LINKS ////

  // stroke
  useEffect(() => {
    link.style('stroke', visStyles.links.stroke)
  }, [link, visStyles.links.stroke])

  // stroke-width
  useEffect(() => {
    link.style('stroke-width', visStyles.links.strokeWidth)
  }, [link, visStyles.links.strokeWidth])

  //// SELECTION / HIGHLIGHTING ////

  // selected language
  useEffect(() => {
    if (selectedLanguage) {
      const clx = `lang-${languageIds[selectedLanguage]}`
      node.filter(`.file.${clx}`).style('display', 'block')
      node.filter(`.file:not(.${clx})`).style('display', 'none')
      node.filter('.folder').style('display', 'none')
      link.style('stroke-opacity', 0.2)
    } else {
      node.filter('.file').style('display', 'block')
      node.filter('.folder').style('display', 'block')
      link.style('stroke-opacity', 1.0)
    }
  }, [node, link, selectedLanguage, languageIds])

  // highlighted author
  useEffect(() => {
    if (highlightedAuthorId !== null) {
      const clx = `author-${highlightedAuthorId}`
      node.filter(`.file.${clx}`).style('display', 'block')
      node.filter(`.file:not(.${clx})`).style('display', 'none')
      node.filter('.folder').style('display', 'none')
      link.style('stroke-opacity', 0.2)
    } else {
      node.filter('.file').style('display', 'block')
      node.filter('.folder').style('display', 'block')
      link.style('stroke-opacity', 1.0)
    }
  }, [node, link, highlightedAuthorId])

  // highlighted folder
  useEffect(() => {
    if (highlightedFolderPath) {
      const folderPaths = Object.keys(folderIds)

      const [highlightedIds, suppressedIds] = partition(
        folderPaths,
        (path) => path.startsWith(highlightedFolderPath),
        (path) => folderIds[path]
      )

      if (highlightedIds.length) {
        node.filter(select('.file.folder-', highlightedIds)).style('display', 'block')
        node.filter(select('.folder.folder-', highlightedIds)).style('display', 'block')
        link.filter(select('.link.folder-', highlightedIds)).style('stroke-opacity', 1.0)
      }

      if (suppressedIds.length) {
        node.filter(select('.file.folder-', suppressedIds)).style('display', 'none')
        node.filter(select('.folder.folder-', suppressedIds)).style('display', 'none')
        link.filter(select('.link.folder-', suppressedIds)).style('stroke-opacity', 0.2)
      }
    } else {
      node.filter('.file').style('display', 'block')
      node.filter('.folder').style('display', 'block')
      link.style('stroke-opacity', 1.0)
    }
  }, [node, link, highlightedFolderPath, folderIds])

  //// ROTATION ////

  useEffect(() => {
    nodeG.style('transform', `rotate(${visStyles.rotation}deg)`)
    linkG.style('transform', `rotate(${visStyles.rotation}deg)`)
  }, [nodeG, linkG, visStyles.rotation])
}
