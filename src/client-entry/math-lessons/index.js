/* eslint-env browser */

import tinycolor from 'tinycolor2'
import * as units from '../../lib/units'
import * as layouts from '../../lib/layouts'
import * as animations from '../../lib/animations'
import Promise from 'bluebird'

export function main () {
  const allGroups = []
  const firstLayout = new layouts.FixedColumnRectangularLayout(7)
  const secondLayout = new layouts.FixedColumnRectangularLayout(7)
    .translate(8, 10)
  const group = new units.UnitGroup(firstLayout)
  group.addUnits(38)
  allGroups.push(group)

  const g3 = new units.UnitGroup(new layouts.FixedColumnRectangularLayout(7).translate(16, 0))
  g3.addUnits(20)
  allGroups.push(g3)

  Promise.delay(0)
    .then(() => g3.mergeIn(group, new animations.LinearAnimation(0.1), { scramble: false, stagger: 10 }))

  // group.splitIntoNewGroup(secondLayout, animations.createLinearAnimation(0.5), 12, 30)
  //   .then(g2 => {
  //     allGroups.push(g2)
  //     return Promise.delay(100).then(() => g2)
  //   })
  //   .then(g2 => group.transitionToLayout(firstLayout, animations.createLinearAnimation(0.2)).then(() => g2))
  //   .then(g2 => g3.mergeIn(g2, animations.createLinearAnimation(0.05)))
  //   .then(() => console.log('done'))

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

function rainbow (length, i) {
  return tinycolor.fromRatio({ h: i / length, s: 1, v: 0.75 }).toString('hex')
}

function grayScale (length, i) {
  return tinycolor.fromRatio({ h: 0, s: 0, v: i / length }).toString('hex')
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
  ctx.translate(0, 25)
  ctx.fillStyle = '#eee'
  ctx.strokeStyle = '#ddd'
  for (let group of allGroups) {
    const locations = group.getUnitLocations()
    for (let i = 0; i < locations.length; i++) {
      const [x, y] = locations[i]
      const color = grayScale(locations.length, i)
      ctx.fillStyle = color
      const rect = [scale * x, scale * y, scale * fill, scale * fill]
      ctx.fillRect(...rect)
      ctx.strokeRect(...rect)
    }
  }
  ctx.restore()
}

main()
