const contagionCanvas = /** @type {HTMLCanvasElement} */ document.getElementById(
  "contagionCanvas"
);
const chartCanvasDiv = /** @type {HTMLCanvasElement} */ document.getElementById(
  "chartCanvasDiv"
);

const ctx = /** @type {HTMLCanvasElement} */ contagionCanvas.getContext("2d");
contagionCanvas.width = "600";
contagionCanvas.height = "600";

const ctxChart = /** @type {HTMLCanvasElement} */ chartCanvas.getContext("2d");
chartCanvasDiv.style.position = "relative";

/** Log framerate */

let fps = 0;
const updateFrames = function() {
  fps++;
};

const refreshFrames = function() {
  fps = 0;
};

// const logFrameRate = setInterval(() => {
//   console.log(`Frames per second = ${fps}`)
//   refreshFrames()
// }, 1000)

/** Add agents with click */

const spawnAgents = 500;
let numberOfAgents = 0;

contagionCanvas.addEventListener("click", () => {
  for (let i = 0; i < spawnAgents; i++) {
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
    );
  }

  quadtreeRoot.population.forEach(agent => {
    susceptibleArr.push(agent);
  });

  numberOfAgents += spawnAgents;
  console.log(`Agentes: ${numberOfAgents}`);

  quadtreeRoot.population.push(
    (testAgent = new TestAgent(
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
    ))
  );
  testAgent.isContaminated = true;
  contaminatedArr.push(testAgent);
});

/** Timer for chart update */

class Timer {
  constructor(updateInterval) {
    this.startTime = this.getTime();
    this.timeFromStart = this.getTime() - this.startTime;
    this.updateInterval = updateInterval;
    this.remainingTime = this.updateInterval;
  }

  getTime = function() {
    return new Date().getTime();
  };

  updateStartTime = function() {
    this.startTime = this.getTime();
    // console.log(`Updating start time`)
  };

  updateTimeFromStart = function() {
    this.timeFromStart = this.getTime() - this.startTime;
  };

  updateRemainingTime = function() {
    this.remainingTime = this.updateInterval - this.timeFromStart;
  };

  resetRemainingTime = function() {
    this.remainingTime = this.updateInterval;
    // console.log(`Resetting remaining time to ${remainingTime}`)
  };

  setTimer = function(string) {
    if (string === "start") {
      this.updateStartTime();
      this.startTimer(string);
      this.resetRemainingTime();
    } else {
      this.startTimer(string);
    }
  };

  startTimer(condition) {
    switch (condition) {
      case "start":
        {
          this.interval = setTimeout(() => {
            this.updateStartTime();

            console.log(`Tick`);
            console.log(`Remaining time: ${this.remainingTime}`);

            this.startTimer("start");
          }, this.remainingTime);
        }
        break;
      case "stop":
        {
          clearInterval(this.interval);
          this.updateTimeFromStart();
          this.updateRemainingTime();
          console.log(`Remaining time is ${this.remainingTime}`);
        }
        break;
      default:
        console.log(
          "No such condition for timer. Use 'start' to start timer, or restart from when it was paused, 'stop' to pause."
        );
        break;
    }
  }
}

myTimer = new Timer(1000);

document.addEventListener("DOMContentLoaded", () => {
  myTimer.startTimer("start");
});

/** Pause feature for main draw() and chart timer */

const pauseButton = document.querySelector("#pause");
pauseButton.addEventListener("click", () => {
  pauseButton.classList.toggle("paused");
  if (!pauseButton.classList.contains("paused")) {
    myTimer.setTimer("start");
    // myTimer.updateStartTime();
    // myTimer.startTimer();
    // myTimer.resetRemainingTime();
    draw();
  } else {
    myTimer.startTimer("stop");
    // myTimer.resetInterval(interval);
  }
});

/** Global vars */

const circleRadius = 4;
const startAngle = 0;
const endAngle = Math.PI * 2;
const counterClockwise = false;

