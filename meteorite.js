class Meteorite {
  constructor(
    initialPosition,
    initialVelocity,
    canSplit = true,
    radius = 20,
    color = [255, 0, 0]
  ) {
    this.position = initialPosition
    this.velocity = initialVelocity
    this.acceleration = createVector(0, METEORITE_GRAVITY) // Assuming METEORITE_GRAVITY is a constant you've defined
    this.isExploded = false
    this.canSplit = canSplit
    this.radius = radius
    this.color = color
  }

  update() {
    // Apply acceleration to velocity
    this.velocity.add(this.acceleration)

    // Optional: Apply drag to velocity
    this.velocity.mult(METEORITE_DRAG_FACTOR) // Assuming METEORITE_DRAG_FACTOR is a constant you've defined

    // Update position with velocity
    this.position.add(this.velocity)

    // Check if the meteorite is out of screen bounds and mark it exploded if so
    if (
      this.position.y > height ||
      this.position.x < 0 ||
      this.position.x > width
    ) {
      this.isExploded = true
    }
  }

  show() {
    // Display the meteorite
    if (!this.isExploded) {
      fill(this.color)
      ellipse(this.position.x, this.position.y, this.radius, this.radius) // Example representation
    }
  }

  explode() {
    // Handle explosion
    this.isExploded = true
    explosionSound.play()
    // Trigger explosion effect
    for (let i = meteorites.length - 1; i >= 0; i--) {
      let otherMeteorite = meteorites[i]
      if (!otherMeteorite.isExploded) {
        let d = dist(
          this.position.x,
          this.position.y,
          otherMeteorite.position.x,
          otherMeteorite.position.y
        )
        if (d < EXPLOSION_RADIUS) {
          otherMeteorite.explode()
        }
      }
    }
  }
}
