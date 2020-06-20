import { directoriesToCreate, topLevelFilesToCreate } from './configs'
import {
  generateProjectFolders,
  createTopLevelFiles,
  createCommonFiles,
  initProjectAndInstallDependencies,
} from './helpers'

export default (projectAuthor) => {
  generateProjectFolders(directoriesToCreate)
  createTopLevelFiles(topLevelFilesToCreate)
  createCommonFiles()
  initProjectAndInstallDependencies(projectAuthor)
}
