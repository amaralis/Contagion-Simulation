/** ================== Contagion Canvas ================== */

const contagionCanvas = /** @type {HTMLCanvasElement} */ document.getElementById(
  "contagion-canvas"
);

const ctx = /** @type {HTMLCanvasElement} */ contagionCanvas.getContext("2d");
const canvasWidth = /*window.innerWidth / 2;*/ 650;
const canvasHeight = /*window.innerHeight / 2;*/ 312;
contagionCanvas.width = canvasWidth.toString();
contagionCanvas.height = canvasHeight.toString();

/** ========================== Contagion Canvas Corrected ========================== */

const contagionCanvasCorrected = /** @type {HTMLCanvasElement} */ document.getElementById(
  "contagion-canvas-corrected"
);

const ctxCorrected = /** @type {HTMLCanvasElement} */ contagionCanvasCorrected.getContext(
  "2d"
);
const canvasWidthCorrected = /*window.innerWidth / 2;*/ 650;
const canvasHeightCorrected = /*window.innerHeight / 2;*/ 312;
contagionCanvasCorrected.width = canvasWidthCorrected.toString();
contagionCanvasCorrected.height = canvasHeightCorrected.toString();

/** ========================== Chart canvas ========================== */

const chartCanvasDiv = document.getElementById("chart-canvas-div");
const chartCanvas = document.querySelector("#chart-canvas");
const ctxChart = /** @type {HTMLCanvasElement} */ chartCanvas.getContext("2d");

/** ========================== Chart init and sizing ========================== */

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
        hidden: true,
        //backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(0, 255, 255)",
        data: [],
      },
      {
        /** [1] */
        label: "Total contaminated",
        hidden: true,
        //backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 185, 0)",
        data: [],
      },
      {
        /** [2] */
        label: "New contaminated",
        hidden: true,
        //backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 255, 50)",
        data: [],
      },
      {
        /** [3] */
        label: "Total infected",
        hidden: true,
        //backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 0, 0)",
        data: [],
      },
      {
        /** [4] */
        label: "New infected",
        //backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 115, 0)",
        data: [],
      },
      {
        /** [5] */
        label: "Total removed",
        hidden: true,
        //backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(150, 150, 150)",
        data: [],
      },
      {
        /** [6] */
        label: "Total deceased",
        //backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(190, 0, 0)",
        data: [],
      },
      {
        /** [7] */
        label: "Total infected alt.",
        hidden: true,
        //backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(0, 200, 200)",
        data: [],
      },
      {
        /** [8] */
        label: "New infected alt.",
        //backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(0, 200, 120)",
        data: [],
      },
      {
        /** [9] */
        label: "Total removed alt.",
        hidden: true,
        //backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(120, 120, 120)",
        data: [],
      },
      {
        /** [10] */
        label: "Total deceased alt.",
        //backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(190, 0, 130)",
        data: [],
      },
      {
        /** [11] */
        label: "Total susceptible alt.",
        hidden: true,
        //backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(235, 235, 0)",
        data: [],
      },
      {
        /** [12] */
        label: "Total contaminated alt.",
        hidden: true,
        //backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(150, 80, 0)",
        data: [],
      },
      {
        /** [13] */
        label: "New contaminated alt.",
        hidden: true,
        //backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(10, 10, 10)",
        data: [],
      },
    ],
  },

  // Configuration options go here
  options: {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      labels: {
        fontSize: 14,
      },
    },
  },
});

const contentWrapper = document.querySelector("#content-wrapper");

const chartWidth = chartCanvas.style.width;
const chartHeight = chartCanvas.style.height;

chart.canvas.parentNode.style.width = `${chartWidth.toString()}px`;
chart.canvas.parentNode.style.height = `${chartHeight.toString()}px`;

/** ================== Log framerate (don't forget to updateFrames() before requestAnimation(draw())) ================== */

let fps = 0;
const updateFrames = function () {
  fps++;
};

const refreshFrames = function () {
  fps = 0;
};

const logFrameRate = setInterval(() => {
  console.log(`Frames per second = ${fps}`);
  refreshFrames();
}, 1000);

/** ========================== Global vars ========================== */

const circleRadius = 1;
const startAngle = 0;
const endAngle = Math.PI * 2;
const counterClockwise = false;
let numberOfTimesteps = 0;
const timestep = 700;
const quadtreeMaxPop = 30;

let totalContaminations = 0;
let totalContaminationsCorrected = 0;

/** ========================== Quadtree-specific vars ========================== */

let agentsWhoWashedHands = 0;

let quadTreeArray = [];
let quadTreeArrayNotDivided = [];
let susceptibleArr = [];
let contaminatedArr = [];
let infectedArr = [];
let removedArr = [];
let deceasedArr = [];
let numberOfAgents = [];

let washHandsProbability = 0;
let timeUntilWashHands = 500;
let timeUntilInfected = 1500;
let timeUntilRemoved = 2800;
let spawnAgents = 1000;

/** ========================== Corrected Quadtree-specific vars ========================== */

let agentsWhoWashedHandsCorrected = 0;

let quadTreeArrayCorrected = [];
let quadTreeArrayNotDividedCorrected = [];
let susceptibleArrCorrected = [];
let contaminatedArrCorrected = [];
let infectedArrCorrected = [];
let removedArrCorrected = [];
let deceasedArrCorrected = [];
let numberOfAgentsCorrected = [];

let washHandsProbabilityCorrected = 0;
let timeUntilWashHandsCorrected = 500;
let timeUntilInfectedCorrected = 1500;
let timeUntilRemovedCorrected = 2800;
let spawnAgentsCorrected = 1000;

/** ========================== HTML vars ========================== */

const startSimBtn = document.querySelector("#start-sim-btn");
const washHandsProbabilityInput = document.querySelector(
  "#personal-decontamination-input"
);
// const timeUntilWashHandsCorrectedInput = document.querySelector(
//   "#timeUntilWashHandsCorrected"
// );
// const timeUntilInfectedCorrectedInput = document.querySelector(
//   "#timeUntilInfectedCorrected"
// );
// const timeUntilRemovedCorrectedInput = document.querySelector(
//   "#timeUntilRemovedCorrected"
// );
const socialDistancingInput = document.querySelector("#social-distancing");

// const toggleMortalityRates = document.querySelector("#mortalityRates");
// const mortalityRates = document.querySelector("#mortality-list");
// const mortalityRatesLi = document.querySelector(".input-div");

const mortalityRateZeroesInput = document.querySelector(
  "#mortality-rate-zeroes"
);

const mortalityRateTensInput = document.querySelector("#mortality-rate-tens");

const mortalityRateTwentiesInput = document.querySelector(
  "#mortality-rate-twenties"
);

const mortalityRateThirtiesInput = document.querySelector(
  "#mortality-rate-thirties"
);

const mortalityRateFortiesInput = document.querySelector(
  "#mortality-rate-forties"
);

const mortalityRateFiftiesInput = document.querySelector(
  "#mortality-rate-fifties"
);

const mortalityRateSixtiesInput = document.querySelector(
  "#mortality-rate-sixties"
);

const mortalityRateSeventiesInput = document.querySelector(
  "#mortality-rate-seventies"
);

const mortalityRateEightiesInput = document.querySelector(
  "#mortality-rate-eighties"
);