let susceptibleArr = [];
let contaminatedArr = [];
let infectedArr = [];
let removedArr = [];
let quadTreeArray = [];
let quadTreeArrayNotDivided = [];

/** Quadtree class */

class Quadtree {
  constructor(x, y, w, h, parent, name) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;

    this.population = [];
    this.populationCap = 100;
    this.isDivided = false;
    this.name = name;
    this.isNeighbor;

    this.parent = parent;
    this.northwest = null;
    this.northeast = null;
    this.southwest = null;
    this.southeast = null;
  }

  insertAgent = function(agent) {
    this.population.push(agent);
  };

  update = function() {
    if (this.population.length >= this.populationCap) {
      // console.log("Dividing tree and deleting agents from parent")
      this.isDivided = true;

      this.northwest = new Quadtree(
        this.x,
        this.y,
        this.width / 2,
        this.height / 2,
        this,
        "norhtwest"
      );
      this.northeast = new Quadtree(
        this.x + this.width / 2,
        this.y,
        this.width / 2,
        this.height / 2,
        this,
        "northeast"
      );
      this.southwest = new Quadtree(
        this.x,
        this.y + this.height / 2,
        this.width / 2,
        this.height / 2,
        this,
        "southwest"
      );
      this.southeast = new Quadtree(
        this.x + this.width / 2,
        this.y + this.height / 2,
        this.width / 2,
        this.height / 2,
        this,
        "southeast"
      );

      // console.log(
      //   `Pushing quadtrees into quadtree array, which is of length ${quadTreeArray.length}`
      // )
      quadTreeArray.push(
        this.northwest,
        this.northeast,
        this.southwest,
        this.southeast
      );
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
          this.population[0].parentQuadtree = this.northwest;
          this.northwest.population.push(this.population[0]);
          this.population.shift();
        } else if (
          this.population[0].x >= this.x + this.width / 2 &&
          this.population[0].x < this.x + this.width &&
          this.population[0].y >= this.y &&
          this.population[0].y < this.y + this.height / 2
        ) {
          // console.log("Pushing agents into northeast")
          this.population[0].parentQuadtree = this.northeast;
          this.northeast.population.push(this.population[0]);
          this.population.shift();
        } else if (
          this.population[0].x >= this.x &&
          this.population[0].x < this.x + this.width / 2 &&
          this.population[0].y >= this.y + this.height / 2 &&
          this.population[0].y < this.y + this.height
        ) {
          // console.log("Pushing agents into southwest")
          this.population[0].parentQuadtree = this.southwest;
          this.southwest.population.push(this.population[0]);
          this.population.shift();
        } else if (
          this.population[0].x >= this.x + this.width / 2 &&
          this.population[0].x < this.x + this.width &&
          this.population[0].y >= this.y + this.height / 2 &&
          this.population[0].y < this.y + this.height
        ) {
          // console.log("Pushing agents into southeast")
          this.population[0].parentQuadtree = this.southeast;
          this.southeast.population.push(this.population[0]);
          this.population.shift();
        }
      }

      // console.log(`Updating northwest`)
      this.northwest.update();
      // console.log(`Updating northeast`)
      this.northeast.update();
      // console.log(`Updating southwest`)
      this.southwest.update();
      // console.log(`Updating southeast`)
      this.southeast.update();
    }
  };

  draw = function() {
    ctx.strokeStyle = "rgba(0,255,0,1)";
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.lineWidth = 1;
  };
}

/** Instantiate quadtree root */

quadtreeRoot = new Quadtree(
  0,
  0,
  contagionCanvas.width,
  contagionCanvas.height,
  null,
  "root"
);
quadTreeArray.push(quadtreeRoot);

/** Agent class */

class Agent {
  constructor(x, y, radius, startAngle, endAngle, cc, parentQuadtree) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    this.cc = cc;
    this.vX = (Math.random() - 0.5) * 2;
    this.vY = (Math.random() - 0.5) * 2;
    this.parentQuadtree = parentQuadtree;
    this.hasNeighboringQuadtree;
    this.isSusceptible = true;
    this.isContaminated;
    this.isInfected;
    this.isRemoved;

