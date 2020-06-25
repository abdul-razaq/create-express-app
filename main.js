const { directoriesToCreate, topLevelFilesToCreate } = require('./configs')
const {
  generateProjectFolders,
  createTopLevelFiles,
  createCommonFiles,
  initProjectAndInstallDependencies,
} = require('./helpers')

module.exports = (projectAuthor) => {
  generateProjectFolders(directoriesToCreate)
  createTopLevelFiles(topLevelFilesToCreate)
  createCommonFiles()
  initProjectAndInstallDependencies(projectAuthor)
}