let mortalityRateZeroes = parseFloat(
  document.querySelector("#mortality-rate-zeroes").value
);
let mortalityRateTens = parseFloat(
  document.querySelector("#mortality-rate-tens").value
);
let mortalityRateTwenties = parseFloat(
  document.querySelector("#mortality-rate-twenties").value
);
let mortalityRateThirties = parseFloat(
  document.querySelector("#mortality-rate-thirties").value
);
let mortalityRateForties = parseFloat(
  document.querySelector("#mortality-rate-forties").value
);
let mortalityRateFifties = parseFloat(
  document.querySelector("#mortality-rate-fifties").value
);
let mortalityRateSixties = parseFloat(
  document.querySelector("#mortality-rate-sixties").value
);
let mortalityRateSeventies = parseFloat(
  document.querySelector("#mortality-rate-seventies").value
);
let mortalityRateEighties = parseFloat(
  document.querySelector("#mortality-rate-eighties").value
);

const biohazardDiv = document.querySelector("#biohazard");
const introPara = document.querySelector("#intro");
const introBtn = document.querySelector("#introBtn");
let introSVG = document.querySelector("#biohazard-svg");

/*const avgContaminations = document.querySelector("#avgCont");
const avgContaminationsAlt = document.querySelector("#avgContAlt");*/

/** ========================== HTML handlers and stuff ========================== */

/** Intro text animation */

const introText =
  "Welcome to my first project. The coding on display here is amateurish at best, and the layout may appear broken on some devices. Don't even try it on Edge and Internet Explorer. It may run slow on your device, as the simulation presented is resource-intensive. It is intended to be an exercise in javascript and data manipulation during my time in social isolation, with the bare minimum styling required. Accessibility, cross-browser compatibility, and code modularity with webpack and a front-end framework could not be achieved, as I am still in the process of learning. Enjoy your visit!";
const introTextArr = [...introText];

const addChar = function (arr, para) {
  let i = 0;
  let timer = setInterval(() => {
    if (i < arr.length) {
      para.textContent += arr[i];
      i++;
    } else {
      clearInterval(timer);
    }
  }, 25);
};
setTimeout(() => {
  addChar(introTextArr, introPara);
}, 3500);

/** Intro button handler */

introBtn.onmouseup = () => {
  setTimeout(() => {
    biohazardDiv.classList.remove("showing");
    biohazardDiv.classList.add("hidden");
  }, 100);
};

washHandsProbabilityInput.onchange = function () {
  console.log(`${washHandsProbabilityInput.value}`);
  console.log(`${washHandsProbabilityCorrected}`);

  if (washHandsProbabilityInput.value > 100) {
    washHandsProbabilityInput.value = 100;
  } else if (washHandsProbabilityInput.value < 1) {
    washHandsProbabilityInput.value = 0;
  }

  washHandsProbabilityCorrected = washHandsProbabilityInput.value / 100;
  console.log(`${washHandsProbabilityInput.value}`);
  console.log(`${washHandsProbabilityCorrected}`);
};

/*timeUntilWashHandsCorrectedInput.onchange = function () {
  if (timeUntilWashHandsCorrectedInput.value > 30) {
    timeUntilWashHandsCorrectedInput.value = 30;
  } else if (timeUntilWashHandsCorrectedInput.value < 0) {
    timeUntilWashHandsCorrectedInput.value = 0;
  }

  timeUntilWashHandsCorrected = timeUntilWashHandsCorrectedInput.value * 1000;
};

timeUntilInfectedCorrectedInput.onchange = function () {
  if (timeUntilInfectedCorrectedInput.value > 30) {
    timeUntilInfectedCorrectedInput.value = 30;
  } else if (timeUntilInfectedCorrectedInput.value < 0) {
    timeUntilInfectedCorrectedInput.value = 0;
  }

  timeUntilInfectedCorrected = timeUntilInfectedCorrectedInput.value * 1000;
};

timeUntilRemovedCorrectedInput.onchange = function () {
  if (timeUntilRemovedCorrectedInput.value > 30) {
    timeUntilRemovedCorrectedInput.value = 30;
  } else if (timeUntilRemovedCorrectedInput.value < 0) {
    timeUntilRemovedCorrectedInput.value = 0;
  }

  timeUntilRemovedCorrected = timeUntilRemovedCorrectedInput.value * 1000;
};*/

socialDistancingInput.onchange = function () {
  if (socialDistancingInput.value > 100) {
    socialDistancingInput.value = 100;
  } else if (socialDistancingInput.value < 0) {
    socialDistancingInput.value = 0;
  }

  spawnAgentsCorrected = 1000 * (socialDistancingInput.value / 100);
};

mortalityRateZeroesInput.onchange = function () {
  mortalityRateZeroes = parseFloat(
    document.querySelector("#mortality-rate-zeroes").value
  );
};

mortalityRateTensInput.onchange = function () {
  mortalityRateTens = parseFloat(
    document.querySelector("#mortality-rate-tens").value
  );
};

mortalityRateTwentiesInput.onchange = function () {
  mortalityRateTwenties = parseFloat(
    document.querySelector("#mortality-rate-twenties").value
  );
};

mortalityRateThirtiesInput.onchange = function () {
  mortalityRateThirties = parseFloat(
    document.querySelector("#mortality-rate-thirties").value
  );
};

mortalityRateFortiesInput.onchange = function () {
  mortalityRateForties = parseFloat(
    document.querySelector("#mortality-rate-forties").value
  );
};

mortalityRateFiftiesInput.onchange = function () {
  mortalityRateFifties = parseFloat(
    document.querySelector("#mortality-rate-fifties").value
  );
};

mortalityRateSixtiesInput.onchange = function () {
  mortalityRateSixties = parseFloat(
    document.querySelector("#mortality-rate-sixties").value
  );
};

mortalityRateSeventiesInput.onchange = function () {
  mortalityRateSeventies = parseFloat(
    document.querySelector("#mortality-rate-seventies").value
  );
};

mortalityRateEightiesInput.onchange = function () {
  mortalityRateEighties = parseFloat(
    document.querySelector("#mortality-rate-eighties").value
  );
};

