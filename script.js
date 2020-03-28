const canvas = /** @type {HTMLCanvasElement} */ document.getElementById(
  "contagionCanvas"
)
const ctx = /** @type {HTMLCanvasElement} */ canvas.getContext("2d")
canvas.width = "500"
canvas.height = "500"

/** Add agents with click */

canvas.addEventListener("click", () => {
  for (let i = 0; i < 10; i++) {
    quadtreeRoot.population.push(
      new Circle(
        Math.round(
          Math.random() * (canvas.width - circleRadius * 2) + circleRadius
        ),
        Math.round(
          Math.random() * (canvas.height - circleRadius * 2) + circleRadius
        ),
        circleRadius,
        0,
        Math.PI * 2,
        false
      )
    )
  }
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

const circleRadius = 2
const startAngle = 0
const endAngle = Math.PI * 2
const counterClockwise = false
let quadTreeArray = []
let tempAgentArray = []

/** Quadtree class */

class Quadtree {
  constructor(x, y, w, h, parent, name) {
    this.x = x
    this.y = y
    this.width = w
    this.height = h

    this.population = []
    this.populationCap = 6
    this.isDivided = false
    this.name = name

    this.parent = parent
    this.northwest = null
    this.northeast = null
    this.southwest = null
    this.southeast = null
  }

  insertAgent = function(agent) {
    this.population.push(agent)
  }

  update = function() {
    this.population.forEach(agent => {
      // if (
      //   agent.x >= this.x &&
      //   agent.x < this.width &&
      //   agent.y >= this.y &&
      //   agent.y < this.width &&
      //   this.population.length < this.populationCap
      // ) {
      //   console.log(`Pushing agents into current quadtree`)
      //   this.population.push(agent)

      // }
      // console.log(`
      // Agent's X coords = ${agent.x};
      // Agent's Y coords = ${agent.y};
      // ${this.name}Quadtree's starting X = ${this.x};
      // ${this.name}Quadtree's ending X = ${this.x + this.width};
      // ${this.name}Quadtree's starting Y = ${this.y};
      // ${this.name}Quadtree's ending Y = ${this.y + this.height}
      // `)

      if (
        agent.x >= this.x &&
        agent.x < this.x + this.width &&
        agent.y >= this.y &&
        agent.y < this.y + this.height &&
        this.population.length >= this.populationCap
      ) {
        // console.log("Dividing tree and deleting agents from parent")
        this.isDivided = true

        this.northwest = new Quadtree(
          this.x,
          this.y,
          this.width / 2,
          this.height / 2,
          this,
          "norhtwest"
        )
        this.northeast = new Quadtree(
          this.x + this.width / 2,
          this.y,
          this.width / 2,
          this.height / 2,
          this,
          "northeast"
        )
        this.southwest = new Quadtree(
          this.x,
          this.y + this.height / 2,
          this.width / 2,
          this.height / 2,
          this,
          "southwest"
        )
        this.southeast = new Quadtree(
          this.x + this.width / 2,
          this.y + this.height / 2,
          this.width / 2,
          this.height / 2,
          this,
          "southeast"
        )

        // console.log(
        //   `Pushing quadtrees into quadtree array, which is of length ${quadTreeArray.length}`
        // )
        quadTreeArray.push(
          this.northwest,
          this.northeast,
          this.southwest,
          this.southeast
        )
        // console.log(`Quadtree array length = ${quadTreeArray.length}`)

        while (this.population.length > 0) {
          /** Push agents into new quadtrees and delete them from parent quadtree */
          if (
            // this.population[0].x < this.width / 2 &&
            // this.population[0].y < this.height / 2

            this.population[0].x >= this.x &&
            this.population[0].x < this.x + this.width / 2 &&
            this.population[0].y >= this.y &&
            this.population[0].y < this.y + this.height / 2
          ) {
            // console.log("Pushing agents into northwest")
            this.northwest.population.push(this.population[0])
            this.population.shift()
          } else if (
            // this.population[0].x >= this.width / 2 &&
            // this.population[0].y < this.height / 2

            this.population[0].x >= this.x + this.width / 2 &&
            this.population[0].x < this.x + this.width &&
            this.population[0].y >= this.y &&
            this.population[0].y < this.y + this.height / 2
          ) {
            // console.log("Pushing agents into northeast")
            this.northeast.population.push(this.population[0])
            this.population.shift()
          } else if (
            // this.population[0].x < this.width / 2 &&
            // this.population[0].y >= this.height / 2

            this.population[0].x >= this.x &&
            this.population[0].x < this.x + this.width / 2 &&
            this.population[0].y >= this.y + this.height / 2 &&
            this.population[0].y < this.y + this.height
          ) {
            // console.log("Pushing agents into southwest")
            this.southwest.population.push(this.population[0])
            this.population.shift()
          } else if (
            // this.population[0].x >= this.width / 2 &&
            // this.population[0].y >= this.height / 2

            this.population[0].x >= this.x + this.width / 2 &&
            this.population[0].x < this.x + this.width &&
            this.population[0].y >= this.y + this.height / 2 &&
            this.population[0].y < this.y + this.height
          ) {
            // console.log("Pushing agents into southeast")
            this.southeast.population.push(this.population[0])
            this.population.shift()
          }
          // quadTreeArray.forEach(quadtree => {
          //   console.log(
          //     `${quadtree.name} population = ${quadtree.population.length}`
          //   )
          // })
          // console.log(quadTreeArray.length)
        }

        // console.log(`Updating northwest`)
        this.northwest.update()
        // console.log(`Updating northeast`)
        this.northeast.update()
        // console.log(`Updating southwest`)
        this.southwest.update()
        // console.log(`Updating southeast`)
        this.southeast.update()
      }
    })
  }

  draw = function() {
    ctx.strokeStyle = "rgba(0,255,0,1)"
    ctx.strokeRect(this.x, this.y, this.width, this.height)
    ctx.lineWidth = 1
  }
}

/** Instantiate quadtree root */

quadtreeRoot = new Quadtree(0, 0, canvas.width, canvas.height, null, "root")
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
    ctx.fillStyle = "rgba(240, 0, 0, 0.8)"
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
  }
}

function animate() {
  if (!pauseButton.classList.contains("paused")) {
    ctx.clearRect(0, 0, innerWidth, innerHeight)

    // quadTreeArray.forEach(quadtree => {
    //   console.log(`Quadtree population = ${quadtree.population.length}`)
    // })

    quadTreeArray.forEach(quadtree => {
      const quadtreePopulationLength = quadtree.population.length
      if (quadtree.population.length > 0) {
        for (let i = 0; i < quadtreePopulationLength; i++) {
          quadtreeRoot.population.push(quadtree.population[0])
          quadtree.population.shift()
        }
      }
    })

    // console.log(`Clearing quatree array`)
    quadTreeArray = []
    // console.log(`Pushing root into quadtree array`)
    quadTreeArray.push(quadtreeRoot)

    quadtreeRoot.population.forEach(agent => {
      // console.log("Updating agents from quadtree Root population")
      agent.update()
      agent.draw()
    })

    // console.log(`Updating root quadtree`)
    quadtreeRoot.update()

    quadTreeArray.forEach(quadtree => {
      quadtree.draw()
    })

    // console.log(`Quadtree array length = ${quadTreeArray.length}`)

    console.log("New frame")

    requestAnimationFrame(animate)
  }
}

animate()
