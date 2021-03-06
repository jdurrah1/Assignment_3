////  Page-scoped globals  ////

// Counters
var rocketIdx = 1;
var asteroidIdx = 1;
var lifeIdx = 0;
var setIntervalIDSpawn = 0; 
var setIntervalIDSpawn2 = 0; 

var rocketLauchedCounter = 0; 
var asteroidsHitCounter = 0; 
var asteroidCounter =0; 

var lives = 3; 

var rocketSound;
var shipAsteroidCSound;
var gameOverSound;
var introSound;

// Size Constants
var MAX_ASTEROID_SIZE = 50;
var MIN_ASTEROID_SIZE = 15;
var ASTEROID_SPEED = 5;
var ROCKET_SPEED = 10;
var SHIP_SPEED = 25;
var OBJECT_REFRESH_RATE = 50;  //ms
var SCORE_UNIT = 100;  // scoring is in 100-point units

// Size vars
var maxShipPosX, maxShipPosY;

// Global Window Handles (gwh__)
var gwhGame, gwhOver, gwhStatus, gwhScore, gwhAccuracy,gwhLives,gwhSplash;

// Global Object Handles
var ship;

var shieldSpawnRate = 10; 


/*
 * This is a handy little container trick: use objects as constants to collect
 * vals for easier (and more understandable) reference to later.
 */
var KEYS = {
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  shift: 16,
  spacebar: 32
}

var SOUNDS = 
{
  rocketLaunch: 0,
  shipAsteroidC:1,
  gameOver:2,
  intro:3

}

var GameStates = 
{
  notStated:0,
  Started:1, 
  gameOver:2
}

var SoundStates = 
{
  muted:0, 
  unmuted:1
}

var soundState = SoundStates.muted; 

var gameState = GameStates.notStated; 

////  Functional Code  ////

// Main
$(document).ready( function() {
  console.log("Ready!");

  // Set global handles (now that the page is loaded)
  gwhGame = $('.game-window');
  gwhOver = $('.game-over');
  gwhStatus = $('.status-window');
  gwhScore = $('#score-box');
  gwhAccuracy = $('#accuracy-box');
  gwhLives = $('.lives-window')
  ship = $('#enterprise');  // set the global ship handle
  gwhSplash = $(".splash-window");

  // Set global positions
  maxShipPosX = gwhGame.width() - ship.width();
  maxShipPosY = gwhGame.height() - ship.height();

  $(window).keydown(keydownRouter);
  //$(window).keydown(moveShip);
  //$(window).keydown(fireRocket);
  //$(window).keydown(createAsteroid);


  setInterval(function(){createAsteroid(1);}, 10000);
 

  // Periodically check for collisions (instead of checking every position-update)
  setInterval( function() {
    checkCollisions();  // Remove elements if there are collisions
  }, 100);

  intializeLifes();
  $(".life").hide(); 
  initializeAsteroidsAutoSpawn();
  initializeSounds();
  playSound(SOUNDS.intro);
  setShieldSpawnRate();

  


  $("#startGame-button").click(function()
  {
      gwhSplash.fadeOut(); 
      

      gameState=GameStates.Started; 
       $(".life").show(); 

  });
    //hide show settings panel 
  $("#showHideSettings-button").click(function()
  {
      if ($("#showHideSettings-button").html() == 'Open Settings Panel')
      { 
        $("#showHideSettings-button").html('Close Settings Panel');
        $(".settings").show();
      }
      else
      {
        $(".settings").hide();
        $("#showHideSettings-button").html('Open Settings Panel');
      }

  });


  $("#settingsSubmit-button").click(function()
  {
    $("#showHideSettings-button").trigger('click'); 
    var lifes = parseInt($("#lives-box").val());
    //console.log("you enter " + lifes + " lives");

    var spawnInterval = parseFloat($("#spawnInterval-box").val());
    //console.log("you enter spanning interval " + spawnInterval);

    shieldSpawnRate = parseInt($("#shield-box").val()); 

    setShieldSpawnRate(); 

    intializeLifes(lifes); 
    initializeAsteroidsAutoSpawn(spawnInterval);

    if(gameState!=GameStates.Started) //lifes should be hidden initially until the game starts
      $(".life").hide(); 

    if($("#mute-box").is(':checked'))
    {
      soundState = SoundStates.muted;
      stopAllSounds();
    }
    else
    {
      soundState = SoundStates.unmuted; 
    }

  });

  $("#spawnInterval-box").focusout(function()
  {
    x = $("#spawnInterval-box").val();
      var e = parseFloat(x);
      if((!(e>=.2 & e<=4) | isNaN(e)) & x.length!=0)
      {
        alert('spawn interval must in the following range: [0.2-4] '+ e);
      }

  });


  $("#restart-button").click(function()
    {
      restartGame(); 
    });

});


