# Ballista Command

## Introduction
**Ballista Command** is an engaging arcade-style game developed as a modern variation of the classic *Missile Command*, with additional elements to enhance gameplay and challenge. The game was developed meticulously, adhering to both core and additional requirements to ensure the inclusion of essential mechanics expected from a game of this genre.

### Core Requirements:
- **Dynamic Object Creation**: Manages cities, ballistae, meteors, and bombs. Each wave introduces more meteors, requiring players to strategically use limited ammunition to defend their cities.
- **Physics Engine**: Includes basic physics to simulate gravity effects on bombs and meteors, trajectory calculations for bomb launches, and collision detection between objects.

### Additional Requirements:
- **Splitting Meteorites**: From wave 2 onwards, some meteorites can split into multiple fragments as they descend.
- **Enemy Bombers**: Bombers appear intermittently, dropping additional meteors.
- **Sound Effects and Music**: Enhances the overall game experience.

## Design and Implementation

### Game Mechanics
The primary objective is to defend against waves of meteors. Players control ballistae positioned on the ground, launching projectiles to destroy incoming meteors. The game ends when all cities are destroyed, and the player’s score reflects their defense capabilities.

### Gravitational Effects
Both bombs and meteorites are subject to gravity, influencing their trajectories. The game adjusts the vertical velocity of these objects over time to create realistic movement.

### Projectile Motion
When a bomb is launched, its initial velocity is calculated based on the aim and set speed, using trigonometric functions to determine horizontal and vertical components.

### Collision Detection
- **Circle-Circle Collision**: Used for collisions between bombs and meteorites.
- **Circle-Rectangle Collision**: Detects collisions between meteorites and cities or ballistae bases.

### Advanced Features:
- **Splitting Meteorites**: Some meteorites split into smaller fragments, requiring dynamic recalculation of their trajectories.
- **Enemy Behavior**: Bombers move horizontally and drop meteors at intervals. The bomber-dropped meteors are yellow for distinction and do not split.

### Implementation Details
- **p5.js Library**: The game utilizes p5.js for canvas manipulation and event handling.
- **Dynamic Object Creation**: Objects like meteors, bombs, ballistae, and cities are managed through arrays, allowing flexible game scaling.
- **Wave Management**: Waves are initiated through a time-based system, increasing in difficulty with each new wave.
- **Minimalistic Graphics and Simple Sound Effects**: Focuses on gameplay mechanics and provides feedback to players without overwhelming them with visual or auditory distractions.

## Game Elements
- **Cities**: Main assets. Once all are destroyed, the game ends.
- **Ballistae**: Defensive units that shoot bombs to destroy meteors.
- **Meteorites**: The primary threat. Some split into smaller meteors after wave 2.
- **Bombs**: Launched by ballistae to destroy meteorites.
- **Bombers**: Appear after wave 2, dropping yellow meteors.

## Controls
- **Mouse Click**: Aim and shoot a bomb from the nearest ballista to the cursor.
- **Spacebar**: Detonates the first launched bomb, causing an explosion.

## Scoring
Points are earned for destroying meteorites, with a multiplier that increases with each wave. Bonus points are awarded for surviving cities and unused bombs.

- **Wave Multipliers**:
  - Waves 1–2: 1x multiplier
  - Waves 3–4: 2x multiplier
  - Waves 5–6: 3x multiplier
  - Waves 7–8: 4x multiplier
  - Waves 9–10: 5x multiplier
  - Waves 11+: 6x multiplier

## Balanced Play
The game gradually increases difficulty, starting with 4 meteors per wave and adding more as waves progress. The introduction of bombers and splitting meteors adds unpredictability, while increased meteor speed keeps the gameplay challenging.

## Testing
- **Unit Testing**: Physics calculations and collision detection algorithms were tested in isolation.
- **Integration Testing**: Ensured smooth interaction between game components.
- **User Testing**: Feedback from players informed gameplay balance and controls responsiveness.

## Conclusion
**Ballista Command** applies fundamental physics and collision detection to deliver a challenging and engaging experience. The game evolves the *Missile Command* concept by introducing splitting meteorites, enemy bombers, and additional gameplay mechanics. Through balanced play and rigorous testing, Ballista Command provides an enjoyable, dynamic challenge for players of all skill levels.

Figures:
- Figure 1: Start screen
- Figure 2: Wave 1 in progress
- Figure 3: Wave 2 with bomber dropping meteors
- Figure 4: Splitting meteors after wave 1
- Figure 5: Ballista shooting a bomb
- Figure 6: Bomb explosion
- Figure 7: City restoration after high score
- Figure 8: Game over screen showing final score
