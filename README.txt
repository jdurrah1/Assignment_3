DIV BLASTER v1.0
----------------

This code is the basis for a simple 'asteroid blaster' game. It has the
following functionality:
- 2D ship movement
- "Fire-able rockets" that can destroy asteroids they collide with
- Asteroids that can be "spawned" based on user input, and fall vertically
- Score tracking
 -- Single-session scoring (clears on refresh)
 -- Score per asteroid is inversely proportional to size (smaller==harder==more points)


========  CONTROLS  ========

Arrow-Keys: move ship
Spacebar: fire rocket
Shift: spawn one additional asteroid


========  VERSIONS  ========

This code has a few 'prior' versions available, each with sequentially-added
functionality. These versions can be found in the "x_versions/" folder.
Some commented-out code is also included to show other ways to get a similar
final result that are NOT the right way (being either ineffective or inefficient).

'Previous' versions can be composed using:
v1) index.html + style.css + page.js
  -- Basic page layout and ship (HTML/CSS) + movement logic for arrow keys (JS)
v2) index.html + style.css + pageA.js
  -- Adds generation of "rocket" divs, and add movement of those divs
v3) index.html + style.css + pageB.js
  -- Adds spawn-able asteroids of random color at a random horizontal position
v5) index.html + style.css + pageC.js
  -- Adds more efficient/scalable collision detection between game objects
v6) indexD.html + styleD.css + pageD.js
  -- Adds scoring (more points for smaller asteroids) and a game-over screen
  -- Adds images for asteroids and rockets (HTML/CSS)


FINAL Version:
The final version contains EXACTLY what version (5) has in terms of
functionality, but cleans up the code a bit for easier future-use and extension.
Basically, the x_versions/ versions were all coded "linearly" as we were doing
in class, which does not usually lead to well-engineered code! The final version
remedies some of these issues.