function setShieldSpawnRate()
{
        //check gups
      if(gup("itemRate")!=null)
      {
        var itemRate = parseInt(gup("itemRate")) ;
        if(itemRate<0 | isNaN(itemRate))
        {
          alert("url parameter for life rejected")
        }
        else
          shieldSpawnRate = itemRate;
      }
      
      else
      {
        x = $("#shield-box").val();
        var e = parseInt(x);
        if((!(e>=0) | isNaN(e)) & x.length!=0)
        {
          alert('Shield spawn rate must be 0 or greater: '+ e);
          shieldSpawnRate = 10; 
        }
        else if (x.length==0)
        {
          shieldSpawnRate = 10; 
        }
        else
        { 
          shieldSpawnRate = e; 
        }
    }
}


function restartGame()
{
//hide game over 

//show game window and other hidden windows

//change game state to not started

//initializeAsteroidAutoSpawn()

//initializeLifes

//put ship into initial position

//destroy any and all asteroids

    playSound(SOUNDS.intro);
    gwhGame.show();
    gwhStatus.show();
    gwhSplash.show(); 
    $(".game-over-panel").hide();

    // Show "Game Over" screen.
    gameState=GameStates.notStated;
    gwhOver.hide();

    intializeLifes();
    $(".life").hide(); 
    initializeAsteroidsAutoSpawn();

    //shipe inoriginal position
      ship.show(); 
      ship.css('left', 122);
      ship.css('top', 530);

    $('.rocket').remove();  // remove all rockets
    $('.asteroid').remove();  // remove all asteroids


    //reset scores
     rocketLauchedCounter = 0; 
     asteroidsHitCounter = 0; 
    gwhScore.html(0);
    gwhAccuracy.html(0 + "%");
}




function initializeAsteroidsAutoSpawn(e)
{

  if(setIntervalIDSpawn2 !=0)
    clearInterval(setIntervalIDSpawn2);

  if(e>=.2 & e<=4)
    {
      setIntervalIDSpawn2 = setInterval(function(){randomSetIntervalForSpawn(e)}, 1000/(e-e*0.6)); 
    }
  else 
  {
     setIntervalIDSpawn2 = setInterval(function(){randomSetIntervalForSpawn(1)}, 1000/(0.4)); 
  }
}

function randomSetIntervalForSpawn(e)
{
if(gameState==GameStates.Started)
{
    var halfInterval = e/2; 
    var randomNumber = Math.random()*10;
    var spawnInterval; 

    if(setIntervalIDSpawn !=0)
    {
      clearInterval(setIntervalIDSpawn);
    }

    if(randomNumber >6)
    {
      spawnInterval= (e-halfInterval); 
    }
    else if (randomNumber >3)
    {
      spawnInterval = (e); 
    }
    else
    {
      spawnInterval= (e+halfInterval); 
    }

    setIntervalIDSpawn = setInterval(createAsteroid, 1000/(spawnInterval)); 
    console.log("Spawn Interval: " + spawnInterval);
  }

}

function intializeLifes(e){

  //remove all lifes
  while(removeLife())
  {

  }


      //check gups
  if(gup("life")!=null)
  {
    var itemRate = parseInt(gup("life")) ;
    if(itemRate<0 | isNaN(itemRate))
    {
      alert("url parameter for life rejected")
    }
    else
      lives = itemRate;
  }
  else if(e>0 & e <11)
  {
    lives = e; 
  }
  else
  {
    lives = 3; //default
  }

  var i = 1; 
  while (i < lives)
  {
    addLife(); 
    i++
  }

}

