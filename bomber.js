class Bomber {
  constructor(currentWave) {
    this.position = createVector(0, random(50, height / 4)) // Start from the left, at a random height in the top quarter
    this.speed = 2 // Speed at which the bomber moves to the right
    this.dropRate = this.getDropRate(currentWave) // How often the bomber drops a meteorite (in milliseconds)
    this.lastDrop = millis() // Track the last drop time
  }

  getDropRate(currentWave) {
    // Example adjustment: decrease drop rate by 10% per wave, making drops more frequent in later waves
    return 3500 / (1 + 0.1 * (currentWave - 1))
  }

  update() {
    // Move the bomber to the right
    this.position.x += this.speed

    // If the bomber reaches the right edge, it disappears (or you could make it loop around)
    if (this.position.x > width) {
      let index = bombers.indexOf(this)
      if (index > -1) {
        bombers.splice(index, 1)
      }
    }

    // Check if it's time to drop another meteorite
    if (millis() - this.lastDrop > this.dropRate) {
      this.dropMeteorite()
      this.lastDrop = millis()
    }
  }

  show() {
    fill(255, 255, 0) // Yellow color
    rect(this.position.x, this.position.y, 20, 10) // Display as a small rectangle
  }

  dropMeteorite() {
    // Drop a meteorite directly below the bomber
    let meteoritePosition = createVector(this.position.x, this.position.y + 10)
    let meteoriteVelocity = createVector(0, 3) // Straight down
    meteorites.push(
      new Meteorite(
        meteoritePosition,
        meteoriteVelocity,
        false,
        20,
        [255, 255, 0]
      )
    )
  }
}