    this.neighbors = [];
    this.neighboringQuadtrees = [];
  }

  getNeighbors = function() {
    let pointTop = this.y - this.radius - 1;
    let pointRight = this.x + this.radius + 1;
    let pointBottom = this.y + this.radius + 1;
    let pointLeft = this.x - this.radius - 1;

    if (
      pointTop < this.parentQuadtree.y ||
      pointRight >= this.parentQuadtree.x + this.parentQuadtree.width ||
      pointBottom >= this.parentQuadtree.y + this.parentQuadtree.height ||
      pointLeft < this.parentQuadtree.x
    ) {
      quadTreeArrayNotDivided.forEach(quadtree => {
        if (
          !(
            quadtree.x + quadtree.width < pointLeft ||
            quadtree.x > pointRight ||
            quadtree.y > pointBottom ||
            quadtree.y + quadtree.height < pointTop
          )
        ) {
          this.hasNeighboringQuadtree = true;
          quadtree.isNeighbor = true;
          this.neighboringQuadtrees.push(quadtree);
        }
      });

      this.neighboringQuadtrees.forEach(quadtreeNeighbor => {
        quadtreeNeighbor.population.forEach(agent => {
          const distX = agent.x - this.x;
          const distY = agent.y - this.y;
          const radii = agent.radius + this.radius;

          if (agent != this) {
            this.neighbors.push(agent);

            /** Detect collision */
            if (distX * distX + distY * distY < radii * radii) {
              ctx.beginPath();
              ctx.arc(agent.x, agent.y, 5, 0, Math.PI * 2, false);
              ctx.fillStyle = "rgba(100, 100, 0, 1)";
              ctx.fill();

              if (agent.isSusceptible && this.isContaminated) {
                agent.isContaminated = true;
                agent.isSusceptible = false;

                console.log(`Susceptible array length is ${susceptibleArr.length};
                Contaminated array length is ${contaminatedArr.length}`);
                const i = susceptibleArr.indexOf(agent);
                contaminatedArr.push(agent);
                susceptibleArr.splice(i, 1);
                console.log(`Susceptible array length is ${susceptibleArr.length};
                Contaminated array length is ${contaminatedArr.length}`);
              }
              if (this.isSusceptible && agent.isContaminated) {
                this.isContaminated = true;
                this.isSusceptible = false;

                console.log(`Susceptible array length is ${susceptibleArr.length};
                Contaminated array length is ${contaminatedArr.length}`);
                const i = susceptibleArr.indexOf(this);
                contaminatedArr.push(this);
                susceptibleArr.splice(i, 1);
                console.log(`Susceptible array length is ${susceptibleArr.length};
                Contaminated array length is ${contaminatedArr.length}`);
              }
            }
          }
        });
      });
    } else {
      this.parentQuadtree.population.forEach(agent => {
        const distX = agent.x - this.x;
        const distY = agent.y - this.y;
        const radii = agent.radius + this.radius;

        if (agent != this) {
          this.neighbors.push(agent);

          /** Detect collision */
          if (distX * distX + distY * distY < radii * radii) {
            ctx.beginPath();
            ctx.arc(agent.x, agent.y, 5, 0, Math.PI * 2, false);
            ctx.fillStyle = "rgba(100, 100, 0, 1)";
            ctx.fill();

            if (agent.isSusceptible && this.isContaminated) {
              agent.isContaminated = true;
              agent.isSusceptible = false;

              console.log(`Susceptible array length is ${susceptibleArr.length};
                Contaminated array length is ${contaminatedArr.length}`);
              const i = susceptibleArr.indexOf(agent);
              contaminatedArr.push(agent);
              susceptibleArr.splice(i, 1);
              console.log(`Susceptible array length is ${susceptibleArr.length};
                Contaminated array length is ${contaminatedArr.length}`);
            }
            if (this.isSusceptible && agent.isContaminated) {
              this.isContaminated = true;
              this.isSusceptible = false;

              console.log(`Susceptible array length is ${susceptibleArr.length};
                Contaminated array length is ${contaminatedArr.length}`);
              const i = susceptibleArr.indexOf(this);
              contaminatedArr.push(this);
              susceptibleArr.splice(i, 1);
              console.log(`Susceptible array length is ${susceptibleArr.length};
                Contaminated array length is ${contaminatedArr.length}`);
            }
          }
        }
      });
    }

    // console.log(this)

    return this.neighbors;
  };

  draw = function() {
    if (this.isContaminated) {
      ctx.beginPath();
      ctx.arc(
        this.x,
        this.y,
        this.radius,
        this.startAngle,
        this.endAngle,
        this.cc
      );
      ctx.fillStyle = "rgba(255, 0, 0, 1)";
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(
        this.x,
        this.y,
        this.radius,
        this.startAngle,
        this.endAngle,
        this.cc
      );
      ctx.fillStyle = "rgba(0, 255, 0, 1)";
      ctx.fill();
    }
  };

  update = function() {
    if (
      this.x + this.radius > contagionCanvas.width ||
      this.x - this.radius < 0
    ) {
      this.vX = -this.vX;
    }

    if (
      this.y + this.radius > contagionCanvas.height ||
      this.y - this.radius < 0
    ) {
      this.vY = -this.vY;
    }

    this.y += this.vY;
    this.x += this.vX;
  };
}

