'use strict'

let gCanvas
let gCtx
let gIsDrawing = false
let gCurrShape = 'simple'
let gCurrState

// for shapes drawn won't go on each other , there are commented lines that works on circles and squares but i didnt go all the way through with it.
let gLastShape = {}

const gTouchEvs = ['touchstart', 'touchmove', 'touchend']

function init() {
  gCanvas = document.querySelector('.canvas')
  gCtx = gCanvas.getContext('2d')
  gCanvas.width = document.body.clientWidth
  gCanvas.height = document.body.clientHeight

  window.addEventListener('resize', onResize)

  addMouseEvents()

  addTouchEvents()
}

function addMouseEvents() {
  gCanvas.addEventListener('mousedown', startDrawing)
  gCanvas.addEventListener('mouseup', stopDrawing)
  gCanvas.addEventListener('mousemove', draw)
}

function addTouchEvents() {
  gCanvas.addEventListener('touchmove', startDrawing)
  gCanvas.addEventListener('touchstart', stopDrawing)
  gCanvas.addEventListener('touchend', draw)
}

function onResize() {
  gCanvas.width = document.body.clientWidth
  gCanvas.height = document.body.clientHeight

  gCtx.putImageData(gCurrState, 0, 0)
}

function startDrawing(ev) {
  gIsDrawing = true
  console.log(gLastShape)

  draw(ev)
}

function stopDrawing() {
  gIsDrawing = false
  gCtx.beginPath()
  gCurrState = gCtx.getImageData(0, 0, gCanvas.width, gCanvas.height)
}

// Options events
function onChangeShape(shape) {
  gCurrShape = shape
}

function onChangeColor(color) {
  gCtx.strokeStyle = color
}

function onChangeBgcColor(color) {
  gCtx.fillStyle = color
  gCtx.fillRect(0, 0, gCanvas.width, gCanvas.height)
}

function onClearCanvas() {
  gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
}

// Draws
function draw(ev) {
  if (!gIsDrawing) return
  console.log(ev)

  const { x, y } = getEvPos(ev)

  switch (gCurrShape) {
    case 'simple':
      drawLine(x, y)
      break
    case 'triangle':
      drawTriangle(x, y)
      break
    case 'square':
      // if (
      //   gLastShape.x > ev.offsetX - 50 &&
      //   gLastShape.x < ev.offsetX + 50 &&
      //   gLastShape.y > ev.offsetY - 50 &&
      //   gLastShape.y < ev.offsetY + 50
      // ) {
      //   return
      // }
      drawSquare(x, y)
      break
    case 'circle':
      // if (
      //   gLastShape.x > ev.offsetX - 50 &&
      //   gLastShape.x < ev.offsetX + 50 &&
      //   gLastShape.y > ev.offsetY - 50 &&
      //   gLastShape.y < ev.offsetY + 50
      // ) {
      //   return
      // }
      drawCircle(x, y)
      break
  }
}

function drawLine(x, y) {
  gCtx.lineWidth = 3
  gCtx.lineCap = 'round'

  gCtx.lineTo(x, y)
  gCtx.stroke()
  gCtx.moveTo(x, y)
}

function drawTriangle(x, y) {
  const height = 100 * (Math.sqrt(3) / 2)

  gCtx.beginPath()
  gCtx.lineWidth = 1

  gCtx.moveTo(x, y)
  gCtx.lineTo(x + 50, y + height)
  gCtx.lineTo(x - 50, y + height)
  gCtx.lineTo(x, y)
  gCtx.stroke()
  gCtx.closePath()
}

function drawSquare(x, y) {
  gCtx.beginPath()
  gCtx.lineWidth = 1

  gCtx.rect(x - 50 / 2, y - 50 / 2, 50, 50)
  gCtx.stroke()
  gCtx.closePath()

  // gLastShape.x = x - 50 / 2 + 25
  // gLastShape.y = y - 50 / 2 + 25
}

function drawCircle(x, y) {
  gCtx.beginPath()
  gCtx.lineWidth = 1
  gCtx.arc(x, y, 25, 0, 2 * Math.PI)
  gCtx.stroke()
  gCtx.closePath()

  // gLastShape.x = x
  // gLastShape.y = y
}

// Get Position
function getEvPos(ev) {
  //Gets the offset pos , the default pos
  var pos = {
    x: ev.offsetX,
    y: ev.offsetY,
  }
  // Check if its a touch ev
  if (gTouchEvs.includes(ev.type)) {
    //soo we will not trigger the mouse ev
    ev.preventDefault()
    //Gets the first touch point
    ev = ev.changedTouches[0]
    //Calc the right pos according to the touch screen
    pos = {
      x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
      y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
    }
  }
  return pos
}

// Download
function downloadImg(elLink) {
  const imgContent = gCanvas.toDataURL('image/jpeg')

  elLink.href = imgContent
}
