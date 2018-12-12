/* eslint-env browser */

import * as units from '../../lib/units'
import * as animations from '../../lib/animations'

export function main () {
  const firstLayout = new units.FixedColumnRectangularLayout(7)
  const secondLayout = new units.FixedColumnRectangularLayout(12)
  const partitionedLayout = new units.ParitionedLayout(firstLayout, new units.TranslatedLayout(secondLayout, 8, 0), 11)
  const group = new units.UnitGroup(firstLayout)
  group.addUnits(38)

  const animation = animations.createLinearAnimation(0.5)
  group.transitionToLayout(partitionedLayout, animation)

  let waitingForDraw = false
  function render () {
    if (!waitingForDraw) {
      waitingForDraw = true
      requestAnimationFrame(() => {
        waitingForDraw = false
        draw(group.getUnitLocations())
      })
    }
  }
  render()

  setTimeout(() => {
    const start = new Date()
    const timer = setInterval(() => {
      const elapsedTime = new Date() - start
      const done = group.tick(elapsedTime / 1000)
      if (done) {
        clearInterval(timer)
      }
      render()
    }, 10)
  }, 100)
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
  for (let [x, y] of unitLocations) {
    const rect = [scale * x, scale * y, scale * fill, scale * fill]
    ctx.fillRect(...rect)
    ctx.strokeRect(...rect)
  }
  ctx.restore()
}

main()
