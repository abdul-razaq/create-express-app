import fs from 'fs'
import path from 'path'

const expressBoilerplate = `
import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import xss from 'xss-clean'
import hpp from 'hpp'

import authRouter from './routes/authRoutes'
import globalErrorHandler from './controllers/errorController'

dotenv.config()

const basePath = '/api/v1'
const app = express()

// Rate Limit!
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP address, Try again in an hour!',
})

// Security Middlewares
app.use(helmet())
app.use('/api', limiter)
app.use(mongoSanitize())
app.use(xss())
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
)

// General Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
app.use(
  express.json({
    limit: '20kb',
  })
)
app.use(express.urlencoded())
app.use(express.text())

// Static files middleware
app.use(express.static(\`\${__dirname}/public\`))

// Specify Application routes here
app.use(\`\${basePath}/auth\`, authRouter)

// 404 Error Handler
app.all('*', (req, res, next) => {
  return next(
    new AppError(\`\${req.originalUrl} does not exist on this server\`, 404)
  )
})

// General Application Error handler
app.use(globalErrorHandler)

export default app

`
const serverBoilerplate = `
import http from 'http'

import dotenv from 'dotenv'

import app from './app'

dotenv.config()

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION!!!, Shutting down app...')
  console.log(err.name, err.message)
  process.exit(1)
})

const PORT = process.env.PORT || 5000

const server = http.createServer(app)

server.listen(PORT, 'localhost', () => {
  console.log(\`Server listening for incoming requests on port \${PORT}\`)
})

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION!!!, Shutting down app...')
  console.log(err.name, err.message)
  server.close(() => {
    process.exit(1)
  })
})

`

const eslintrcBoilerplate = `
{
  "extends": ["airbnb", "prettier", "plugin:node/recommended"],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error",
    "spaced-comment": "warn",
    "no-console": "off",
    "consistent-return": "off",
    "func-names": "off",
    "allow-parens": "off",
    "object-shorthand": "off",
    "no-process-exit": "off",
    "no-param-reassign": "off",
    "no-return-await": "off",
    "no-underscore-dangle": "off",
    "class-methods-use-this": "off",
    "prefer-destructuring": ["error", { "object": true, "array": false }],
    "no-unused-vars": [
      "error",
      { "argsIgnorePattern": "req|res|next|val|data|err" }
    ],
    "no-duplicate-imports": "error",
    "node/no-unsupported-features/es-syntax": "off"
  },
  "parserOptions": {
    "sourceType": "module"
  }
}
`
const prettierrcBoilerplate = `
{
  "singleQuote": true,
  "semi": false
}
`
const dotEnvBoilerplate = `
NODE_ENV=development
PORT=5000
DATABASE=''
DATABASE_PASSWORD=''

JWT_SECRET=this-is-my-super-long-secret-and-ultra-long-secret
JWT_EXPIRES_IN=3d
JWT_COOKIE_EXPIRES_IN=90

EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=25
EMAIL_USERNAME=''
EMAIL_PASSWORD=''
EMAIL_FROM=''
`

const authRouteBoilerplate = `
import express from 'express'

import * as authController from '../controllers/authController'

const router = express.Router()

router.post('/signup', authController.signup)
router.post('/login', authController.login)

export default router

`

const authControllerBoilerplate = `
import catchAsyncError from '../helpers/catchAsyncError'

const signup = catchAsyncError(async (req, res, next) => {})
const login = catchAsyncError(async (req, res, next) => {})

`

const errorControllerBoilerplate = `
export default (error, req, res, next) => {}

`
const catchAsyncBoilerplate = `
export default (asyncFunction) => {
  return (req, res, next) => {
    asyncFunction(req, res, next).catch(next)
  }
}

`
const gitignoreBoilerplate = `
node_modules/
.env
`

export default () => {
  fs.writeFileSync('app.js', expressBoilerplate, { encoding: 'utf-8' })
  fs.writeFileSync('server.js', serverBoilerplate, { encoding: 'utf-8' })
  fs.writeFileSync('.eslintrc.json', eslintrcBoilerplate, {
    encoding: 'utf-8',
  })
  fs.writeFileSync('.prettierrc', prettierrcBoilerplate, { encoding: 'utf-8' })
  fs.writeFileSync('.env', dotEnvBoilerplate, { encoding: 'utf-8' })
  fs.writeFileSync('.gitignore', gitignoreBoilerplate, {
    encoding: 'utf-8',
  })
  process.chdir('routes')
  fs.writeFileSync('authRoutes.js', authRouteBoilerplate, { encoding: 'utf-8' })
  process.chdir(path.join('../', 'controllers'))
  fs.writeFileSync('authController.js', authControllerBoilerplate, {
    encoding: 'utf-8',
  })
  fs.writeFileSync('errorController.js', errorControllerBoilerplate, {
    encoding: 'utf-8',
  })
  process.chdir(path.join('../', 'helpers'))
  fs.writeFileSync('catchAsyncError.js', catchAsyncBoilerplate, {
    encoding: 'utf-8',
  })
  process.chdir(path.join('../', ''))
}