startSimBtn.addEventListener("click", () => {
  popDistByAgeArrCorrected = [];

  zeroesCorrected = new AgeGroup(0.087, 1, 9, mortalityRateZeroes);
  tensCorrected = new AgeGroup(0.1037, 10, 19, mortalityRateTens);
  twentiesCorrected = new AgeGroup(0.1056, 20, 29, mortalityRateTwenties);
  thirtiesCorrected = new AgeGroup(0.1243, 30, 39, mortalityRateThirties);
  fortiesCorrected = new AgeGroup(0.15, 40, 49, mortalityRateForties);
  fiftiesCorrected = new AgeGroup(0.1436, 50, 59, mortalityRateFifties);
  sixtiesCorrected = new AgeGroup(0.1247, 60, 69, mortalityRateSixties);
  seventiesCorrected = new AgeGroup(0.092, 70, 79, mortalityRateSeventies);
  eightiesPlusCorrected = new AgeGroup(0.063, 80, 89, mortalityRateEighties);

  popDistByAgeArrCorrected.push(zeroesCorrected);
  popDistByAgeArrCorrected.push(tensCorrected);
  popDistByAgeArrCorrected.push(twentiesCorrected);
  popDistByAgeArrCorrected.push(thirtiesCorrected);
  popDistByAgeArrCorrected.push(fortiesCorrected);
  popDistByAgeArrCorrected.push(fiftiesCorrected);
  popDistByAgeArrCorrected.push(sixtiesCorrected);
  popDistByAgeArrCorrected.push(seventiesCorrected);
  popDistByAgeArrCorrected.push(eightiesPlusCorrected);

  console.log(popDistByAgeArrCorrected);

  if (!startSimBtn.classList.contains("clicked")) {
    startSimBtn.innerText = "Restart Simulation with new values";

    chart = createChart();
    myTimer.toggleTimer("start");

    //For each age group, spawn as many agents as represented by the age group variable
    popDistByAgeArr.forEach((ageGroup) => {
      for (let i = 0; i < ageGroup.population; i++) {
        quadtreeRoot.population.push(
          (tempAgent = new Agent(
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
            quadtreeRoot,
            ageGroup.getAge(ageGroup.minAge, ageGroup.maxAge),
            ageGroup.mortalityRate
          ))
        );

        numberOfAgents.push(tempAgent);
      }
    });

    quadtreeRoot.population.forEach((agent) => {
      susceptibleArr.push(agent);
    });

    /** Seed agent */

    quadtreeRoot.population.push(
      (seedAgent = new Agent(
        contagionCanvas.width / 2,
        contagionCanvas.height / 2,
        circleRadius,
        0,
        Math.PI * 2,
        false,
        quadtreeRoot
      ))
    );

    seedAgent.vX = 0;
    seedAgent.vY = 0;

    numberOfAgents.push(seedAgent);
    seedAgent.isContaminated = true;
    seedAgent.isSusceptible = false;
    contaminatedArr.push(seedAgent);
    seedAgent.startAgentTimers();

    // console.log(`Agents in original context: ${numberOfAgents.length};
    // Agents in corrected context: ${numberOfAgentsCorrected.length}`);

    // Corrected canvas

    popDistByAgeArrCorrected.forEach((ageGroup) => {
      for (let i = 0; i < ageGroup.populationCorrected; i++) {
        quadtreeRootCorrected.population.push(
          (tempAgentCorrected = new AgentCorrected(
            Math.round(
              Math.random() *
                (contagionCanvasCorrected.width - circleRadius * 2) +
                circleRadius
            ),
            Math.round(
              Math.random() *
                (contagionCanvasCorrected.height - circleRadius * 2) +
                circleRadius
            ),
            circleRadius,
            0,
            Math.PI * 2,
            false,
            quadtreeRootCorrected,
            ageGroup.getAge(ageGroup.minAge, ageGroup.maxAge),
            ageGroup.mortalityRate
          ))
        );
        console.log(ageGroup.mortalityRate);
        numberOfAgentsCorrected.push(tempAgentCorrected);
      }
    });
    quadtreeRootCorrected.population.forEach((agent) => {
      susceptibleArrCorrected.push(agent);
    });
    // console.log(`Agents corrected: ${numberOfAgentsCorrected.length}`);
    // console.log(`Agents array corrected: ${susceptibleArrCorrected.length}`);

    /** Seed agent */

    quadtreeRootCorrected.population.push(
      (seedAgentCorrected = new AgentCorrected(
        contagionCanvasCorrected.width / 2,
        contagionCanvasCorrected.height / 2,
        circleRadius,
        0,
        Math.PI * 2,
        false,
        quadtreeRootCorrected
      ))
    );

    seedAgentCorrected.vX = 0;
    seedAgentCorrected.vY = 0;

    numberOfAgentsCorrected.push(seedAgentCorrected);
    seedAgentCorrected.isContaminated = true;
    seedAgentCorrected.isSusceptible = false;
    contaminatedArrCorrected.push(seedAgentCorrected);
    seedAgentCorrected.startAgentTimers();

    console.log(`Agents in original context: ${numberOfAgents.length};
    Agents in corrected context: ${numberOfAgentsCorrected.length}`);

    startSimBtn.classList.toggle("clicked");
    popDistByAgeArrCorrected.forEach((ageGroup) => {
      console.log(ageGroup.mortalityRate);
    });
  } else {
    popDistByAgeArrCorrected.forEach((ageGroup) => {
      console.log(ageGroup.mortalityRate);
      console.log(ageGroup.totalPopPercent);
    });

    numberOfAgents.forEach((agent) => {
      clearTimeout(agent.infectedInterval);
      clearTimeout(agent.removedInterval);
      clearTimeout(agent.washHandsDelay);
    });

    numberOfAgentsCorrected.forEach((agent) => {
      clearTimeout(agent.infectedInterval);
      clearTimeout(agent.removedInterval);
      clearTimeout(agent.washHandsDelay);
    });

    clearTimeout(myTimer.interval);

    // CLEAR ALL THE THINGS!!! DELETE ALL THE DATA!!! KILL ALL THE TIMERS!!!

    agentsWhoWashedHands = 0;

    numberOfTimesteps = 0;

    quadTreeArray = [];
    quadTreeArrayNotDivided = [];
    susceptibleArr = [];
    contaminatedArr = [];
    infectedArr = [];
    removedArr = [];
    deceasedArr = [];
    numberOfAgents = [];

    quadTreeArrayCorrected = [];
    quadTreeArrayNotDividedCorrected = [];
    susceptibleArrCorrected = [];
    contaminatedArrCorrected = [];
    infectedArrCorrected = [];
    removedArrCorrected = [];
    deceasedArrCorrected = [];
    numberOfAgentsCorrected = [];
    popDistByAgeArrCorrected = [];

    newContaminated = 0;
    previousContaminated = 0;
    averageContaminationsPerAgent = 0;
    newInfected = 0;
    previousInfected = 0;
    newContaminatedCorrected = 0;
    previousContaminatedCorrected = 0;
    averageContaminationsPerAgentCorrected = 0;
    newInfectedCorrected = 0;
    previousInfectedCorrected = 0;

    chartLabels = 0;

    chart.data.datasets.forEach((dataset) => {
      dataset.data = [];
    });

    // Repopulate corrected age group array with updated input values

    zeroesCorrected = new AgeGroup(0.087, 1, 9, mortalityRateZeroes);
    tensCorrected = new AgeGroup(0.1037, 10, 19, mortalityRateTens);
    twentiesCorrected = new AgeGroup(0.1056, 20, 29, mortalityRateTwenties);
    thirtiesCorrected = new AgeGroup(0.1243, 30, 39, mortalityRateThirties);
    fortiesCorrected = new AgeGroup(0.15, 40, 49, mortalityRateForties);
    fiftiesCorrected = new AgeGroup(0.1436, 50, 59, mortalityRateFifties);
    sixtiesCorrected = new AgeGroup(0.1247, 60, 69, mortalityRateSixties);
    seventiesCorrected = new AgeGroup(0.092, 70, 79, mortalityRateSeventies);
    eightiesPlusCorrected = new AgeGroup(0.063, 80, 89, mortalityRateEighties);

    popDistByAgeArrCorrected.push(zeroesCorrected);
    popDistByAgeArrCorrected.push(tensCorrected);
    popDistByAgeArrCorrected.push(twentiesCorrected);
    popDistByAgeArrCorrected.push(thirtiesCorrected);
    popDistByAgeArrCorrected.push(fortiesCorrected);
    popDistByAgeArrCorrected.push(fiftiesCorrected);
    popDistByAgeArrCorrected.push(sixtiesCorrected);
    popDistByAgeArrCorrected.push(seventiesCorrected);
    popDistByAgeArrCorrected.push(eightiesPlusCorrected);

    //For each age group, spawn as many agents as represented by the age group variable

    spawnDefaultAgents();

    // Corrected canvas

    console.log(`${spawnAgentsCorrected}`);
    spawnCorrectedAgents();
    console.log(`${spawnAgentsCorrected}`);

    chart = createChart();
    myTimer.toggleTimer("start");
  }
});

/** ========================== Utility functions ========================== */

// Spawn agents for default canvas

