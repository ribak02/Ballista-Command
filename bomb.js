const BOMB_ACCELERATION = 0.1 // Adjust this value for bomb acceleration

class Bomb {
  constructor(initialPosition, initialVelocity) {
    this.position = initialPosition
    this.velocity = initialVelocity
    this.acceleration = createVector(0, BOMB_ACCELERATION) // Bomb acceleration vector
    this.isExploded = false
    this.explosionDuration = EXPLOSION_DURATION // Duration of the explosion visual effect
    this.explostionPosition = null
  }

  update() {
    // Apply gravity and update position only if not exploded
    if (!this.isExploded) {
      // Update velocity with acceleration
      this.velocity.add(this.acceleration)
      // Gravity
      this.velocity.y += GRAVITY // 0.2 // Gravity value, adjust as needed

      // Drag
      this.velocity.mult(DRAG_FACTOR) // Drag factor, adjust as needed

      // Update position
      this.position.add(this.velocity)
    }
    // Decrease the explosion duration
    if (this.isExploded) {
      this.explosionDuration--
    }
  }

  show() {
    // Display the bomb
    if (this.isExploded && this.explosionDuration > 0) {
      // Show explosion effect
      fill(255, 165, 0)
      noStroke()
      ellipse(
        this.explosionPosition.x,
        this.explosionPosition.y,
        EXPLOSION_RADIUS * 2,
        EXPLOSION_RADIUS * 2
      )
    } else {
      // Show bomb
      fill(0, 0, 255)
      ellipse(this.position.x, this.position.y, 10, 10)
    }
  }

  explode() {
    // Handle explosion
    this.isExploded = true
    this.explosionDuration = EXPLOSION_DURATION // Reset the duration on explosion
    this.explosionPosition = this.position.copy() // Lock in the explosion position

    // Check for nearby meteorites and explode them
    for (let i = meteorites.length - 1; i >= 0; i--) {
      let meteorite = meteorites[i]
      let d = dist(
        this.explosionPosition.x,
        this.explosionPosition.y,
        meteorite.position.x,
        meteorite.position.y
      )
      if (d < EXPLOSION_RADIUS) {
        meteorite.explode()
        score += 25 // Increase score for each meteorite destroyed
      }
    }
  }
}
