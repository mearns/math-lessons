export function configurePagesRouter (router) {
  router.get('/', (request, response) => {
    response.type('text/plain').send('Hi.')
  })
}