spawnDefaultAgents = function () {
  popDistByAgeArr.forEach((ageGroup) => {
    for (let i = 0; i < ageGroup.population; i++) {
      quadtreeRoot.population.push(
        (tempAgent = new Agent(
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
          quadtreeRoot,
          ageGroup.getAge(ageGroup.minAge, ageGroup.maxAge),
          ageGroup.mortalityRate
        ))
      );
      numberOfAgents.push(tempAgent);
    }
  });

  quadtreeRoot.population.forEach((agent) => {
    susceptibleArr.push(agent);
  });

  console.log(`Agents: ${numberOfAgents.length}`);

  /** Seed agent */

  quadtreeRoot.population.push(
    (seedAgent = new Agent(
      contagionCanvas.width / 2,
      contagionCanvas.height / 2,
      circleRadius,
      0,
      Math.PI * 2,
      false,
      quadtreeRoot
    ))
  );

  seedAgent.vX = 0;
  seedAgent.vY = 0;

  numberOfAgents.push(seedAgent);
  seedAgent.isContaminated = true;
  seedAgent.isSusceptible = false;
  contaminatedArr.push(seedAgent);
  seedAgent.startAgentTimers();

  console.log(`Agents in original context: ${numberOfAgents.length};
  Agents in corrected context: ${numberOfAgentsCorrected.length}`);
};

// Spawn agents for corrected canvas

spawnCorrectedAgents = function () {
  popDistByAgeArrCorrected.forEach((ageGroup) => {
    //Update corrected population
    ageGroup.populationCorrected = ageGroup.getPopulationCorrected(
      ageGroup.totalPopPercent
    );

    for (let i = 0; i < ageGroup.populationCorrected; i++) {
      quadtreeRootCorrected.population.push(
        (tempAgentCorrected = new AgentCorrected(
          Math.round(
            Math.random() *
              (contagionCanvasCorrected.width - circleRadius * 2) +
              circleRadius
          ),
          Math.round(
            Math.random() *
              (contagionCanvasCorrected.height - circleRadius * 2) +
              circleRadius
          ),
          circleRadius,
          0,
          Math.PI * 2,
          false,
          quadtreeRootCorrected,
          ageGroup.getAge(ageGroup.minAge, ageGroup.maxAge),
          ageGroup.mortalityRate
        ))
      );

      numberOfAgentsCorrected.push(tempAgentCorrected);
    }
  });
  quadtreeRootCorrected.population.forEach((agent) => {
    susceptibleArrCorrected.push(agent);
  });
  // console.log(`Agents corrected: ${numberOfAgentsCorrected.length}`);
  // console.log(`Agents array corrected: ${susceptibleArrCorrected.length}`);

  /** Seed agent */

  quadtreeRootCorrected.population.push(
    (seedAgentCorrected = new AgentCorrected(
      contagionCanvasCorrected.width / 2,
      contagionCanvasCorrected.height / 2,
      circleRadius,
      0,
      Math.PI * 2,
      false,
      quadtreeRootCorrected
    ))
  );

  seedAgentCorrected.vX = 0;
  seedAgentCorrected.vY = 0;

  numberOfAgentsCorrected.push(seedAgentCorrected);
  seedAgentCorrected.isContaminated = true;
  seedAgentCorrected.isSusceptible = false;
  contaminatedArrCorrected.push(seedAgentCorrected);
  seedAgentCorrected.startAgentTimers();

  console.log(`Agents in original context: ${numberOfAgents.length};
  Agents in corrected context: ${numberOfAgentsCorrected.length}`);
};

createChart = function () {
  chart.destroy();
  chart = new Chart(ctxChart, {
    // The type of chart we want to create
    type: "line",

    // The data for our dataset
    data: {
      labels: [],
      datasets: [
        {
          /** [0] */
          label: "Total susceptible",
          hidden: true,
          borderColor: "rgb(0, 255, 255)",
          data: [],
        },
        {
          /** [1] */
          label: "Total contaminated",
          hidden: true,
          borderColor: "rgb(255, 185, 0)",
          data: [],
        },
        {
          /** [2] */
          label: "New contaminated",
          hidden: true,
          borderColor: "rgb(255, 255, 50)",
          data: [],
        },
        {
          /** [3] */
          label: "Total infected",
          hidden: true,
          borderColor: "rgb(255, 0, 0)",
          data: [],
        },
        {
          /** [4] */
          label: "New infected",
          borderColor: "rgb(255, 115, 0)",
          data: [],
        },
        {
          /** [5] */
          label: "Total removed",
          hidden: true,
          borderColor: "rgb(190, 190, 190)",
          data: [],
        },
        {
          /** [6] */
          label: "Total deceased",
          borderColor: "rgb(190, 0, 0)",
          data: [],
        },
        {
          /** [7] */
          label: "Total infected alt.",
          hidden: true,
          borderColor: "rgb(100, 150, 125)",
          data: [],
        },
        {
          /** [8] */
          label: "New infected alt.",
          borderColor: "rgb(0, 200, 120)",
          data: [],
        },
        {
          /** [9] */
          label: "Total removed alt.",
          hidden: true,
          borderColor: "rgb(100, 100, 100)",
          data: [],
        },
        {
          /** [10] */
          label: "Total deceased alt.",
          borderColor: "rgb(190, 0, 130)",
          data: [],
        },
        {
          /** [11] */
          label: "Total susceptible alt.",
          hidden: true,
          borderColor: "rgb(235, 235, 0)",
          data: [],
        },
        {
          /** [12] */
          label: "Total contaminated alt.",
          hidden: true,
          borderColor: "rgb(150, 80, 0)",
          data: [],
        },
        {
          /** [13] */
          label: "New contaminated alt.",
          hidden: true,
          borderColor: "rgb(10,10,10)",
          data: [],
        },
      ],
    },

    // Configuration options go here
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        labels: {
          fontSize: 14,
        },
      },
    },
  });
  return chart;
};

/** ========================== Chart vars and functions ========================== */

let chartLabels = 0;

let newContaminated = 0;
let previousContaminated = 0;
let averageContaminationsPerAgent = 0;

let newInfected = 0;
let previousInfected = 0;

let newContaminatedCorrected = 0;
let previousContaminatedCorrected = 0;
let averageContaminationsPerAgentCorrected = 0;

let newInfectedCorrected = 0;
let previousInfectedCorrected = 0;

let getChartableData = function (string) {
  switch (string) {
    case "labels":
      chartLabels++;
      return chartLabels;
    case "new contaminated":
      newContaminated = 0;
      newContaminated = contaminatedArr.length - previousContaminated;
      agentsWhoWashedHands = 0;
      if (newContaminated < 0) {
        newContaminated = 0;
      }
      return newContaminated.toFixed(5);
    case "new infected":
      newInfected = 0;
      newInfected =
        chart.data.datasets[3].data[chart.data.datasets[3].data.length - 1] -
        previousInfected;
      if (newInfected < 0) {
        newInfected = 0;
      }
      return newInfected.toFixed(5);
    case "new infected corrected":
      newInfectedCorrected = 0;
      newInfectedCorrected =
        chart.data.datasets[7].data[chart.data.datasets[7].data.length - 1] -
        previousInfectedCorrected;
      if (newInfectedCorrected < 0) {
        newInfectedCorrected = 0;
      }
      return newInfectedCorrected.toFixed(5);
    case "new contaminated corrected":
      newContaminatedCorrected = 0;
      newContaminatedCorrected =
        contaminatedArrCorrected.length - previousContaminatedCorrected;
      if (newContaminatedCorrected < 0) {
        newContaminatedCorrected = 0;
      }
      return newContaminatedCorrected.toFixed(5);
  }
};

storePreviousInfected = function () {
  if (chart.data.datasets[4].data.length < 2) {
    previousInfected = 0;
  } else {
    previousInfected =
      chart.data.datasets[3].data[chart.data.datasets[3].data.length - 2];
  }
};