/** Class test agent */

class TestAgent {
  constructor(x, y, radius, startAngle, endAngle, cc, parentQuadtree) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    this.cc = cc;
    this.vX = (Math.random() - 0.5) * 2;
    this.vY = (Math.random() - 0.5) * 2;
    this.parentQuadtree = parentQuadtree;
    this.hasNeighboringQuadtree;
    this.isSusceptible;
    this.isContaminated;
    this.isInfected;
    this.isRemoved;

    this.neighbors = [];
    this.neighboringQuadtrees = [];
    // console.log(
    //   `Number of neighbors for test agent at init = ${this.neighbors.length}`
    // )
    // console.log(
    //   `Number of neighboring quadtrees for test agent at init = ${this.neighboringQuadtrees.length}`
    // )
  }

  getNeighbors = function() {
    let pointTop = this.y - this.radius - 1;
    let pointRight = this.x + this.radius + 1;
    let pointBottom = this.y + this.radius + 1;
    let pointLeft = this.x - this.radius - 1;

    if (
      pointTop < this.parentQuadtree.y ||
      pointRight >= this.parentQuadtree.x + this.parentQuadtree.width ||
      pointBottom >= this.parentQuadtree.y + this.parentQuadtree.height ||
      pointLeft < this.parentQuadtree.x
    ) {
      quadTreeArrayNotDivided.forEach(quadtree => {
        // console.log(
        //   `quadTreeArrayNotDivided has ${quadTreeArrayNotDivided.length} elements`
        // )
        if (
          !(
            quadtree.x + quadtree.width < pointLeft ||
            quadtree.x > pointRight ||
            quadtree.y > pointBottom ||
            quadtree.y + quadtree.height < pointTop
          )
        ) {
          ctx.beginPath();
          ctx.arc(quadtree.x, quadtree.y, 5, 0, Math.PI * 2, false);
          ctx.fillStyle = "rgba(255, 255, 255, 1)";
          ctx.fill();

          this.hasNeighboringQuadtree = true;
          quadtree.isNeighbor = true;

          // console.log(quadtree.isNeighbor)

          this.neighboringQuadtrees.push(quadtree);

          // console.log(
          //   `Number of neighboring quadtrees: ${this.neighboringQuadtrees.length}`
          // )
          this.neighboringQuadtrees.forEach(neighbor => {
            if (neighbor != this) {
              // console.log(
              //   `Population within ${neighbor.name} quadtree is of ${neighbor.population.length}`
              // )
            }
          });
        }
      });

      this.neighboringQuadtrees.forEach(quadtreeNeighbor => {
        quadtreeNeighbor.population.forEach(agent => {
          if (agent != this) {
            // console.log(
            //   `Number of neighbors for test agent before push at 422 = ${this.neighbors.length}`
            // )

            this.neighbors.push(agent);

            ctx.beginPath();
            ctx.arc(agent.x, agent.y, 5, 0, Math.PI * 2, false);
            ctx.fillStyle = "rgba(255, 255, 255, 1)";
            ctx.fill();

            // console.log(
            //   `Number of neighbors for test agent after push at 422 = ${this.neighbors.length}`
            // )

            if (
              Math.sqrt(
                Math.pow(agent.x - this.x, 2) + Math.pow(agent.y - this.y, 2)
              ) <
              agent.radius + this.radius
            ) {
              // console.log(`collision`)

              ctx.beginPath();
              ctx.arc(agent.x, agent.y, 5, 0, Math.PI * 2, false);
              ctx.fillStyle = "rgba(100, 100, 0, 1)";
              ctx.fill();

              if (agent.isSusceptible && this.isContaminated) {
                agent.isContaminated = true;
                agent.isSusceptible = false;

                console.log(`Susceptible array length is ${susceptibleArr.length};
                Contaminated array length is ${contaminatedArr.length}`);
                const i = susceptibleArr.indexOf(agent);
                contaminatedArr.push(agent);
                susceptibleArr.splice(i, 1);
                console.log(`Susceptible array length is ${susceptibleArr.length};
                Contaminated array length is ${contaminatedArr.length}`);
              }
              if (this.isSusceptible && agent.isContaminated) {
                this.isContaminated = true;
                this.isSusceptible = false;

                console.log(`Susceptible array length is ${susceptibleArr.length};
                Contaminated array length is ${contaminatedArr.length}`);
                const i = susceptibleArr.indexOf(this);
                contaminatedArr.push(this);
                susceptibleArr.splice(i, 1);
                console.log(`Susceptible array length is ${susceptibleArr.length};
                Contaminated array length is ${contaminatedArr.length}`);
              }
            }
          }
        });
      });
    } else {
      /** GET NEIGHBORS WITHIN CURRENT QUADTREE HERE, SO IT DOESN'T CHECK IT TWICE WHEN ON A BORDER */

      this.parentQuadtree.population.forEach(agent => {
        if (agent != this) {
          // console.log(
          //   `Number of neighbors for test agent before push at 474 = ${this.neighbors.length}`
          // )

          this.neighbors.push(agent);

          // ctx.beginPath()
          // ctx.arc(agent.x, agent.y, 5, 0, Math.PI * 2, false)
          // ctx.fillStyle = "rgba(255, 255, 255, 1)"
          // ctx.fill()

          // console.log(
          //   `Number of neighbors for test agent after push at 474 = ${this.neighbors.length}`
          // )

          /** Collisions were only being detected on the border of a quadtree */
          if (
            Math.sqrt(
              Math.pow(agent.x - this.x, 2) + Math.pow(agent.y - this.y, 2)
            ) <
            agent.radius + this.radius
          ) {
            // console.log(`collision`)

            ctx.beginPath();
            ctx.arc(agent.x, agent.y, 5, 0, Math.PI * 2, false);
            ctx.fillStyle = "rgba(100, 100, 0, 1)";
            ctx.fill();

            if (agent.isSusceptible && this.isContaminated) {
              agent.isContaminated = true;
              agent.isSusceptible = false;

              console.log(`Susceptible array length is ${susceptibleArr.length};
                Contaminated array length is ${contaminatedArr.length}`);
              const i = susceptibleArr.indexOf(agent);
              contaminatedArr.push(agent);
              susceptibleArr.splice(i, 1);
              console.log(`Susceptible array length is ${susceptibleArr.length};
                Contaminated array length is ${contaminatedArr.length}`);
            }
            if (this.isSusceptible && agent.isContaminated) {
              this.isContaminated = true;
              this.isSusceptible = false;

              console.log(`Susceptible array length is ${susceptibleArr.length};
                Contaminated array length is ${contaminatedArr.length}`);
              const i = susceptibleArr.indexOf(this);
              contaminatedArr.push(this);
              susceptibleArr.splice(i, 1);
              console.log(`Susceptible array length is ${susceptibleArr.length};
                Contaminated array length is ${contaminatedArr.length}`);
            }
          }
        }
      });
    }
    // console.log(
    //   `Number of neighbors for test agent at end of getNeighbors = ${this.neighbors.length}`
    // )
    // this.neighbors.forEach(neighbor => {
    //   console.log(
    //     `Neighbor agent has coordX of ${neighbor.x} and coordY of ${neighbor.y}`
    //   )
    // })

    return this.neighbors;
  };

  draw = function() {
    if (!this.hasNeighbor) {
      ctx.beginPath();
      ctx.arc(
        this.x,
        this.y,
        this.radius,
        this.startAngle,
        this.endAngle,
        this.cc
      );
      ctx.fillStyle = "rgba(0, 255, 255, 1)";
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(
        this.x,
        this.y,
        this.radius,
        this.startAngle,
        this.endAngle,
        this.cc
      );
      ctx.fillStyle = "rgba(0, 0, 255, 1)";
      ctx.fill();
    }
  };

  update = function() {
    if (
      this.x + this.radius > contagionCanvas.width ||
      this.x - this.radius < 0
    ) {
      this.vX = -this.vX;
    }

    if (
      this.y + this.radius > contagionCanvas.height ||
      this.y - this.radius < 0
    ) {
      this.vY = -this.vY;
    }

    this.y += this.vY;
    this.x += this.vX;
  };
}

