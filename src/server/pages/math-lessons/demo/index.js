export default function getHtml () {
  return Promise.resolve(`
<!doctype html!>
<html>
  <head>
    <title>Demo</title>
  </head>
  <body>

    <script type='application/javascript' src='/static/js/bundles/math-lessons.js'></script>
  </body>
`)
}