function addLife()
{
    lifeIdx++;
    var life = "<div id='l-" + lifeIdx + "' class='life'><img height='10px' src='img/fighter.png'/></div>";

    gwhLives.append(life);
    var curLife = $('#l-'+lifeIdx);

    curLife.css('position', 'relative');
    curLife.css('float', 'right');
    

}

function addExplosition()
{
    var explositionDivStr = "<div id='e-" + 1 + "' class='explosition'><img src='img/explosion.png'/></div>";
    // Add the rocket to the screen
    //gwhGame.append(explositionDivStr);
    // Create and rocket handle based on newest index
    ship.append(explositionDivStr);
    var curExplosition = $('#e-'+1);
    $(".ship-avatar").css('position', 'absolute');




    // Set vertical position
   //curExplosition.css('top', parseInt(ship.css('top')) - 50 +'px' );
    // Set horizontal position
   //var rxPos = parseInt(ship.css('left')) + (ship.width()/2);  // In order to center the rocket, shift by half the div size (recall: origin [0,0] is top-left of div)
   //curExplosition.css('left', ship.css('left'));
   curExplosition.css('position', 'absolute');
   setTimeout(function(){$('#e-'+1).remove(); $(".ship-avatar").css('position', 'relative');}, 1000);
}

function removeLife()
{
  
  if(lifeIdx>0)
  {
    playSound(SOUNDS.shipAsteroidC); 

    var curLife = $('#l-'+lifeIdx);
    curLife.remove(); 
    lifeIdx--;
    return true; 
  }
  else
  {
    return false; 
  }

}

function keydownRouter(e) {
  switch (e.which) {
    case KEYS.shift:
      createAsteroid();
      break;
    case KEYS.spacebar:
      fireRocket();
      break;
    case KEYS.left:
    case KEYS.right:
    case KEYS.up:
    case KEYS.down:
      moveShip(e.which);
      break;
    default:
      console.log("Invalid input!");
  }
}

// Check for any collisions and remove the appropriate object if needed
function checkCollisions() {
  // First, check for rocket-asteroid checkCollisions
  /* NOTE: We dont use a global handle here because we need to refresh this
   * list of elements when we make the reference.
   */
  $('.rocket').each( function() {
    var curRocket = $(this);  // define a local handle for this rocket
    $('.asteroid').each( function() {
      var curAsteroid = $(this);  // define a local handle for this asteroid

      // For each rocket and asteroid, check for collisions
      if (isColliding(curRocket,curAsteroid)) {
        asteroidsHitCounter++;
        //console.log("Asteroid #", asteroidsHitCounter, " Hit!");
        
        // If a rocket and asteroid collide, destroy both
        curRocket.remove();
        curAsteroid.remove();

        // Score points for hitting an asteroid! Smaller asteroid --> higher score
        var points = Math.ceil(MAX_ASTEROID_SIZE-curAsteroid.width()) * SCORE_UNIT;
        // Update the visible score
        gwhScore.html(parseInt($('#score-box').html()) + points);
        gwhAccuracy.html(Math.round((asteroidsHitCounter/rocketLauchedCounter)*100) + "%");
      }
    });
  });


  // Next, check for asteroid-ship interactions
  $('.asteroid').each( function() {
    var curAsteroid = $(this);
    if (isColliding(curAsteroid, ship) & !isShieldOn()) {

      if(curAsteroid.hasClass('shield')) //hit shield
      {
        curAsteroid.remove();
        //add shield to ship
        addShield();

      }
      else //hit asteroid
      {
          // Remove all game elements
          addExplosition();
          $('.rocket').remove();  // remove all rockets
          $('.asteroid').remove();  // remove all asteroids

          if(!removeLife())
          {
            gameOver();
          }
        }
      }
      else if (isColliding(curAsteroid, ship) & isShieldOn() ) //hit and asteroid and shield is on
      {
        
        curAsteroid.remove();
        removeShield();
        //addExplosition();

      }
  });
}

