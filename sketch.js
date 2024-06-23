const BOMB_SPEED = 18 // Adjust this value for bomb speed
const DRAG_FACTOR = 0.99 // Adjust this value for drag
const GRAVITY = 0.2 // Adjust this value for gravity
const METEORITE_GRAVITY = 0.01 // Adjust this value for meteorite gravity
const METEORITE_DRAG_FACTOR = 0.99 // Adjust this value for meteorite drag
const EXPLOSION_RADIUS = 50 // Explosion radius, adjust as needed
const EXPLOSION_DURATION = 10 // Duration of the explosion visual effect

const WAVE_MULTIPLIER = 2 // Number of meteorites multiplier

// Game setup
let ballistae = []
let cities = []
let meteorites = []
let bombs = []
let bombers = []

let currentWave = 1
let waveInProgress = false

let score = 0

let lastWaveEndTime = 0 // To track the time since the last wave started
let waitingForNextWave = false // Indicates if we are in the waiting period between waves

let showNewWaveMessage = false
let newWaveMessageDuration = 2000 // 2 seconds in milliseconds
let newWaveMessageStart = 0

let gameState = 'start' // Possible values: 'start', 'playing', 'gameover'

let startButton
let restartButton

let explosionSound
let shootingSound
let backgroundMusic

function preload() {
  explosionSound = loadSound('soundeffects/explosionSound.mp3')
  shootingSound = loadSound('soundeffects/shootingSound.mp3')
  backgroundMusic = loadSound('soundeffects/backgroundMusic.mp3')
}

function setup() {
  createCanvas(800, 600)

  // Start Button (Visible only on the start screen)
  startButton = createButton('Start Game')
  startButton.position(width / 2 - startButton.width / 2, height / 2 + 40)
  startButton.mousePressed(startGame) // Function to start the game
  startButton.hide() // Initially hidden, shown on the start screen

  // Restart Button (Visible only on the gameover screen)
  restartButton = createButton('Restart Game')
  restartButton.position(width / 2 - restartButton.width / 2, height / 2 + 40)
  restartButton.mousePressed(restartGame)
  restartButton.hide()

  // Initialize ballistae
  ballistae.push(new Ballista(createVector(100, height - 50)))
  ballistae.push(new Ballista(createVector(width / 2, height - 50)))
  ballistae.push(new Ballista(createVector(width - 100, height - 50)))

  // Initialize cities
  for (let i = 0; i < 6; i++) {
    cities.push(new City(createVector(145 + i * 100, height - 30)))
  }

  // music and volume
  backgroundMusic.loop()
  backgroundMusic.setVolume(0.03)

  explosionSound.setVolume(0.1)
  shootingSound.setVolume(0.1)
}

function draw() {
  if (gameState === 'start') {
    showStartScreen()
  } else if (gameState === 'playing') {
    // The main game loop
    runGame()
  } else if (gameState === 'gameOver') {
    // Display the game over screen
    showGameOverScreen()
  }
}

