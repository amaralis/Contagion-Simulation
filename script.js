const contagionCanvas = /** @type {HTMLCanvasElement} */ document.getElementById(
  "contagionCanvas"
);
const chartCanvasDiv = /** @type {HTMLCanvasElement} */ document.getElementById(
  "chartCanvasDiv"
);

const ctx = /** @type {HTMLCanvasElement} */ contagionCanvas.getContext("2d");
const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight / 4;
contagionCanvas.width = canvasWidth.toString();
contagionCanvas.height = canvasHeight.toString();

console.log(window.innerWidth);

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

/** ========================== Global vars ========================== */

const circleRadius = 4;
const startAngle = 0;
const endAngle = Math.PI * 2;
const counterClockwise = false;
let numberOfTimesteps = 0;
const timestep = 1000;

let quadTreeArray = [];
let quadTreeArrayNotDivided = [];
let susceptibleArr = [];
let contaminatedArr = [];
let infectedArr = [];
let removedArr = [];

/** ========================== Chart vars and functions ========================== */

let chartLabels = 0;
let newContaminated = 0;
let previousContaminated = 0;
let totalContaminated = 0;
let newInfected = 0;
let previousInfected = 0;

let getChartableData = function(string) {
  switch (string) {
    case "labels":
      chartLabels++;
      return chartLabels;
    case "new contaminated":
      newContaminated = 0;
      newContaminated = contaminatedArr.length - previousContaminated;
      return newContaminated;
    case "new infected":
      newInfected = 0;
      newInfected = infectedArr.length - previousInfected;
      return newInfected;
  }
};

storePreviousContaminated = function() {
  if (chart.data.datasets[2].data.length < 2) {
    previousContaminated = 0;
  } else {
    let previousArrIndex = chart.data.datasets[2].data.length - 1;
    previousContaminated = chart.data.datasets[1].data[previousArrIndex];
  }
};

storePreviousInfected = function() {
  if (chart.data.datasets[4].data.length < 2) {
    previousInfected = 0;
  } else {
    let previousContamArrRef = chart.data.datasets[4].data.length - 1;
    previousInfected = chart.data.datasets[3].data[previousContamArrRef];
  }
};

addGeneralLabels = function(chart, label) {
  chart.data.labels.push(label);
};

addTotalSusceptible = function(chart, susceptible) {
  chart.data.datasets[0].data.push(susceptible);
};

addNewContaminated = function(chart, contaminated) {
  chart.data.datasets[2].data.push(contaminated);
};

addTotalContaminated = function(chart, contaminated) {
  chart.data.datasets[1].data.push(contaminated);
};

addNewInfected = function(chart, infected) {
  chart.data.datasets[4].data.push(infected);
};

addTotalInfected = function(chart, infected) {
  chart.data.datasets[3].data.push(infected);
};

addTotalRemoved = function(chart, removed) {
  chart.data.datasets[5].data.push(removed);
};
/** ========================== Chart ========================== */

let chart = new Chart(ctxChart, {
  // The type of chart we want to create
  type: "line",

  // The data for our dataset
  data: {
    labels: [],
    datasets: [
      {
        /** [0] */
        label: "Total susceptible",
        //backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(0, 255, 255)",
        data: []
      },
      {
        /** [1] */
        label: "Total contaminated",
        //backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 185, 0)",
        data: []
      },
      {
        /** [2] */
        label: "New contaminated",
        //backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 255, 50)",
        data: []
      },
      {
        /** [3] */
        label: "Total infected",
        //backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 0, 0)",
        data: []
      },
      {
        /** [4] */
        label: "New infected",
        //backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 115, 0)",
        data: []
      },
      {
        /** [5] */
        label: "Total removed",
        //backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(150, 150, 150)",
        data: []
      }
    ]
  },

  // Configuration options go here
  options: {}
});
const chartWidth = window.innerWidth;
const chartHeight = window.innerHeight / 2;

chart.canvas.parentNode.style.height = `${chartHeight.toString()}px`;
chart.canvas.parentNode.style.width = `${chartWidth.toString()}px`;

/** Add agents with click */

const spawnAgents = 499;
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
  console.log(`Agents: ${numberOfAgents}`);

  quadtreeRoot.population.push(
    (seedAgent = new Agent(
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
  seedAgent.isContaminated = true;
  contaminatedArr.push(seedAgent);
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
  };

  updateTimeFromStart = function() {
    this.timeFromStart = this.getTime() - this.startTime;
  };

  updateRemainingTime = function() {
    this.remainingTime = this.updateInterval - this.timeFromStart;
  };

  resetRemainingTime = function() {
    this.remainingTime = this.updateInterval;
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

  startTimer(string) {
    switch (string) {
      case "start":
        {
          console.log(`TIMESTEP: ${chartLabels}`);
          this.interval = setTimeout(() => {
            this.updateStartTime();
            this.performAction();
            this.startTimer("start");
          }, this.remainingTime);
        }
        break;
      case "stop":
        {
          clearInterval(this.interval);
          this.updateTimeFromStart();
          this.updateRemainingTime();
        }
        break;
      default:
        console.log(
          "No such condition for timer. Use 'start' to start timer, or restart from when it was paused, 'stop' to pause."
        );
        break;
    }
  }

  /** Call functions to execute when timer fires from within the performAction() function */

  performAction = function() {
    numberOfTimesteps++;

    console.log(
      `New contaminated array length at step -1 = ${chart.data.datasets[1].data.length}`
    );
    console.log(
      `Previous contaminated array length at step -1 = ${chart.data.datasets[2].data.length}`
    );

    storePreviousContaminated();
    addGeneralLabels(chart, getChartableData("labels"));
    addTotalSusceptible(chart, susceptibleArr.length);
    addNewContaminated(chart, getChartableData("new contaminated"));
    addTotalContaminated(chart, contaminatedArr.length);
    addNewInfected(chart, getChartableData("new infected"));
    addTotalInfected(chart, infectedArr.length);
    addTotalRemoved(chart, removedArr.length);

    previousContaminated = contaminatedArr.length;

    chart.update();
  };
}

myTimer = new Timer(timestep);

document.addEventListener("DOMContentLoaded", () => {
  myTimer.startTimer("start");
  if (numberOfTimesteps == 0) {
    console.log(`Recording contaminated array length with time offset`);
    // setInterval(() => {
    //   previousContaminated = contaminatedArr.length;
    // }, timestep);
  }
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

/** ========================== Agent class ========================== */

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
              if (agent.isSusceptible && this.isContaminated) {
                agent.isContaminated = true;
                agent.isSusceptible = false;

                const i = susceptibleArr.indexOf(agent);
                contaminatedArr.push(agent);
                susceptibleArr.splice(i, 1);
              }
              if (this.isSusceptible && agent.isContaminated) {
                this.isContaminated = true;
                this.isSusceptible = false;

                const i = susceptibleArr.indexOf(this);
                contaminatedArr.push(this);
                susceptibleArr.splice(i, 1);
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
            if (agent.isSusceptible && this.isContaminated) {
              agent.isContaminated = true;
              agent.isSusceptible = false;

              const i = susceptibleArr.indexOf(agent);
              contaminatedArr.push(agent);
              susceptibleArr.splice(i, 1);
            }
            if (this.isSusceptible && agent.isContaminated) {
              this.isContaminated = true;
              this.isSusceptible = false;

              const i = susceptibleArr.indexOf(this);
              contaminatedArr.push(this);
              susceptibleArr.splice(i, 1);
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
