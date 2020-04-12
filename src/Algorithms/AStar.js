import { PathFindingVisualizer } from "../components/PathFindingVisualizer";

function heuristic(from, to) {
  var xDiff = from[0] - to[0];
  var yDiff = from[1] - to[1];
  var distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
  return distance;
}

function removeFromArr(arr, elt) {
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i] === elt) {
      arr.splice(i, 1);
    }
  }
}

function AStar(grid, start, end) {
  var openSet = [start];
  var closeSet = [];
  var path = [];
  while (openSet.length > 0) {
    // Finding the loest fscore node in openset
    var winner = 0;
    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[winner].f) {
        winner = i;
      }
    }
    // start.f = heuristic(start, end);
    // adding the lowest fscore node in current
    var current = openSet[winner];

    if (current === end) {
      var temp = current;
      path.push(current);
      while (temp.cameFrom) {
        temp.s = "path";
        path.push(temp.cameFrom);
        temp = temp.cameFrom;
      }
      console.log("DONE!!!");
      return true;
    }

    // Remove current form Openset and put it in the closeset array
    removeFromArr(openSet, current);
    closeSet.push(current);

    var neighbors = current.neighbors;

    for (let i = 0; i < neighbors.length; i++) {
      var neighbor = neighbors[i];
      if (!closeSet.includes(neighbor) && neighbor.s !== "wall") {
        var tempG = current.g + 1;
        var foundNewPath = false;

        if (openSet.includes(neighbor)) {
          if (tempG < neighbor.g) {
            foundNewPath = true;
            neighbor.g = tempG;
          }
        } else {
          foundNewPath = true;
          neighbor.g = tempG;
          openSet.push(neighbor);
        }
        if (foundNewPath) {
          neighbor.cameFrom = current;
          neighbor.h = heuristic(neighbor, end);
          neighbor.f = neighbor.h + neighbor.g;
        }
      }
    }
  }
  console.log("No Path Found!");
  return path;
}
export default AStar;
