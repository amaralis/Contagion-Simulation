const canvas = /** @type {HTMLCanvasElement} */ document.getElementById(
  "contagionCanvas"
)
const ctx = /** @type {HTMLCanvasElement} */ canvas.getContext("2d")
canvas.width = "500"
canvas.height = "500"

const pauseButton = document.querySelector("#pause")
pauseButton.addEventListener("click", () => {
  pauseButton.classList.toggle("paused")
  if (pauseButton.classList.contains("paused")) {
    return
  } else {
    animate()
  }
})

const circleRadius = 50
const startAngle = 0
const endAngle = Math.PI * 2
const counterClockwise = false

pause = function() {}

class Circle {
  constructor(x, y, radius, startAngle, endAngle, cc) {
    this.x = x
    this.y = y
    this.radius = radius
    this.startAngle = startAngle
    this.endAngle = endAngle
    this.cc = cc
    this.vX = /*Math.round(Math.random()) * 2 - 1*/ (Math.random() - 0.5) * 2
    this.vY = /*Math.round(Math.random()) * 2 - 1*/ (Math.random() - 0.5) * 2
  }

  draw = function() {
    ctx.beginPath()
    ctx.arc(
      this.x,
      this.y,
      this.radius,
      this.startAngle,
      this.endAngle,
      this.cc
    )
    // ctx.strokeStyle = "red"
    // ctx.stroke()
    ctx.fillStyle = "rgba(0, 255, 0, 0.8)"
    ctx.fill()
  }

  update = function() {
    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.vX = -this.vX
    }

    if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
      this.vY = -this.vY
    }

    this.y += this.vY
    this.x += this.vX

    console.log(
      this.x + this.radius,
      this.x - this.radius,
      canvas.width,
      this.vX
    )
  }
}

const myCircle = new Circle(
  Math.round(Math.random() * (canvas.width - circleRadius * 2) + circleRadius),
  Math.round(Math.random() * (canvas.height - circleRadius * 2) + circleRadius),
  50,
  0,
  Math.PI * 2,
  false
)

console.log(myCircle)

function animate() {
  if (pauseButton.classList.contains("paused")) {
    return
  } else {
    ctx.clearRect(0, 0, innerWidth, innerHeight)
    myCircle.update()
    myCircle.draw()
    requestAnimationFrame(animate)
  }
}

animate()
