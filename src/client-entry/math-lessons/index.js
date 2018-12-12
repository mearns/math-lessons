/* eslint-env browser */

import * as units from '../../lib/units'
import * as layouts from '../../lib/layouts'
import * as animations from '../../lib/animations'
import Promise from 'bluebird'

export function main () {
  const allGroups = []
  const firstLayout = new layouts.FixedColumnRectangularLayout(7)
  const secondLayout = new layouts.FixedColumnRectangularLayout(7)
    .translate(8, 0)
  const group = new units.UnitGroup(firstLayout)
  group.addUnits(38)
  allGroups.push(group)

  group.splitIntoNewGroup(secondLayout, animations.createLinearAnimation(0.5), 12, 30)
    .then(g2 => {
      allGroups.push(g2)
      return Promise.delay(100).then(() => g2)
    })
    .then(g2 => Promise.join(
      g2.transitionToLayout(new layouts.FixedColumnRectangularLayout(5).translate(8, 0), animations.createLinearAnimation(0.2)),
      group.transitionToLayout(firstLayout, animations.createLinearAnimation(0.2))
    ))
    .then(() => console.log('done'))

  let waitingForDraw = false
  function render () {
    if (!waitingForDraw) {
      waitingForDraw = true
      requestAnimationFrame(() => {
        waitingForDraw = false
        draw(allGroups)
      })
    }
  }
  render()

  setTimeout(() => {
    const start = new Date()
    setInterval(() => {
      const elapsedTime = new Date() - start
      allGroups.forEach(g => g.tick(elapsedTime / 1000))
      render()
    }, 10)
  }, 100)
}

function draw (allGroups) {
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
  for (let group of allGroups) {
    for (let [x, y] of group.getUnitLocations()) {
      const rect = [scale * x, scale * y, scale * fill, scale * fill]
      ctx.fillRect(...rect)
      ctx.strokeRect(...rect)
    }
  }
  ctx.restore()
}

main()