/** ========================== Chart ========================== */

let chart = new Chart(ctxChart, {
  // The type of chart we want to create
  type: "line",

  // The data for our dataset
  data: {
    labels: [],
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
});

chart.canvas.parentNode.style.height = "200px";
chart.canvas.parentNode.style.width = "600px";

/** ========================== Main draw ========================== */

function draw() {
  if (!pauseButton.classList.contains("paused")) {
    ctx.clearRect(0, 0, contagionCanvas.width, contagionCanvas.height);

    // quadTreeArray.forEach(quadtree => {
    //   console.log(`Quadtree population = ${quadtree.population.length}`)
    // })

    quadTreeArray.forEach(quadtree => {
      const quadtreePopulationLength = quadtree.population.length;

      if (quadtree.population.length > 0) {
        for (let i = 0; i < quadtreePopulationLength; i++) {
          quadtreeRoot.population.push(quadtree.population[0]);
          quadtree.population.shift();
        }
      }
    });

    // console.log(`Clearing quatree array`)
    quadTreeArray = [];
    // console.log(`Pushing root into quadtree array`)
    quadTreeArray.push(quadtreeRoot);

    quadtreeRoot.population.forEach(agent => {
      // console.log("Updating agents from quadtree Root population")
      agent.update();
      agent.draw();
    });

    // console.log(`Updating root quadtree`)
    quadtreeRoot.update();
    quadTreeArrayNotDivided = [];

    quadTreeArray.forEach(quadtree => {
      quadtree.draw();
      if (!quadtree.isDivided) {
        quadTreeArrayNotDivided.push(quadtree);
      }
    });

    quadTreeArrayNotDivided.forEach(quadtree => {
      quadtree.population.forEach(agent => {
        agent.getNeighbors();

        // console.log(`Neighbors: ${agent.neighbors.length}`)
        // console.log(
        //   `Neighboring quadtrees: ${agent.neighboringQuadtrees.length}`
        // )
        agent.neighbors = [];
        agent.neighboringQuadtrees = [];
        // console.log(`Neighbors: ${agent.neighbors.length}`)
        // console.log(
        //   `Neighboring quadtrees: ${agent.neighboringQuadtrees.length}`
        // )
      });
    });

    // console.log(`Quadtree array length = ${quadTreeArray.length}`)

    updateFrames();

    requestAnimationFrame(draw);
  }
}

draw();
