class Ballista {
  constructor(position) {
    this.position = position
    this.bombs = 10 // Number of bombs per wave
    this.disabled = false // Track if the ballista is disabled
  }

  show() {
    // Display the ballista
    if (this.disabled) {
      fill(100) // If disabled, show it in a darker color
    } else {
      fill(255) // If active, show it in white
    }
    rect(this.position.x, this.position.y, 20, 20) // Example representation
  }
}
