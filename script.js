const canvas = /** @type {HTMLCanvasElement} */ document.getElementById(
  "contagionCanvas"
)
const ctx = /** @type {HTMLCanvasElement} */ canvas.getContext("2d")
canvas.width = "500"
canvas.height = "500"

/** Add agents with click */

canvas.addEventListener("click", () => {
  tempAgentArray.push(
    new Circle(
      /*Math.round(
        Math.random() * (canvas.width - circleRadius * 2) + circleRadius
      ),
      Math.round(
        Math.random() * (canvas.height - circleRadius * 2) + circleRadius
      ),*/ 450,
      450,
      circleRadius,
      0,
      Math.PI * 2,
      false
    )
  )
})

/** Pause feature */
const pauseButton = document.querySelector("#pause")
pauseButton.addEventListener("click", () => {
  pauseButton.classList.toggle("paused")
  if (!pauseButton.classList.contains("paused")) {
    animate()
  }
})

/** Global consts */

const circleRadius = 5
const startAngle = 0
const endAngle = Math.PI * 2
const counterClockwise = false
let quadTreeArray = []
let tempAgentArray = []

/** Quadtree class */

class Quadtree {
  constructor(x, y, w, h, parent) {
    this.x = x
    this.y = y
    this.width = w
    this.height = h

    this.population = []
    this.populationCap = 6
    this.isDivided = false

    this.parent = parent
    this.northwest = null
    this.northeast = null
    this.southwest = null
    this.southeast = null
  }

  insertAgent = function(agent) {
    /** Check if quadtree is not divided, then if the agent's coordinates fit inside it. */

    // if (
    //   !quadtree.isDivided &&
    //   agent.x < quadtree.x + quadtree.width &&
    //   agent.x >= quadtree.x &&
    //   agent.y < quadtree.y + quadtree.height &&
    //   agent.y >= quadtree.y
    // ) {
    this.population.push(agent)
    //}
  }

  update = function() {
    if (!this.isDivided && this.population.length < this.populationCap) {
      tempAgentArray.forEach(agent => {
        /** Push agents into current quadtree - inconsistent */
        console.log("Pushing agent")
        this.population.push(agent)
      })
      console.log(this.population.length)
    }
    if (!this.isDivided && this.population.length == this.populationCap) {
      console.log("Dividing tree") /** THIS IS NEVER HAPPENING */
      this.isDivided = true

      this.northwest = new Quadtree(
        this.x,
        this.y,
        this.width / 2,
        this.height / 2,
        this
      )
      this.northeast = new Quadtree(
        this.width / 2,
        this.y,
        this.width / 2,
        this.height / 2,
        this
      )
      this.southwest = new Quadtree(
        this.x,
        this.height / 2,
        this.width / 2,
        this.height / 2,
        this
      )
      this.southeast = new Quadtree(
        this.width / 2,
        this.height / 2,
        this.width / 2,
        this.height / 2,
        this
      )

      quadTreeArray.push(
        this.northwest,
        this.northeast,
        this.southwest,
        this.southeast
      )

      while (this.population.length > 0) {
        /** Push agents into new quadtrees and delete them from parent quadtree */
        if (
          this.population[0].x < this.width / 2 &&
          this.population[0].y < this.height / 2
        ) {
          console.log("Pushing agents into northwest")
          this.northwest.population.push(this.population[0])
          this.population.splice(this.population[0], 1)
        } else if (
          this.population[0].x >= this.width / 2 &&
          this.population[0].y < this.height / 2
        ) {
          console.log("Pushing agents into northeast")
          this.northeast.population.push(this.population[0])
          this.population.splice(this.population[0], 1)
        } else if (
          this.population[0].x < this.width / 2 &&
          this.population[0].y >= this.height / 2
        ) {
          console.log("Pushing agents into southwest")
          this.southwest.population.push(this.population[0])
          this.population.splice(this.population[0], 1)
        } else if (
          this.population[0].x >= this.width / 2 &&
          this.population[0].y >= this.height / 2
        ) {
          console.log("Pushing agents into southeast")
          this.southeast.population.push(this.population[0])
          this.population.splice(this.population[0], 1)
        }
        console.log(this.population.length)
        console.log(
          `Northwest population = ${this.northwest.population.length}, Northeast population = ${this.northeast.population.length}, Southwest population = ${this.southwest.population.length}, Southeast population = ${this.southeast.population.length}`
        )
      }
    }
  }

  draw = function() {
    if (this.population.length > 2) {
      ctx.strokeStyle = "rgba(255,0,0,1)"
      ctx.lineWidth = 5
    } else {
      ctx.strokeStyle = "rgba(0,255,0,1)"
    }
    ctx.strokeRect(this.x, this.y, this.width, this.height)
    ctx.lineWidth = 1
  }
}

/** Instantiate quadtree root */

quadtreeRoot = new Quadtree(0, 0, canvas.width, canvas.height)
quadTreeArray.push(quadtreeRoot)

/** Agent/Circle class */

class Circle {
  constructor(x, y, radius, startAngle, endAngle, cc) {
    this.x = x
    this.y = y
    this.radius = radius
    this.startAngle = startAngle
    this.endAngle = endAngle
    this.cc = cc
    this.vX = (Math.random() - 0.5) * 2
    this.vY = (Math.random() - 0.5) * 2
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

    /** Check if quadtree is not divided, then if the agent's coordinates fit inside it. */
    // quadTreeArray.forEach(quadtree => {
    //   if (
    //     !quadtree.isDivided &&
    //     this.x < quadtree.x + quadtree.width &&
    //     this.x >= quadtree.x &&
    //     this.y < quadtree.y + quadtree.height &&
    //     this.y >= quadtree.y
    //   ) {
    //     quadtree.population.push(this)
    //   }
    // })
  }
}

function animate() {
  if (!pauseButton.classList.contains("paused")) {
    ctx.clearRect(0, 0, innerWidth, innerHeight)

    quadTreeArray.forEach(quadtree => {
      if (quadtree.population.length > 0) {
        quadtree.population.forEach(agent => {
          tempAgentArray.push(agent)
        })
        quadtree.population = []
      }
    })

    quadTreeArray = []
    quadTreeArray.push(quadtreeRoot)

    quadTreeArray.forEach(quadtree => {
      quadtree.update()
      quadtree.draw()
    })

    tempAgentArray.forEach(agent => {
      agent.update()
      agent.draw()
    })

    tempAgentArray = []

    //console.log(quadTreeArray.length)
    // quadTreeArray.forEach(quadtree => {
    //   console.log(`Number of agents in quadtree: ${quadtree.population.length}`)
    // })

    console.log("Frame count")

    requestAnimationFrame(animate)
  }
}

animate()
