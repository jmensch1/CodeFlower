import { useSelector } from 'react-redux'
import { createSelector } from 'reselect'
import repoUtils from 'services/repo'
import mainThemes from 'themes/mainThemes'
import visThemes from 'themes/visThemes'

////////// SIMPLE SELECTORS ///////////

const location = (state) => state.router.location
const query = (state) => state.query
const repo = (state) => state.repo
const authors = (state) => state.repo?.authors
const rootFolder = (state) => state.repo?.cloc.tree
const files = (state) => state.files
const settings = (state) => state.settings
const mainThemeId = (state) => state.settings.mainThemeId
const visThemeId = (state) => state.settings.visThemeId
const visType = (state) => state.settings.visType
const selectedFolderPath = (state) => state.settings.selectedFolderPath
const highlightedFolderPath = (state) => state.settings.highlightedFolderPath
const selectedLanguage = (state) => state.settings.selectedLanguage
const selectedAuthorId = (state) => state.settings.selectedAuthorId
const highlightedAuthorId = (state) => state.settings.highlightedAuthorId
const context = (state) => {
  const { context } = state.router.location.query
  return {
    isExtension: context === 'chrome',
    isWeb: context !== 'chrome',
  }
}

////////// CREATE SELECTOR ///////////

const folderPaths = createSelector([rootFolder], (rootFolder) => {
  return repoUtils.getFolderPaths(rootFolder)
})

const folderIds = createSelector([folderPaths], (folderPaths) =>
  folderPaths.reduce((ids, path, index) => {
    ids[path.pathName] = index
    return ids
  }, {})
)

const selectedFolder = createSelector(
  [rootFolder, selectedFolderPath],
  (rootFolder, selectedFolderPath) => {
    if (!rootFolder || !selectedFolderPath) return null
    return repoUtils.getFolder(rootFolder, selectedFolderPath)
  }
)

const languageCounts = createSelector([selectedFolder], (selectedFolder) =>
  repoUtils.getLanguageCounts(selectedFolder)
)

const languageIds = createSelector([languageCounts], (languageCounts) =>
  languageCounts.reduce((ids, count, index) => {
    ids[count.language] = index
    return ids
  }, {})
)

const languageColors = createSelector(
  [languageCounts, visThemeId],
  (counts, visThemeId) => {
    const { languageColor } = visThemes[visThemeId]
    const languages = counts.map((count) => count.language)
    return languages.reduce((colors, language, index) => {
      colors[language] = languageColor(languages, index)
      return colors
    }, {})
  }
)

const selectedAuthor = createSelector(
  [authors, selectedAuthorId],
  (authors, selectedAuthorId) => {
    if (!authors) return null
    return authors.find((author) => author.id === selectedAuthorId)
  }
)

const mainTheme = createSelector([mainThemeId], (id) => mainThemes[id])
const visTheme = createSelector([visThemeId], (id) => visThemes[id])

////////// USE SELECTOR ///////////

export const useLocation = () => useSelector(location)
export const useQuery = () => useSelector(query)
export const useRepo = () => useSelector(repo)
export const useAuthors = () => useSelector(authors)
export const useFiles = () => useSelector(files)
export const useSettings = () => useSelector(settings)
export const useSelectedFolderPath = () => useSelector(selectedFolderPath)
export const useSelectedLanguage = () => useSelector(selectedLanguage)
export const useHighlightedFolderPath = () => useSelector(highlightedFolderPath)
export const useHighlightedAuthorId = () => useSelector(highlightedAuthorId)
export const useSelectedAuthorId = () => useSelector(selectedAuthorId)
export const useSelectedAuthor = () => useSelector(selectedAuthor)
export const useFolderPaths = () => useSelector(folderPaths)
export const useFolderIds = () => useSelector(folderIds)
export const useSelectedFolder = () => useSelector(selectedFolder)
export const useLanguageCounts = () => useSelector(languageCounts)
export const useLanguageIds = () => useSelector(languageIds)
export const useLanguageColors = () => useSelector(languageColors)
export const useContext = () => useSelector(context)
export const useMainTheme = () => useSelector(mainTheme)
export const useVisTheme = () => useSelector(visTheme)
export const useVisType = () => useSelector(visType)

////////// PARAMATERIZED USE SELECTOR ///////////

export const useModal = (modalType) =>
  useSelector((state) => {
    return state.modals[modalType] || { isOpen: false, params: {} }
  })