function addShield()
{
  ship.addClass('shield');
  ship.append(("<img id='shieldID' src='img/shield.png'  />"));

  $(".ship-avatar").css('position', 'absolute');
}

function removeShield()
{
  ship.removeClass('shield');
  $("#shieldID").remove();
  $(".ship-avatar").css('position', 'relative');
}

function isShieldOn()
{
  if(ship.hasClass('shield'))
    return true
  
  return false; 
}

function gameOver()
{
    ship.hide();

   // Hide primary windows
   // gwhGame.hide();
   $(".game-over-panel").show();
    gwhStatus.hide();

    // Show "Game Over" screen.
    gameState=GameStates.gameOver;
    gwhOver.show();

    //add gameoverStates
    $("#final_Score").html($("#score-box").html());
    $("#final_Accuracy").html($("#accuracy-box").html());

    playSound(SOUNDS.gameOver);
    


}

// Check if two objects are colliding
function isColliding(o1, o2) {
  // Define input direction mappings for easier referencing
  o1D = { 'left': parseInt(o1.css('left')),
          'right': parseInt(o1.css('left')) + o1.width(),
          'top': parseInt(o1.css('top')),
          'bottom': parseInt(o1.css('top')) + o1.height()
        };
  o2D = { 'left': parseInt(o2.css('left')),
          'right': parseInt(o2.css('left')) + o2.width(),
          'top': parseInt(o2.css('top')),
          'bottom': parseInt(o2.css('top')) + o1.height()
        };

  // If horizontally overlapping...
  if ( (o1D.left < o2D.left && o1D.right > o2D.left) ||
       (o1D.left < o2D.right && o1D.right > o2D.right) ||
       (o1D.left < o2D.right && o1D.right > o2D.left) ) {

    if ( (o1D.top > o2D.top && o1D.top < o2D.bottom) ||
         (o1D.top < o2D.top && o1D.top > o2D.bottom) ||
         (o1D.top > o2D.top && o1D.bottom < o2D.bottom) ) {

      // Collision!
      return true;
    }
  }
  return false;
}

// Return a string corresponding to a random HEX color code
function getRandomColor() {
  // Return a random color. Note that we don't check to make sure the color does not match the background
  return '#' + (Math.random()*0xFFFFFF<<0).toString(16);
}

// Handle asteroid or shield creation events 
function createAsteroid(e) {

  if(gameState==GameStates.Started)
  {
    //console.log('Spawning asteroid...');

    // NOTE: source - http://www.clipartlord.com/wp-content/uploads/2016/04/aestroid.png
    var asteroidDivStr = "<div id='a-" + asteroidIdx + "' class='asteroid'></div>"
    // Add the rocket to the screen
    gwhGame.append(asteroidDivStr);
    // Create and asteroid handle based on newest index
    var curAsteroid = $('#a-'+asteroidIdx);

    asteroidIdx++;  // update the index to maintain uniqueness next time

    // Set size of the asteroid (semi-randomized)
    var astrSize = MIN_ASTEROID_SIZE + (Math.random() * (MAX_ASTEROID_SIZE - MIN_ASTEROID_SIZE));
    curAsteroid.css('width', astrSize+"px");
    curAsteroid.css('height', astrSize+"px");

    if(e==1)
    {
      curAsteroid.append("<img src='img/fireball.png' height='" + 40 + "'/>")
    }
    else if(asteroidCounter<shieldSpawnRate)
    {
      curAsteroid.append("<img src='img/asteroid.png' height='" + astrSize + "'/>")
      asteroidCounter++;
    }
    else
    {
      asteroidCounter =0;
      curAsteroid.append("<img src='img/shield.png' height='" + astrSize + "'/>")
      //add shield to class
      curAsteroid.addClass('shield');

    }

    /* NOTE: This position calculation has been moved lower since verD -- this
    **       allows us to adjust position more appropriately.
    **/
    // Pick a random starting position within the game window
    var startingPosition = Math.random() * (gwhGame.width()-astrSize);  // Using 50px as the size of the asteroid (since no instance exists yet)

    // Set the instance-specific properties
    curAsteroid.css('left', startingPosition+"px");

    // Make the asteroids fall towards the bottom
    setInterval( function() {
      curAsteroid.css('top', parseInt(curAsteroid.css('top'))+ASTEROID_SPEED);
      // Check to see if the asteroid has left the game/viewing window
      if (parseInt(curAsteroid.css('top')) > (gwhGame.height() - curAsteroid.height())) {
        curAsteroid.remove();
      }
    }, OBJECT_REFRESH_RATE);
  }
}

