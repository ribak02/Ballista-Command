class City {
  constructor(position) {
    this.position = position
    this.isDestroyed = false
  }

  show() {
    // Display the city
    if (!this.isDestroyed) {
      fill(0, 255, 0)
      rect(this.position.x, this.position.y, 30, 30) // Example representation
    }
  }

  destroy() {
    // Handle the destruction of the city
    this.isDestroyed = true
  }
}
