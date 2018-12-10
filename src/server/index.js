import express from 'express'
import path from 'path'
import { configurePagesRouter } from './routers/pages-router'

export function main () {
  const app = createApp()
  configureApp(app)
  startServer(app)
}

function createApp () {
  const app = express()
  return app
}

function configureApp (app) {
  addStaticRoute(app)
  addPagesRoute(app)
}

function startServer (app) {
  const port = 8080
  app.listen(port, '', () => {
    console.log(`Listening on ${port}...`)
  })
}

function addStaticRoute (app) {
  app.use('/static/', express.static(path.resolve(__dirname, '../../dist/resources/js/index.js')))
}

function addPagesRoute (app) {
  const router = express.Router()
  configurePagesRouter(router)
  app.use('/pages/', router)
}
