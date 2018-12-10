import mathLessonsDemoPage from '../../pages/math-lessons/demo'

export function configurePagesRouter (router) {
  router.get('/math-lessons/demo', handleAsPromised((request, reponse) => {
    return mathLessonsDemoPage()
  }))
}

function handleAsPromised (handler) {
  return (request, response, next) => {
    return handler(request, response)
      .then(html => response.type('html').send(html))
      .catch(next)
  }
}
