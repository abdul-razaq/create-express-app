#!/usr/bin/node
import os from 'os'
import path from 'path'
import readline from 'readline'

import main from './main'

import { WARNING, QUERY, ERROR, INFO } from './termColor'

import {
  createDirectory,
  removeDirectoryAndCreate,
  directoryExists,
} from './helpers'

let projectLocation, projectName, projectAuthor, pathDirectory

console.log(INFO('create-express-app v1.0.0'))

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.question(
  QUERY('Enter location to create project ( Default: Desktop ): '),
  (answer) => {
    projectLocation = answer || 'Desktop'
    rl.question(QUERY('Enter project name: '), (answer) => {
      projectName = answer
      rl.question(QUERY('Enter project author name: '), (answer) => {
        projectAuthor = answer
        pathDirectory = path.join(os.homedir(), projectLocation)
        try {
          process.chdir(pathDirectory)
          if (directoryExists(projectName)) {
            rl.question(
              WARNING(
                'Directory already exists, Do you want to override? (Y/N) '
              ),
              (answer) => {
                if (answer.toLowerCase() === 'y') {
                  removeDirectoryAndCreate(
                    projectName,
                    'Initialized project directory!'
                  )
                } else {
                  console.log(INFO('Exiting script...'))
                  rl.close()
                  process.exit(1)
                }
                main(projectAuthor)
              }
            )
          } else {
            createDirectory(projectName, 'Initialized project directory!')
            main(projectAuthor)
          }
        } catch (err) {
          console.log(ERROR('Location does not exist!'))
        }
      })
    })
  }
)