function runGame() {
  background(0)

  // Check for showing new wave message
  if (
    showNewWaveMessage &&
    millis() - newWaveMessageStart < newWaveMessageDuration
  ) {
    textSize(32)
    textAlign(CENTER, CENTER)
    fill(255)
    text(`Wave ${currentWave}`, width / 2, height / 2)
  } else {
    showNewWaveMessage = false // Stop showing the message
  }

  // Update and display ballistae
  for (let i = 0; i < ballistae.length; i++) {
    let ballista = ballistae[i]
    ballista.show()

    // Display number of bombs for each Ballista
    fill(255)
    textSize(12)
    textAlign(CENTER, CENTER)
    text(
      'Bombs: ' + ballista.bombs,
      ballista.position.x,
      ballista.position.y - 20
    )
  }

  // Update and display cities
  for (let city of cities) {
    city.show()
  }

  // Update and display meteorites
  for (let i = meteorites.length - 1; i >= 0; i--) {
    let meteorite = meteorites[i]
    meteorite.update()

    // Implement splitting logic while falling down if it's in the top half of the screen
    if (
      !meteorite.isExploded &&
      meteorite.position.y < height / 2 &&
      meteorite.canSplit &&
      random(1) < 0.001 &&
      currentWave > 1
    ) {
      // small chance to split, only if it hasn't exploded and is in the top half

      let angleAdjustment = random(-PI / 6, PI / 6) // Random angle adjustment within a range
      let splitVelocity1 = p5.Vector.fromAngle(
        meteorite.velocity.heading() + angleAdjustment
      ).setMag(meteorite.velocity.mag())
      let splitVelocity2 = p5.Vector.fromAngle(
        meteorite.velocity.heading() - angleAdjustment
      ).setMag(meteorite.velocity.mag())

      // Ensure the split meteorites continue moving downwards by adjusting their y velocity
      splitVelocity1.y = abs(splitVelocity1.y)
      splitVelocity2.y = abs(splitVelocity2.y)

      // Create two new meteorites at the same position with slightly altered velocities
      meteorites.push(
        new Meteorite(meteorite.position.copy(), splitVelocity1, false, 10)
      ) // Prevent further splitting
      meteorites.push(
        new Meteorite(meteorite.position.copy(), splitVelocity2, false, 10)
      )

      // Remove the original meteorite from the array
      meteorites.splice(i, 1)
      continue // Skip the rest of the loop for this meteorite
    }

    if (!meteorite.isExploded) {
      meteorite.show()
    } else {
      // Render the explosion for exploded meteorites
      fill(255, 0, 0)
      ellipse(meteorite.position.x, meteorite.position.y, EXPLOSION_RADIUS * 2)
      // Check for chain reactions
      meteorite.explode()
    }

    // Check for collisions with cities
    for (let city of cities) {
      if (
        !city.isDestroyed &&
        collideCircleRect(
          meteorite.position.x,
          meteorite.position.y,
          10, // The radius should be half of the diameter for the meteorite
          city.position.x,
          city.position.y,
          30, // Width of the city
          30 // Height of the city
        )
      ) {
        city.destroy()
        meteorite.explode()
      }
    }

    // Check for collisions with ballistae
    for (let ballista of ballistae) {
      if (
        !ballista.disabled &&
        collideCircleCircle(
          meteorite.position.x,
          meteorite.position.y,
          20, // Assuming the meteorite has a diameter of 20
          ballista.position.x + 10, // Ballista center x
          ballista.position.y + 10, // Ballista center y
          10 // Assuming the ballista is a square of 20x20
        )
      ) {
        ballista.disabled = true // Disable the ballista
        meteorite.explode() // Explode the meteorite
      }
    }

    // Remove exploded meteorites
    if (meteorite.isExploded) {
      meteorites.splice(i, 1)
    }
  }

  // Get the current wave multiplier
  let multiplier = getWaveMultiplier(currentWave)

  // Update and display bombs
  for (let i = bombs.length - 1; i >= 0; i--) {
    let bomb = bombs[i]
    bomb.update()
    bomb.show()

    // Remove exploded bombs after the explosion effect has finished
    for (let i = bombs.length - 1; i >= 0; i--) {
      if (bombs[i].isExploded && bombs[i].explosionDuration <= 0) {
        bombs.splice(i, 1) // Remove the bomb after its explosion effect is finished
      }
    }

    // Check for collisions with meteorites
    for (let j = meteorites.length - 1; j >= 0; j--) {
      let meteorite = meteorites[j]
      if (
        !meteorite.isExploded &&
        collideCircleCircle(
          bomb.position.x,
          bomb.position.y,
          10,
          meteorite.position.x,
          meteorite.position.y,
          20
        )
      ) {
        bomb.explode()
        meteorite.explode()
        score += 25 * multiplier // Increase score for each meteorite destroyed
      }
    }
  }

  // Update and show bombers
  bombers.forEach((bomber, index) => {
    bomber.update()
    bomber.show()
  })

  // Check if all cities are destroyed
  let allCitiesDestroyed = cities.every((city) => city.isDestroyed)
  if (allCitiesDestroyed) {
    // Handle game over scenario
    gameState = 'gameOver'
  }

  // Check if the wave is over
  if (waveInProgress && meteorites.length === 0) {
    // Calculate bonus points
    let survivingCities = cities.filter((city) => !city.isDestroyed).length
    let unusedBombs = ballistae.reduce(
      (sum, ballista) => sum + ballista.bombs,
      0
    )
    score += (survivingCities * 100 + unusedBombs * 5) * multiplier // Add bonus points based on surviving cities and unused bombs

    // Restore cities based on the score
    restoreCities()

    currentWave++
    startNewWave() // Start a new wave
  }

  // Display Score
  fill(255)
  textSize(16)
  textAlign(LEFT, TOP)
  text('Score: ' + score, 10, 10)

  // Display the wave number in the top right corner
  fill(255) // White color for the text
  textSize(16) // Set the text size
  textAlign(RIGHT, TOP) // Align text to the right and top for positioning
  text('Wave: ' + currentWave, width - 10, 10) // Display the wave number, position it 10 pixels from the top and right edges
}

function startGame() {
  gameState = 'playing'
  startButton.hide() // Hide the start button when the game starts

  // Reset the game to its initial state if needed
  resetGame()

  // Start the first wave with proper timing
  startNewWave() // Ensure this function now correctly initializes the spawn timing
}

function showStartScreen() {
  background(0)
  fill(255)
  textAlign(CENTER, CENTER)
  textSize(32)
  text('Ballista Command', width / 2, height / 2 - 40)
  startButton.show()
}

function showGameOverScreen() {
  // Display the game over screen
  background(0) // Set a dark background
  fill(255, 0, 0) // Set the text color to red
  textSize(32) // Increase the text size for visibility
  textAlign(CENTER, CENTER) // Center the text
  text('GAME OVER', width / 2, height / 2 - 20) // Display "GAME OVER" message
  textSize(24) // Set a smaller text size for the score
  text('Final Score: ' + score, width / 2, height / 2 + 20) // Display the final score
  restartButton.show()
}

