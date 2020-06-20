import fs from 'fs'
import path from 'path'
import childProcess from 'child_process'

import generateBoilerplateCodes from './boilerplates'
import packageJSON from './boilerplates/packageJson.json'
import { dependenciesToInstall, devDependenciesToInstall } from './configs'
import { SUCCESS, ERROR, INFO } from './termColor'

export const createDirectory = (directoryName, remark) => {
  try {
    fs.mkdirSync(directoryName)
    process.chdir(directoryName)
    return console.log(SUCCESS(remark))
  } catch (error) {
    console.log(err)
    return console.log(ERROR('Error creating directory!'))
  }
}

export const removeDirectoryAndCreate = (directoryName, remark) => {
  try {
    fs.rmdirSync(directoryName, { recursive: true })
    createDirectory(directoryName, remark)
  } catch (error) {
    return console.log(ERROR('Error creating directory!'))
  }
}

export const directoryExists = (directoryName) => {
  try {
    fs.accessSync(
      directoryName,
      fs.constants.R_OK | fs.constants.W_OK | fs.constants.F_OK
    )
    return true
  } catch (error) {
    return false
  }
}

export const generateProjectFolders = (directories) => {
  console.log(INFO('Creating project directories...'))
  directories.forEach((directory) => {
    fs.mkdirSync(directory)
  })
}

export const createTopLevelFiles = (files) => {
  console.log(INFO('Creating top level files...'))
  files.forEach((file) => {
    fs.writeFileSync(file, '')
  })
}

export const createCommonFiles = () => {
  console.log(INFO('Creating common project files...'))
  let pathDirectory = path.join(process.cwd(), 'middlewares')
  process.chdir(pathDirectory)
  const middlewareFiles = ['authenticate.js', 'authorize.js']
  middlewareFiles.forEach((file) => {
    fs.writeFileSync(file, '')
  })
  pathDirectory = path.join('../', 'helpers')
  process.chdir(pathDirectory)
  const helpersFiles = [
    'apiFeatures.js',
    'appError.js',
    'catchAsyncError.js',
    'email.js',
    'emailTemplates.js',
    'tokenCreator.js',
  ]
  helpersFiles.forEach((file) => {
    fs.writeFileSync(file, '')
  })
  pathDirectory = path.join('../', 'controllers')
  process.chdir(pathDirectory)
  const controllersFiles = [
    'authController.js',
    'userController.js',
    'errorController.js',
    'controllerFactories.js',
  ]
  controllersFiles.forEach((file) => {
    fs.writeFileSync(file, '')
  })
  pathDirectory = path.join('../', 'models')
  process.chdir(pathDirectory)
  const modelsFiles = ['userModel.js']
  modelsFiles.forEach((file) => {
    fs.writeFileSync(file, '')
  })
  pathDirectory = path.join('../', 'routes')
  process.chdir(pathDirectory)
  const routesFiles = ['authRoutes.js', 'userRoutes.js']
  routesFiles.forEach((file) => {
    fs.writeFileSync(file, '')
  })
  pathDirectory = path.join('../', '')
  process.chdir(pathDirectory)
}

export const initProjectAndInstallDependencies = (authorName) => {
  console.log(INFO('Initializing project and creating package.json file...'))
  childProcess.exec(
    `yarn config set init-author-name ${authorName}; yarn init --yes`,
    (err, stdout) => {
      if (err) console.log(ERROR('Could not initialize project!'))
      const projectPackageJSON = JSON.parse(
        fs.readFileSync('package.json', { encoding: 'utf-8' })
      )
      const packageJSONModified = { ...packageJSON }
      packageJSONModified.name = projectPackageJSON.name
      packageJSONModified.version = projectPackageJSON.version
      packageJSONModified.main = 'app.js'
      packageJSONModified.description = ''
      packageJSONModified.author = projectPackageJSON.author
      packageJSONModified.license = projectPackageJSON.license
      fs.writeFileSync('package.json', JSON.stringify(packageJSONModified), {
        encoding: 'utf-8',
      })
      console.log(INFO('Installing dependencies and dev-dependencies...'))
      childProcess.exec(
        `yarn add ${dependenciesToInstall.join(
          ' '
        )}; yarn add --dev ${devDependenciesToInstall.join(' ')}; git init`,
        (err, stdout, stderr) => {
          if (
            stderr.includes(
              "warning You don't appear to have an internet connection."
            )
          ) {
            console.log(
              ERROR(
                'Could not install dependencies and dev-dependencies! Check your internet connection.'
              )
            )
            // process.exit(1)
          }
          console.log(
            SUCCESS('Successfully installed dependencies and dev-dependencies!')
          )
          console.log(INFO('Writing boilerplate codes to files...'))
          generateBoilerplateCodes()
          console.log(
            SUCCESS('Successfully written boilerplate codes to files!')
          )
          console.log(INFO('Launching project in Visual Studio Code...'))
          childProcess.exec('code .', (err, stdout, stderr) => {
            if (stderr) {
              console.log(ERROR('Unable to launch Visual Studio Code Editor.'))
            }
            console.log(INFO('Spawning server...'))
            childProcess.exec('yarn run start', (err, stdout, stderr) => {
              if (err) console.log(err)
              if (stderr) console.log(ERROR('Error spawning server!'))
              console.log(stdout)
            })
          })
        }
      )
    }
  )
}
