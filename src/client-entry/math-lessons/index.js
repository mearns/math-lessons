/* eslint-env browser */

import createRectangularGroup from '../../lib/retangular-groups'

export function main () {
  const group = createRectangularGroup(5, 7)

  let waitingToRender = false
  let renderArgs = []
  function render (...args) {
    console.log(args)
    if (!waitingToRender) {
      waitingToRender = true
      requestAnimationFrame(() => draw(...renderArgs))
    }
    renderArgs = args
  }

  const renderHelper = group.createChangeHandler(['unitLocations'], render)
  renderHelper()
}

function draw (unitLocations) {
  const fill = 0.85
  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')
  const width = canvas.width
  const height = canvas.height
  const scale = 20

  ctx.save()
  ctx.fillStyle = '#eee'
  ctx.strokeStyle = '#ddd'
  for (let i = 0; i < unitLocations.length; i++) {
    const [x, y] = unitLocations[i]
    const rect = [scale * x, scale * y, scale * fill, scale * fill]
    ctx.fillRect(...rect)
    ctx.strokeRect(...rect)
  }
  ctx.restore()
}

main()
