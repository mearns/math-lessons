export default function getHtml () {
  return Promise.resolve(`
<!doctype html!>
<html>
  <head>
    <title>Demo</title>
  </head>
  <body>
    <canvas style='border:1px solid #eee' id='canvas' width='800' height='600'></canvas>
    <script type='application/javascript' src='/static/js/bundles/math-lessons.js'></script>
  </body>
`)
}
