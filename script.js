const contagionCanvas = /** @type {HTMLCanvasElement} */ document.getElementById(
  "contagionCanvas"
)
const chartCanvasDiv = /** @type {HTMLCanvasElement} */ document.getElementById(
  "chartCanvasDiv"
)

const ctx = /** @type {HTMLCanvasElement} */ contagionCanvas.getContext("2d")
contagionCanvas.width = "800"
contagionCanvas.height = "800"

const ctxChart = /** @type {HTMLCanvasElement} */ chartCanvas.getContext("2d")
chartCanvasDiv.style.position = "relative"

/** Log framerate */

let fps = 0
const updateFrames = function() {
  fps++
}

const refreshFrames = function() {
  fps = 0
}

const logFrameRate = setInterval(() => {
  console.log(`Frames per second = ${fps}`)
  refreshFrames()
}, 1000)

/** Add agents with click */

contagionCanvas.addEventListener("click", () => {
  for (let i = 0; i < 100; i++) {
    quadtreeRoot.population.push(
      new Agent(
        Math.round(
          Math.random() * (contagionCanvas.width - circleRadius * 2) +
            circleRadius
        ),
        Math.round(
          Math.random() * (contagionCanvas.height - circleRadius * 2) +
            circleRadius
        ),
        circleRadius,
        0,
        Math.PI * 2,
        false,
        quadtreeRoot
      )
    )
  }
  numberOfAgents += 100
  console.log(`Agentes: ${numberOfAgents}`)
})

/** Pause feature */
const pauseButton = document.querySelector("#pause")
pauseButton.addEventListener("click", () => {
  pauseButton.classList.toggle("paused")
  if (!pauseButton.classList.contains("paused")) {
    animate()
  }
})

/** Global vars */

let numberOfAgents = 0

const circleRadius = 4
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
    this.populationCap = 4
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
    if (this.population.length >= this.populationCap) {
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
          this.population[0].x >= this.x &&
          this.population[0].x < this.x + this.width / 2 &&
          this.population[0].y >= this.y &&
          this.population[0].y < this.y + this.height / 2
        ) {
          // console.log("Pushing agents into northwest")
          this.population[0].parentQuadtree = this.northwest
          this.northwest.population.push(this.population[0])
          this.population.shift()
        } else if (
          this.population[0].x >= this.x + this.width / 2 &&
          this.population[0].x < this.x + this.width &&
          this.population[0].y >= this.y &&
          this.population[0].y < this.y + this.height / 2
        ) {
          // console.log("Pushing agents into northeast")
          this.population[0].parentQuadtree = this.northeast
          this.northeast.population.push(this.population[0])
          this.population.shift()
        } else if (
          this.population[0].x >= this.x &&
          this.population[0].x < this.x + this.width / 2 &&
          this.population[0].y >= this.y + this.height / 2 &&
          this.population[0].y < this.y + this.height
        ) {
          // console.log("Pushing agents into southwest")
          this.population[0].parentQuadtree = this.southwest
          this.southwest.population.push(this.population[0])
          this.population.shift()
        } else if (
          this.population[0].x >= this.x + this.width / 2 &&
          this.population[0].x < this.x + this.width &&
          this.population[0].y >= this.y + this.height / 2 &&
          this.population[0].y < this.y + this.height
        ) {
          // console.log("Pushing agents into southeast")
          this.population[0].parentQuadtree = this.southeast
          this.southeast.population.push(this.population[0])
          this.population.shift()
        }
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
  }

  draw = function() {
    ctx.strokeStyle = "rgba(0,255,0,1)"
    ctx.strokeRect(this.x, this.y, this.width, this.height)
    ctx.lineWidth = 1
  }
}

/** Instantiate quadtree root */

quadtreeRoot = new Quadtree(
  0,
  0,
  contagionCanvas.width,
  contagionCanvas.height,
  null,
  "root"
)
quadTreeArray.push(quadtreeRoot)

/** Agent class */

class Agent {
  constructor(x, y, radius, startAngle, endAngle, cc, parentQuadtree) {
    this.x = x
    this.y = y
    this.radius = radius
    this.startAngle = startAngle
    this.endAngle = endAngle
    this.cc = cc
    this.vX = (Math.random() - 0.5) * 2
    this.vY = (Math.random() - 0.5) * 2
    this.parentQuadtree = parentQuadtree
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
    if (
      this.x + this.radius > contagionCanvas.width ||
      this.x - this.radius < 0
    ) {
      this.vX = -this.vX
    }

    if (
      this.y + this.radius > contagionCanvas.height ||
      this.y - this.radius < 0
    ) {
      this.vY = -this.vY
    }

    this.y += this.vY
    this.x += this.vX
  }
}

/** Chart */

let chart = new Chart(ctxChart, {
  // The type of chart we want to create
  type: "line",

  // The data for our dataset
  data: {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "My First dataset",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: [0, 10, 5, 2, 20, 30, 45]
      }
    ]
  },

  // Configuration options go here
  options: {}
})

chart.canvas.parentNode.style.height = "800px"
chart.canvas.parentNode.style.width = "800px"

function animate() {
  if (!pauseButton.classList.contains("paused")) {
    ctx.clearRect(0, 0, contagionCanvas.width, contagionCanvas.height)

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

    updateFrames()

    requestAnimationFrame(animate)
  }
}

animate()