storePreviousInfectedCorrected = function () {
  if (chart.data.datasets[8].data.length < 2) {
    previousInfectedCorrected = 0;
  } else {
    previousInfectedCorrected =
      chart.data.datasets[7].data[chart.data.datasets[7].data.length - 2];
  }
};

addGeneralLabels = function (chart, label) {
  chart.data.labels.push(label);
};

addTotalSusceptible = function (chart, susceptible) {
  chart.data.datasets[0].data.push(
    ((susceptible * 100) / spawnAgents).toFixed(5)
  );
};

addTotalContaminated = function (chart, contaminated) {
  chart.data.datasets[1].data.push(
    ((contaminated * 100) / spawnAgents).toFixed(5)
  );
};

addTotalInfected = function (chart, infected) {
  chart.data.datasets[3].data.push(((infected * 100) / spawnAgents).toFixed(5));
};

addNewInfected = function (chart, infected) {
  chart.data.datasets[4].data.push(infected);
};

addTotalRemoved = function (chart, removed) {
  chart.data.datasets[5].data.push(((removed * 100) / spawnAgents).toFixed(5));
};

addTotalDeceased = function (chart, deceased) {
  chart.data.datasets[6].data.push(((deceased * 100) / spawnAgents).toFixed(5));
};

addNewContaminated = function (chart, contaminated) {
  chart.data.datasets[2].data.push((contaminated * 100) / spawnAgents);
};

addTotalInfectedCorrected = function (chart, infected) {
  chart.data.datasets[7].data.push(
    ((infected * 100) / spawnAgentsCorrected).toFixed(5)
  );
};

addNewInfectedCorrected = function (chart, infected) {
  chart.data.datasets[8].data.push(infected);
};

addTotalRemovedCorrected = function (chart, removed) {
  chart.data.datasets[9].data.push(
    ((removed * 100) / spawnAgentsCorrected).toFixed(5)
  );
};

addTotalDeceasedCorrected = function (chart, deceased) {
  chart.data.datasets[10].data.push(
    ((deceased * 100) / spawnAgentsCorrected).toFixed(5)
  );
};

addTotalSusceptibleCorrected = function (chart, susceptible) {
  chart.data.datasets[11].data.push(
    ((susceptible * 100) / spawnAgentsCorrected).toFixed(5)
  );
};

addTotalContaminatedCorrected = function (chart, contaminated) {
  chart.data.datasets[12].data.push(
    ((contaminated * 100) / spawnAgentsCorrected).toFixed(5)
  );
};

addNewContaminatedCorrected = function (chart, contaminated) {
  chart.data.datasets[13].data.push(
    (contaminated * 100) / spawnAgentsCorrected
  );
};

/** ========================== Age groups ==========================*/

// Number of agents by population percentage (Pordata data)

class AgeGroup {
  constructor(totalPopPercent, minAge, maxAge, mortalityRate) {
    this.minAge = minAge;
    this.maxAge = maxAge;
    this.mortalityRate = mortalityRate;
    this.totalPopPercent = totalPopPercent;
    this.population = this.getPopulation(totalPopPercent);
    this.populationCorrected = this.getPopulationCorrected(totalPopPercent);
    this.age = this.getAge(minAge, maxAge);
  }

  getAge = function (minAge, maxAge) {
    return Math.round(Math.random() * (maxAge - minAge) + minAge);
  };

  // Get number of people within this age group
  getPopulation = function (percentage) {
    return Math.round(spawnAgents * percentage);
  };

  // Get corrected number of people within this age group
  getPopulationCorrected = function (percentage) {
    return Math.round(spawnAgentsCorrected * percentage);
  };
}

// Percentage of total population that fits in this age group, minimum age, maximum age for this group, mortality rate (Data from Pordata and the Health General Directorate)

let zeroes = new AgeGroup(0.087, 1, 9, 0);
let tens = new AgeGroup(0.1037, 10, 19, 0);
let twenties = new AgeGroup(0.1056, 20, 29, 0);
let thirties = new AgeGroup(0.1243, 30, 39, 0);
let forties = new AgeGroup(0.15, 40, 49, 0.12);
let fifties = new AgeGroup(0.1436, 50, 59, 0.49);
let sixties = new AgeGroup(0.1247, 60, 69, 1.46);
let seventies = new AgeGroup(0.092, 70, 79, 5.04);
let eightiesPlus = new AgeGroup(0.063, 80, 89, 12.63);

let popDistByAgeArr = [
  zeroes,
  tens,
  twenties,
  thirties,
  forties,
  fifties,
  sixties,
  seventies,
  eightiesPlus,
];

zeroesCorrected = new AgeGroup(0.087, 1, 9, mortalityRateZeroes);
//popDistByAgeCorrectedArr.push(zeroes);
tensCorrected = new AgeGroup(0.1037, 10, 19, mortalityRateTens);
//popDistByAgeCorrectedArr.push(tens);
twentiesCorrected = new AgeGroup(0.1056, 20, 29, mortalityRateTwenties);
//popDistByAgeCorrectedArr.push(twenties);
thirtiesCorrected = new AgeGroup(0.1243, 30, 39, mortalityRateThirties);
//popDistByAgeCorrectedArr.push(thirties);
fortiesCorrected = new AgeGroup(0.15, 40, 49, mortalityRateForties);
//popDistByAgeCorrectedArr.push(forties);
fiftiesCorrected = new AgeGroup(0.1436, 50, 59, mortalityRateFifties);
//popDistByAgeCorrectedArr.push(fifties);
sixtiesCorrected = new AgeGroup(0.1247, 60, 69, mortalityRateSixties);
//popDistByAgeCorrectedArr.push(sixties);
seventiesCorrected = new AgeGroup(0.092, 70, 79, mortalityRateSeventies);
//popDistByAgeCorrectedArr.push(seventies);
eightiesPlusCorrected = new AgeGroup(0.063, 80, 89, mortalityRateEighties);
//popDistByAgeCorrectedArr.push(eightiesPlus);

let popDistByAgeArrCorrected = [
  zeroesCorrected,
  tensCorrected,
  twentiesCorrected,
  thirtiesCorrected,
  fortiesCorrected,
  fiftiesCorrected,
  sixtiesCorrected,
  seventiesCorrected,
  eightiesPlusCorrected,
];

/** ========================== Timer for chart update ========================== */

class Timer {
  constructor(updateInterval) {
    this.startTime = this.getTime();
    this.timeFromStart = this.getTime() - this.startTime;
    this.updateInterval = updateInterval;
    this.remainingTime = this.updateInterval;
  }

  getTime = function () {
    return new Date().getTime();
  };

  updateStartTime = function () {
    this.startTime = this.getTime();
  };

  updateTimeFromStart = function () {
    this.timeFromStart = this.getTime() - this.startTime;
  };

  updateRemainingTime = function () {
    this.remainingTime = this.updateInterval - this.timeFromStart;
  };

  resetRemainingTime = function () {
    this.remainingTime = this.updateInterval;
  };

  setTimer = function (string) {
    if (string === "start") {
      this.updateStartTime();
      this.toggleTimer(string);
      this.resetRemainingTime();
    } else {
      this.toggleTimer(string);
    }
  };

