'use strict';
var map = [
  [ true,  true,  true,  true, false, false, false],
  [false, false, false,  true,  true,  true,  true],
  [false,  true, false,  true, false, false, false],
  [false,  true,  true,  true,  true,  true, false],
  [false,  true, false,  true, false, false, false],
  [false,  true, false,  true, false, false, false],
  [false,  true, false,  true,  true,  true, false],
  [false,  true,  true, false, false,  true, false],
  [false, false, false,  true, false,  true, false],
  [false,  true, false,  true, false,  true, false],
  [false,  true,  true,  true,  true,  true, false],
  [false, false,  true, false, false, false, false]
],
map2 = [
  [ true,  true,  true,  true, false, false, false],
  [false, false,  true, false, false, true,   true],
  [false,  true,  true,  true, false, false,  true],
  [false,  true,  false, false, false, false,  true],
  [false,  true, false,  true,  true,  true,  true],
  [false,  true, false,  true, false, false, false],
  [false,  true, false,  true,  true,  true,  true],
  [false,  true,  true, false, false,  true, false],
  [false, false,  true, false, false,  true,  true],
  [true,   true,  true, false, false,  true, false],
  [true,  false, false,  true, false,  true, false],
  [true,   true,  true,  true,  true,  true, false]
],
exit2   = {x: 1, y: 5},
miner   = {x: 0, y: 0},
exit    = {x: 9, y: 1},
stepsHistory   = [];

function solve(map, miner, exit) {

  var x = miner.x,
      y = miner.y,
      exitFound      = false,
      trail          = [],
      steps          = [],
      lastOption     = 'up';

  function isTheExit(x,y) {
    return (x === exit.x && y === exit.y);
  }

  function offLimits(x,y) {
    return (x < 0 || y < 0 || x >= map.length || y >= map[0].length);
  }

  function blocked(x,y) {
    return !map[x][y];
  }

  function coordinatesVisited(x,y) {
    return trail[x][y];
  }

  function deadEnd(x,y) {
    if(coordinatesVisited(x,y)) {
      return trail[x][y].deadEnd;
    }
    else {
      return false;
    }
  }

  function stepBack(x,y) {
    if (trail[x][y]) {
      trail[x][y].deadEnd = true;
    }
    x = stepsHistory[stepsHistory.length-1].x
    y = stepsHistory[stepsHistory.length-1].y
    steps.pop();
    stepsHistory.pop();

    return true;
  }

  function updateMinerLocation(x,y,step){
    switch(step) {
      case 'right':
        steps.push(step);
        miner.x++
        break;
      case 'down':
        steps.push(step);
        miner.y++
        break;
      case 'left':
        steps.push(step);
        miner.x--
        break;
      case 'up':
        steps.push(step);
        miner.y--
        break;
    }
    trail[x][y] = {open: true, deadEnd: false};
    stepsHistory.push({x: x, y: y, open: true, deadEnd: false});
    return true;
  }


  function walk(x,y, step) {

    if (isTheExit(x,y)) {
      console.log('Finally! the exit is in (' + x + ',' + y + ')');
      exitFound = true;
      updateMinerLocation(x,y,step);
      return true;
    }

    else if(!exitFound && step === lastOption && blocked(x,y)){
      stepBack(x,y);
      return false;
    }

    else if (offLimits(x,y) || blocked(x,y) || deadEnd(x,y) || coordinatesVisited(x,y)) {
      return false;
    }

    else if (!exitFound && !coordinatesVisited(x,y)){
      updateMinerLocation(x,y,step);
      if (!exitFound) {var right = walk(x+1, y  , 'right');}
      if (!exitFound) {var down  = walk(x  , y+1, 'down');}
      if (!exitFound) {var left  = walk(x-1, y  , 'left');}
      if (!exitFound) {var up    = walk(x  , y-1, 'up');}
      return true;
    }
  }

  // columns = X, rows = Y
  var i;
  for(i = 0; i < map.length; i++) {
    trail.push(new Array(map[0].length)); // Create an empty bi-dimensional array ( same size as the map )
  }

  walk(x,y);
  console.log(steps);
  return steps;
}

solve(map2, miner, exit2);


$(document).ready(function () {
  function createMap(map, exit) {
    var numberOfTiles   = map.length * map[0].length,
        tileWidth       = 40,
        mapWrapperWidth = map.length * tileWidth + 2;

    $('#mapWrapper').css({"width": mapWrapperWidth + 'px'});

    var k, m, coords;
    for(k = 0; k < map[0].length; k++) {
      for(m = 0; m < map.length; m++) {

        $('#mapWrapper').append('<div id="x' + m + 'y' + k + '" class="tile" />');

        if(map[m][k] === false) {
          coords = '#x' + m + 'y' + k;
          $(coords).addClass('falseTile');
        }
      }
    }

    $('.tile').css({"width": tileWidth + 'px', "height": tileWidth + 'px'});
    var exitCoords = '#x' + exit.x + 'y' + exit.y;
    $(exitCoords).addClass('exitTile');

    var animationInterval, p = 0;

    function animateMiner(){
      if(p < stepsHistory.length) {
        $('.miner').css({
          "left": stepsHistory[p].x * tileWidth + 'px',
          "top" : stepsHistory[p].y * tileWidth + 'px'});
        p++
      }
      else {
        $('body').css({"background-color": "#82E0AA"});
        $('#mapWrapper').css({"background-color": "#52BE80"});
        $('.tile').css({"opacity": "0"});
        clearInterval(animationInterval);
      }
    }
    animationInterval = setInterval(animateMiner, 410);
  }
  createMap(map2, exit2);
});

