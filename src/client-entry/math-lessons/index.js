/* eslint-env browser */

import { createRectangularGroupAnimation } from '../../lib/retangular-groups'

export function main () {
  let group = createRectangularGroupAnimation([9, 4], [3, 12], 5)

  let waitingForDraw = false
  function render () {
    if (!waitingForDraw) {
      waitingForDraw = true
      requestAnimationFrame(() => {
        waitingForDraw = false
        draw(group.unitLocations)
      })
    }
  }
  render()

  const start = new Date()
  const timer = setInterval(() => {
    const elapsedTime = new Date() - start
    const isDone = group(elapsedTime / 1000)
    if (isDone) {
      clearInterval(timer)
    }
    render()
  }, 10)
}

function draw (unitLocations) {
  const fill = 0.85
  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')
  const width = canvas.width
  const height = canvas.height
  const scale = 20
  ctx.clearRect(0, 0, width, height)

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