  toggleTimer(string) {
    switch (string) {
      case "start":
        {
          //console.log(`TIMESTEP: ${chartLabels}`);
          this.interval = setTimeout(() => {
            this.updateStartTime();
            this.performAction();
            this.toggleTimer("start");
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

  performAction = function () {
    numberOfTimesteps++;

    /** ========== HACKERMAN SAFETY MEASURE ==========
     * If total susceptible is 0 and total infected + total removed = total population, then everyone is either infected or removed. Stop pushing new elements into chart array. No more slow downs.
     */

    /** Make simulation stop when there's no more chance of infection */

    if (
      /** Total contaminated (includes infected) is zero and total removed is more than one and there have been no deaths for 30 updates
       * If both simulations meet the criteria, stop updating chart
       * Watch out for removed and contaminated indexes on the corrected arrays. They're switched around compared to the default ones
       */

      !(
        chart.data.datasets[1].data[chart.data.datasets[1].data.length - 1] ==
          0 &&
        chart.data.datasets[5].data[chart.data.datasets[5].data.length - 1] >
          0 &&
        chart.data.datasets[9].data[chart.data.datasets[9].data.length - 1] >
          0 &&
        chart.data.datasets[12].data[chart.data.datasets[12].data.length - 1] ==
          0 &&
        chart.data.datasets[6].data[chart.data.datasets[6].data.length - 1] ==
          chart.data.datasets[6].data[
            chart.data.datasets[6].data.length - 30
          ] &&
        chart.data.datasets[10].data[chart.data.datasets[6].data.length - 1] ==
          chart.data.datasets[10].data[chart.data.datasets[6].data.length - 10]
      )
    ) {
      storePreviousInfected();

      storePreviousInfectedCorrected();
      addGeneralLabels(chart, getChartableData("labels"));
      addTotalSusceptible(chart, susceptibleArr.length);

      addNewContaminated(chart, getChartableData("new contaminated"));

      addTotalContaminated(chart, contaminatedArr.length);

      addNewInfected(chart, getChartableData("new infected"));

      addTotalInfected(chart, infectedArr.length);
      addTotalRemoved(chart, removedArr.length);
      addTotalDeceased(chart, deceasedArr.length);

      addNewInfectedCorrected(
        chart,
        getChartableData("new infected corrected")
      );

      addTotalInfectedCorrected(chart, infectedArrCorrected.length);
      addTotalRemovedCorrected(chart, removedArrCorrected.length);
      addTotalDeceasedCorrected(chart, deceasedArrCorrected.length);
      addTotalSusceptibleCorrected(chart, susceptibleArrCorrected.length);
      addTotalContaminatedCorrected(chart, contaminatedArrCorrected.length);

      addNewContaminatedCorrected(
        chart,
        getChartableData("new contaminated corrected")
      );

      totalContaminations = 0;
      totalContaminationsCorrected = 0;

      numberOfAgents.forEach((agent) => {
        totalContaminations += agent.contaminatedOthers;
      });
      numberOfAgentsCorrected.forEach((agent) => {
        totalContaminationsCorrected += agent.contaminatedOthers;
      });

      averageContaminationsPerAgent =
        totalContaminations / numberOfAgents.length;

      averageContaminationsPerAgentCorrected =
        totalContaminationsCorrected / numberOfAgentsCorrected.length;

      /*avgContaminations.innerText = `${averageContaminationsPerAgent.toFixed(
        2
      )}`;
      avgContaminationsAlt.innerText = `${averageContaminationsPerAgentCorrected.toFixed(
        2
      )}`;*/

      previousContaminated = contaminatedArr.length;
      previousInfected = infectedArr.length;
      previousContaminatedCorrected = contaminatedArrCorrected.length;
      previousInfectedCorrected = infectedArrCorrected.length;

      chart.update();
    }
  };
}

myTimer = new Timer(timestep);

/** ========================== Pause feature for main draw() and chart timer ========================== */

// const pauseButton = document.querySelector("#pause");
// pauseButton.addEventListener("click", () => {
//   pauseButton.classList.toggle("paused");

//   if (!pauseButton.classList.contains("paused")) {
//     myTimer.setTimer("start");
//     draw();
//   } else {
//     myTimer.toggleTimer("stop");
//   }
// });

/** ========================== Quadtree class ========================== */

class Quadtree {
  constructor(x, y, w, h, parent, name) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;

    this.population = [];
    this.populationCap = quadtreeMaxPop;
    this.isDivided = false;
    this.name = name;
    this.isNeighbor;

    this.parent = parent;
    this.northwest = null;
    this.northeast = null;
    this.southwest = null;
    this.southeast = null;
  }

  insertAgent = function (agent) {
    this.population.push(agent);
  };

  update = function () {
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

      quadTreeArray.push(
        this.northwest,
        this.northeast,
        this.southwest,
        this.southeast
      );

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
        } else {
          console.log(`MESSED UP POPULATION SHIFT IN QUADTREES`);
        }
      }

      this.northwest.update();
      this.northeast.update();
      this.southwest.update();
      this.southeast.update();
    }
  };

  draw = function () {
    ctx.strokeStyle = "rgba(0,255,0,1)";
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.lineWidth = 1;
  };
}

/** Instantiate quadtree roots */

quadtreeRoot = new Quadtree(
  0,
  0,
  contagionCanvas.width,
  contagionCanvas.height,
  null,
  "root"
);
quadTreeArray.push(quadtreeRoot);

class QuadtreeCorrected {
  constructor(x, y, w, h, parent, name) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;

    this.population = [];
    this.populationCap = quadtreeMaxPop;
    this.isDivided = false;
    this.name = name;
    this.isNeighbor;

    this.parent = parent;
    this.northwest = null;
    this.northeast = null;
    this.southwest = null;
    this.southeast = null;
  }

  insertAgent = function (agent) {
    this.population.push(agent);
  };

  update = function () {
    if (this.population.length >= this.populationCap) {
      // console.log("Dividing tree and deleting agents from parent")
      this.isDivided = true;

      this.northwest = new QuadtreeCorrected(
        this.x,
        this.y,
        this.width / 2,
        this.height / 2,
        this,
        "norhtwest"
      );
      this.northeast = new QuadtreeCorrected(
        this.x + this.width / 2,
        this.y,
        this.width / 2,
        this.height / 2,
        this,
        "northeast"
      );
      this.southwest = new QuadtreeCorrected(
        this.x,
        this.y + this.height / 2,
        this.width / 2,
        this.height / 2,
        this,
        "southwest"
      );
      this.southeast = new QuadtreeCorrected(
        this.x + this.width / 2,
        this.y + this.height / 2,
        this.width / 2,
        this.height / 2,
        this,
        "southeast"
      );

      quadTreeArrayCorrected.push(
        this.northwest,
        this.northeast,
        this.southwest,
        this.southeast
      );

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
        } else {
          console.log(`MESSED UP POPULATION SHIFT IN QUADTREES`);
        }
      }

      this.northwest.update();
      this.northeast.update();
      this.southwest.update();
      this.southeast.update();
    }
  };

  draw = function () {
    ctxCorrected.strokeStyle = "rgba(0,255,0,1)";
    ctxCorrected.strokeRect(this.x, this.y, this.width, this.height);
    ctxCorrected.lineWidth = 1;
  };
}

quadtreeRootCorrected = new QuadtreeCorrected(
  0,
  0,
  contagionCanvasCorrected.width,
  contagionCanvasCorrected.height,
  null,
  "rootCorrected"
);
quadTreeArrayCorrected.push(quadtreeRootCorrected);

/** ========================== Agent class ========================== */

class Agent {
  constructor(
    x,
    y,
    radius,
    startAngle,
    endAngle,
    cc,
    parentQuadtree,
    age,
    mortalityRate
  ) {
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
    this.isContaminated = false;
    this.isInfected = false;
    this.isRemoved = false;
    this.isDead = false;
    this.age = age;
    this.mortalityRate = mortalityRate;
    this.contaminatedOthers = 0;

    // this.removedTimeFromStart = 0;
    // this.removedStartTime;
    // this.remainingTimeRemoved = timeUntilRemoved;

    // this.infectedTimeFromStart = 0;
    // this.infectedStartTime;
    // this.remainingTimeInfected = timeUntilInfected;
    // this.infectedInterval;

    // this.washHandsTimeFromStart = 0;
    // this.washHandsStartTime;
    // this.remainingTimeWashHands = timeUntilWashHands;
    // this.washHandsInterval;

    this.neighbors = [];
    this.neighboringQuadtrees = [];
  }