// Handle "fire" [rocket] events
function fireRocket() {
  if(gameState==GameStates.Started)
  {
    playSound(SOUNDS.rocketLaunch);

    rocketLauchedCounter++;
    //console.log('Firing rocket...#', rocketLauchedCounter);

    //update accuracy
    gwhAccuracy.html(Math.round((asteroidsHitCounter/rocketLauchedCounter)*100) + "%");

    // NOTE: source - https://www.raspberrypi.org/learning/microbit-game-controller/images/missile.png
    var rocketDivStr = "<div id='r-" + rocketIdx + "' class='rocket'><img src='img/rocket.png'/></div>";
    // Add the rocket to the screen
    gwhGame.append(rocketDivStr);
    // Create and rocket handle based on newest index
    var curRocket = $('#r-'+rocketIdx);
    rocketIdx++;  // update the index to maintain uniqueness next time

    // Set vertical position
    curRocket.css('top', ship.css('top'));
    // Set horizontal position
    var rxPos = parseInt(ship.css('left')) + (ship.width()/2);  // In order to center the rocket, shift by half the div size (recall: origin [0,0] is top-left of div)
    curRocket.css('left', (rxPos-10)+"px");

    // Create movement update handler
    setInterval( function() {
      curRocket.css('top', parseInt(curRocket.css('top'))-ROCKET_SPEED);
      // Check to see if the rocket has left the game/viewing window
      if (parseInt(curRocket.css('top')) < curRocket.height()) {
        //curRocket.hide();
        curRocket.remove();
      }
    }, OBJECT_REFRESH_RATE);
}
}

// Handle ship movement events
function moveShip(arrow) {
  switch (arrow) {
    case KEYS.left:  // left arrow
      var newPos = parseInt(ship.css('left'))-SHIP_SPEED;
      if (newPos < 0) {
        newPos = 0;
      }
      ship.css('left', newPos);
    break;
    case KEYS.right:  // right arrow
      var newPos = parseInt(ship.css('left'))+SHIP_SPEED;
      if (newPos > maxShipPosX) {
        newPos = maxShipPosX;
      }
      ship.css('left', newPos);
    break;
    case KEYS.up:  // up arrow
      var newPos = parseInt(ship.css('top'))-SHIP_SPEED;
      if (newPos < 0) {
        newPos = 0;
      }
      ship.css('top', newPos);
    break;
    case KEYS.down:  // down arrow
      var newPos = parseInt(ship.css('top'))+SHIP_SPEED;
      if (newPos > maxShipPosY) {
        newPos = maxShipPosY;
      }
      ship.css('top', newPos);
    break;
  }
}

function playSound(e)
{

  if(soundState == SoundStates.unmuted)
  {
    switch (e)
    {
      case SOUNDS.rocketLaunch:
        rocketSound.play();
       break;
      case SOUNDS.shipAsteroidC:
         shipAsteroidCSound.play();
       break;
      case SOUNDS.gameOver:
        gameOverSound.play();
       break;
      case SOUNDS.intro:
        introSound.play(); 
        break;
      default:
        console.log("incorrect sound"); 
        break;
    }
  }
}

function stopAllSounds()
{
  rocketSound.stop();
  gameOverSound.stop();
  shipAsteroidCSound.stop();
  introSound.stop(); 
}

function initializeSounds()
{
  rocketSound = new sound("audio/rocket.wav");
  shipAsteroidCSound =new sound("audio/explode.wav");
  gameOverSound= new sound("audio/gameover.wav");
  introSound = new sound("audio/intro.mp3");
}


function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}
