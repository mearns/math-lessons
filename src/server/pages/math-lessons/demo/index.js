export default function getHtml () {
  return Promise.resolve(`
<!doctype html!>
<html>
  <head>
    <title>Demo</title>
  </head>
  <body>
    <canvas id='canvas' width='400' height='300'></canvas>
    <script type='application/javascript' src='/static/js/bundles/math-lessons.js'></script>
  </body>
`)
}