  getNeighbors = function () {
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
      quadTreeArrayNotDivided.forEach((quadtree) => {
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

      this.neighboringQuadtrees.forEach((quadtreeNeighbor) => {
        quadtreeNeighbor.population.forEach((agent) => {
          const distX = agent.x - this.x;
          const distY = agent.y - this.y;
          const radii = agent.radius + this.radius;

          if (agent != this) {
            this.neighbors.push(agent);

            /** Check collision */

            if (
              (agent.isContaminated || agent.isRemoved) &&
              (this.isContaminated || this.isRemoved)
            ) {
              return;
            } else {
              if (distX * distX + distY * distY < radii * radii) {
                if (agent.isSusceptible && this.isContaminated) {
                  agent.isContaminated = true;
                  agent.isSusceptible = false;
                  agent.startAgentTimers();

                  this.contaminatedOthers++;

                  const i = susceptibleArr.indexOf(agent);
                  contaminatedArr.push(agent);
                  susceptibleArr.splice(i, 1);
                }
                if (this.isSusceptible && agent.isContaminated) {
                  this.isContaminated = true;
                  this.isSusceptible = false;
                  this.startAgentTimers();

                  agent.contaminatedOthers++;

                  const i = susceptibleArr.indexOf(this);
                  contaminatedArr.push(this);
                  susceptibleArr.splice(i, 1);
                }
              }
            }
          }
        });
      });
    } else {
      this.parentQuadtree.population.forEach((agent) => {
        const distX = agent.x - this.x;
        const distY = agent.y - this.y;
        const radii = agent.radius + this.radius;

        if (agent != this) {
          this.neighbors.push(agent);

          /** Check collision */

          if (
            (agent.isContaminated || agent.isRemoved) &&
            (this.isContaminated || this.isRemoved)
          ) {
            return;
          } else {
            if (distX * distX + distY * distY < radii * radii) {
              if (agent.isSusceptible && this.isContaminated) {
                agent.isContaminated = true;
                agent.isSusceptible = false;
                agent.startAgentTimers();

                this.contaminatedOthers++;

                const i = susceptibleArr.indexOf(agent);
                contaminatedArr.push(agent);
                susceptibleArr.splice(i, 1);
              }
              if (this.isSusceptible && agent.isContaminated) {
                this.isContaminated = true;
                this.isSusceptible = false;
                this.startAgentTimers();

                agent.contaminatedOthers++;

                const i = susceptibleArr.indexOf(this);
                contaminatedArr.push(this);
                susceptibleArr.splice(i, 1);
              }
            }
          }
        }
      });
    }
    return this.neighbors;
  };

  removeAgent = function () {
    this.isRemoved = true;
    removedArr.push(this);
    this.isContaminated = false;
    contaminatedArr.splice(contaminatedArr.indexOf(this), 1);
    this.isInfected = false;
    infectedArr.splice(infectedArr.indexOf(this), 1);

    if (Math.random() < this.mortalityRate / 100) {
      this.isDead = true;

      deceasedArr.push(this);

      delete this.x;
      delete this.y;
      delete this.radius;
      delete this.startAngle;
      delete this.endAngle;
      delete this.cc;
      delete this.vX;
      delete this.vY;
      delete this.parentQuadtree;
      delete this.hasNeighboringQuadtree;
      delete this.isSusceptible;
      delete this.susceptibility;
      delete this.isContaminated;
      delete this.isInfected;
      delete this.age;
      delete this.neighbors;
      delete this.neighboringQuadtrees;
    }
  };

  startWashHandsTimer = function () {
    this.startInfectedTimer();
    if (this != seedAgent) {
      if (Math.random() < washHandsProbability) {
        this.washHandsDelay = setTimeout(() => {
          this.isContaminated = false;
          this.isSusceptible = true;
          clearTimeout(this.infectedInterval);
          susceptibleArr.push(this);
          const i = contaminatedArr.indexOf(this);
          contaminatedArr.splice(i, 1);
          agentsWhoWashedHands++;
        }, timeUntilWashHands);
      }
    }
  };

  startInfectedTimer = function () {
    this.infectedInterval = setTimeout(() => {
      this.isInfected = true;
      infectedArr.push(this);
      this.startRemovedTimer();
    }, timeUntilInfected);
  };

  startRemovedTimer = function () {
    this.removedInterval = setTimeout(() => {
      this.removeAgent();
    }, timeUntilRemoved);
  };

  startAgentTimers = function () {
    this.startWashHandsTimer();
  };

  draw = function () {
    if (this.isDead) {
      return;
    } else if (this.isContaminated && !this.isInfected) {
      ctx.beginPath();
      ctx.arc(
        this.x,
        this.y,
        this.radius,
        this.startAngle,
        this.endAngle,
        this.cc
      );
      ctx.fillStyle = "rgba(255, 255, 0, 1)";
      ctx.fill();
    } else if (this.isInfected) {
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
    } else if (this.isRemoved) {
      ctx.beginPath();
      ctx.arc(
        this.x,
        this.y,
        this.radius,
        this.startAngle,
        this.endAngle,
        this.cc
      );
      ctx.fillStyle = "rgba(75, 75, 75, 1)";
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

  update = function () {
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

/** ========================== Corrected Agent class ========================== */

class AgentCorrected {
  constructor(
    x,
    y,
    radius,
    startAngle,
    endAngle,
    cc,
    parentQuadtree,
    age,
    mortalityRate
  ) {
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
    this.isContaminated = false;
    this.isInfected = false;
    this.isRemoved = false;
    this.isDead = false;
    this.age = age;
    this.mortalityRate = mortalityRate;
    this.contaminatedOthers = 0;

    this.neighbors = [];
    this.neighboringQuadtrees = [];
  }

  getNeighbors = function () {
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
      quadTreeArrayNotDividedCorrected.forEach((quadtree) => {
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

      this.neighboringQuadtrees.forEach((quadtreeNeighbor) => {
        quadtreeNeighbor.population.forEach((agent) => {
          const distX = agent.x - this.x;
          const distY = agent.y - this.y;
          const radii = agent.radius + this.radius;

          if (agent != this) {
            this.neighbors.push(agent);

            /** Check collision */

            if (
              (agent.isContaminated || agent.isRemoved) &&
              (this.isContaminated || this.isRemoved)
            ) {
              return;
            } else {
              if (distX * distX + distY * distY < radii * radii) {
                if (agent.isSusceptible && this.isContaminated) {
                  agent.isContaminated = true;
                  agent.isSusceptible = false;
                  agent.startAgentTimers();

                  this.contaminatedOthers++;

                  const i = susceptibleArrCorrected.indexOf(agent);
                  contaminatedArrCorrected.push(agent);
                  susceptibleArrCorrected.splice(i, 1);
                }
                if (this.isSusceptible && agent.isContaminated) {
                  this.isContaminated = true;
                  this.isSusceptible = false;
                  this.startAgentTimers();

                  agent.contaminatedOthers++;

                  const i = susceptibleArrCorrected.indexOf(this);
                  contaminatedArrCorrected.push(this);
                  susceptibleArrCorrected.splice(i, 1);
                }
              }
            }
          }
        });
      });
    } else {
      this.parentQuadtree.population.forEach((agent) => {
        const distX = agent.x - this.x;
        const distY = agent.y - this.y;
        const radii = agent.radius + this.radius;

        if (agent != this) {
          this.neighbors.push(agent);

          /** Check collision */

          if (
            (agent.isContaminated || agent.isRemoved) &&
            (this.isContaminated || this.isRemoved)
          ) {
            return;
          } else {
            if (distX * distX + distY * distY < radii * radii) {
              if (agent.isSusceptible && this.isContaminated) {
                agent.isContaminated = true;
                agent.isSusceptible = false;
                agent.startAgentTimers();

                this.contaminatedOthers++;

                const i = susceptibleArr.indexOf(agent);
                contaminatedArrCorrected.push(agent);
                susceptibleArrCorrected.splice(i, 1);
              }
              if (this.isSusceptible && agent.isContaminated) {
                this.isContaminated = true;
                this.isSusceptible = false;
                this.startAgentTimers();

                agent.contaminatedOthers++;

                const i = susceptibleArr.indexOf(this);
                contaminatedArrCorrected.push(this);
                susceptibleArrCorrected.splice(i, 1);
              }
            }
          }
        }
      });
    }

    return this.neighbors;
  };

  removeAgent = function () {
    this.isRemoved = true;
    removedArrCorrected.push(this);
    this.isContaminated = false;
    contaminatedArrCorrected.splice(contaminatedArrCorrected.indexOf(this), 1);
    this.isInfected = false;
    infectedArrCorrected.splice(infectedArrCorrected.indexOf(this), 1);

    if (Math.random() < this.mortalityRate / 100) {
      this.isDead = true;

      deceasedArrCorrected.push(this);

      delete this.x;
      delete this.y;
      delete this.radius;
      delete this.startAngle;
      delete this.endAngle;
      delete this.cc;
      delete this.vX;
      delete this.vY;
      delete this.parentQuadtree;
      delete this.hasNeighboringQuadtree;
      delete this.isSusceptible;
      delete this.susceptibility;
      delete this.isContaminated;
      delete this.isInfected;
      delete this.age;
      delete this.neighbors;
      delete this.neighboringQuadtrees;
    }
  };

  startWashHandsTimer = function () {
    this.startInfectedTimer();

    if (this != seedAgentCorrected) {
      if (Math.random() < washHandsProbabilityCorrected) {
        this.washHandsDelay = setTimeout(() => {
          this.isContaminated = false;
          this.isSusceptible = true;
          clearTimeout(this.infectedInterval);
          susceptibleArrCorrected.push(this);
          const i = contaminatedArrCorrected.indexOf(this);
          contaminatedArrCorrected.splice(i, 1);
          agentsWhoWashedHandsCorrected++;
        }, timeUntilWashHandsCorrected);
      }
    }
  };

  startInfectedTimer = function () {
    this.infectedInterval = setTimeout(() => {
      this.isInfected = true;
      infectedArrCorrected.push(this);
      this.startRemovedTimer();
    }, timeUntilInfectedCorrected);
  };

  startRemovedTimer = function () {
    this.removedInterval = setTimeout(() => {
      this.removeAgent();
    }, timeUntilRemovedCorrected);
  };

  startAgentTimers = function () {
    this.startWashHandsTimer();
  };

  draw = function () {
    if (this.isDead) {
      return;
    } else if (this.isContaminated && !this.isInfected) {
      ctxCorrected.beginPath();
      ctxCorrected.arc(
        this.x,
        this.y,
        this.radius,
        this.startAngle,
        this.endAngle,
        this.cc
      );
      ctxCorrected.fillStyle = "rgba(255, 255, 0, 1)";
      ctxCorrected.fill();
    } else if (this.isInfected) {
      ctxCorrected.beginPath();
      ctxCorrected.arc(
        this.x,
        this.y,
        this.radius,
        this.startAngle,
        this.endAngle,
        this.cc
      );
      ctxCorrected.fillStyle = "rgba(255, 0, 0, 1)";
      ctxCorrected.fill();
    } else if (this.isRemoved) {
      ctxCorrected.beginPath();
      ctxCorrected.arc(
        this.x,
        this.y,
        this.radius,
        this.startAngle,
        this.endAngle,
        this.cc
      );
      ctxCorrected.fillStyle = "rgba(75, 75, 75, 1)";
      ctxCorrected.fill();
    } else {
      ctxCorrected.beginPath();
      ctxCorrected.arc(
        this.x,
        this.y,
        this.radius,
        this.startAngle,
        this.endAngle,
        this.cc
      );
      ctxCorrected.fillStyle = "rgba(0, 255, 0, 1)";
      ctxCorrected.fill();
    }
  };

  update = function () {
    if (
      this.x + this.radius > contagionCanvasCorrected.width ||
      this.x - this.radius < 0
    ) {
      this.vX = -this.vX;
    }

    if (
      this.y + this.radius > contagionCanvasCorrected.height ||
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
  ctx.clearRect(0, 0, contagionCanvas.width, contagionCanvas.height);
  ctxCorrected.clearRect(
    0,
    0,
    contagionCanvasCorrected.width,
    contagionCanvasCorrected.height
  );

  quadTreeArray.forEach((quadtree) => {
    const quadtreePopulationLength = quadtree.population.length;

    if (quadtree.population.length > 0) {
      for (let i = 0; i < quadtreePopulationLength; i++) {
        if (!quadtree.population[0].isDead) {
          quadtreeRoot.population.push(quadtree.population[0]);
        }
        quadtree.population.shift();
      }
    }
  });

  quadTreeArrayCorrected.forEach((quadtree) => {
    const quadtreePopulationLength = quadtree.population.length;

    if (quadtree.population.length > 0) {
      for (let i = 0; i < quadtreePopulationLength; i++) {
        if (!quadtree.population[0].isDead) {
          quadtreeRootCorrected.population.push(quadtree.population[0]);
        }
        quadtree.population.shift();
      }
    }
  });

  // console.log(`Clearing quadtree array`)
  quadTreeArray = [];
  quadTreeArrayCorrected = [];
  // console.log(`Pushing root into quadtree array`)
  quadTreeArray.push(quadtreeRoot);
  quadTreeArrayCorrected.push(quadtreeRootCorrected);

  quadtreeRoot.population.forEach((agent) => {
    // console.log("Updating agents from quadtree Root population")
    agent.update();
    agent.draw();
  });

  quadtreeRootCorrected.population.forEach((agent) => {
    // console.log("Updating agents from corrected quadtree Root population")
    agent.update();
    agent.draw();
  });

  // console.log(`Updating root quadtree`)
  quadtreeRoot.update();
  quadTreeArrayNotDivided = [];
  quadtreeRootCorrected.update();
  quadTreeArrayNotDividedCorrected = [];

  quadTreeArray.forEach((quadtree) => {
    //quadtree.draw();
    if (!quadtree.isDivided) {
      quadTreeArrayNotDivided.push(quadtree);
    }
  });

  quadTreeArrayCorrected.forEach((quadtree) => {
    //quadtree.draw();
    if (!quadtree.isDivided) {
      quadTreeArrayNotDividedCorrected.push(quadtree);
    }
  });

  quadTreeArrayNotDivided.forEach((quadtree) => {
    quadtree.population.forEach((agent) => {
      agent.getNeighbors();
      agent.neighbors = [];
      agent.neighboringQuadtrees = [];
    });
  });

  quadTreeArrayNotDividedCorrected.forEach((quadtree) => {
    quadtree.population.forEach((agent) => {
      agent.getNeighbors();
      agent.neighbors = [];
      agent.neighboringQuadtrees = [];
    });
  });

  updateFrames();

  requestAnimationFrame(draw);
}

draw();
