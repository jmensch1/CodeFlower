import { useSelector } from 'react-redux'

export const useRepo = () => useSelector(state => state.repo)
export const useFolders = () => useSelector(state => state.folders)
export const useTree = () => useSelector(state => state.tree)
export const useLanguages = () => useSelector(state => state.languages.languages)
export const useSelectedLanguage = () => useSelector(state => state.languages.selectedLanguage)
export const useThemeId = () => useSelector(state => state.themeId)
export const useFiles = () => useSelector(state => state.files)
export const useTerminal = () => useSelector(state => state.terminal)