function resetGame() {
  // Reset game state
  score = 0
  currentWave = 1
  cities.forEach((city) => (city.isDestroyed = false))
  meteorites = []
  bombs = []
  bombers = []
}

function startNewWave() {
  // Reset the number of bombs for each ballista
  for (let ballista of ballistae) {
    ballista.bombs = 10 // Reset bombs to initial count
    ballista.disabled = false // Re-enable the ballista
  }
  waveInProgress = true
  showNewWaveMessage = true
  newWaveMessageStart = millis()

  let spawnDelay = 1000 // Delay in milliseconds between each meteorite spawn
  let numMeteorites = 2 + WAVE_MULTIPLIER * currentWave // Number of enemies for each wave

  // Use the x-position of the first and last ballista to define the target range
  let leftMostX = ballistae[0].position.x // Assuming the first ballista is the left-most
  let rightMostX = ballistae[ballistae.length - 1].position.x // Assuming the last ballista is the right-most

  for (let i = 0; i < numMeteorites; i++) {
    setTimeout(function () {
      let targetX = random(leftMostX, rightMostX) // Target x-position within the range of the first and last ballista
      let x = random(width) // Spawn x-position
      let y = -50 // Start above the screen
      // Calculate angle towards target X, assuming meteorites should target the ground level where cities are
      let angle = atan2(height - 50 - y, targetX - x) // Calculate angle towards the target
      let speed = random(0, 2) + currentWave / 2 // Random speed plus half the current wave number
      let velocity = createVector(speed * cos(angle), speed * sin(angle))
      meteorites.push(new Meteorite(createVector(x, y), velocity))
    }, i * spawnDelay)
  }

  if (currentWave > 1 && bombers.length === 0) {
    bombers.push(new Bomber(currentWave)) // Add a new bomber at the start of wave 2
  }
}

function restoreCities() {
  let citiesToRestore = Math.floor(score / 10000) // Calculate how many cities can be restored
  for (let city of cities) {
    if (citiesToRestore <= 0) {
      break // Stop if we have restored enough cities
    }
    if (city.isDestroyed) {
      city.isDestroyed = false // Restore the city
      citiesToRestore-- // Decrement the number of cities left to restore
    }
  }
}

function getWaveMultiplier(wave) {
  if (wave >= 11) return 6
  if (wave >= 9) return 5
  if (wave >= 7) return 4
  if (wave >= 5) return 3
  if (wave >= 3) return 2
  return 1
}

// Utility function for collision detection between two circles
function collideCircleCircle(x1, y1, r1, x2, y2, r2) {
  let d = dist(x1, y1, x2, y2)
  return d < (r1 + r2) / 2
}

// Utility function for collision detection between a circle and a rectangle
function collideCircleRect(
  circleX,
  circleY,
  circleR,
  rectX,
  rectY,
  rectW,
  rectH
) {
  // Calculate the closest point to the circle within the rectangle
  let closestX = constrain(circleX, rectX, rectX + rectW)
  let closestY = constrain(circleY, rectY, rectY + rectH)

  // Calculate the distance between the circle's center and this closest point
  let distanceX = circleX - closestX
  let distanceY = circleY - closestY

  // Calculate the squared distance from the circle's center to the closest point on the rectangle
  let distanceSquared = distanceX * distanceX + distanceY * distanceY

  // Check if the distance is less than the circle's radius squared for an intersection
  return distanceSquared < circleR * circleR
}

function mouseClicked() {
  // Find the nearest operational ballista to the mouse click and fire a bomb
  shootingSound.play()
  let nearestBallista = findNearestBallista(mouseX, mouseY)
  if (nearestBallista) {
    let bombVelocity = p5.Vector.sub(
      createVector(mouseX, mouseY),
      nearestBallista.position
    )
    bombVelocity.normalize()
    bombVelocity.mult(BOMB_SPEED) // Adjust this value for bomb speed
    bombs.push(new Bomb(nearestBallista.position.copy(), bombVelocity))
    nearestBallista.bombs--
  }
}

function keyPressed() {
  if (key === ' ') {
    // Using spacebar for detonation
    for (let bomb of bombs) {
      if (!bomb.isExploded) {
        bomb.explode()
        break // Stop after exploding the first unexploded bomb
      }
    }
  }
}

function findNearestBallista(x, y) {
  // Initialize variables to store the nearest operational ballista and its distance
  let nearestOperational = null
  let recordDistanceOperational = Infinity

  // Iterate through each ballista to find the nearest operational one with bombs
  for (let ballista of ballistae) {
    if (!ballista.disabled && ballista.bombs > 0) {
      let d = dist(x, y, ballista.position.x, ballista.position.y)
      if (d < recordDistanceOperational) {
        recordDistanceOperational = d
        nearestOperational = ballista
      }
    }
  }

  // Return the nearest operational ballista with bombs if available
  return nearestOperational
}

function restartGame() {
  restartButton.hide()
  resetGame()
  gameState = 'start'
}
