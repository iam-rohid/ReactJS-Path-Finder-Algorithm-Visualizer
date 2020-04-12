import { getNodeText } from "@testing-library/react";

function heuristic(from, to) {
  var xDiff = from[0] - to[0];
  var yDiff = from[1] - to[1];
  var distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
  return distance;
}

function reconstruct_path(cameFrom, current) {
  var totalPath = [current];
  console.log(current);
  cameFrom.forEach((cf) => {
    totalPath.forEach((tp) => {
      if (tp.position[0] !== cf.position[0] && tp.position[1] !== cf.position[1]) {
        totalPath.unshift(cf);
      }
    });
  });
  return totalPath;
}

function d(current, neighbor) {
  if (current.position[0] > neighbor.position[0] || current.position[1] > neighbor.position[1]) {
    return 1;
  } else {
    return -1;
  }
}
function neighbor(current, nodes) {
  var neighbors = [];
  var shouldNeighbors = [
    [current.position[0] + 1, current.position[1]],
    [current.position[0], current.position[1] + 1],
    [current.position[0], current.position[1] - 1],
    [current.position[0] - 1, current.position[1]],
  ];
  nodes.forEach((node) => {
    shouldNeighbors.forEach((sn) => {
      if (sn[0] === node.position[0] && sn[1] === node.position[1]) {
        neighbors.push(node);
      }
    });
  });
  return neighbors;
}

const AStar = (grid, start, goal) => {
  var shortestPath = [];
  var nodes = [];
  var closeSet = [];
  var cameFrom = [];
  var openSet = [];
  var path = [];
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      var obj = {
        position: [i, j],
        gScore: 0,
        fScore: 0,
      };
      if (!grid[i][j].wall) {
        nodes.push(obj);
      }
    }
  }

  // // For node n, gScore[n] is the cost of the cheapest path from start to n currently known.
  // gScore := map with default value of Infinity
  // gScore[start] := 0

  // // For node n, fScore[n] := gScore[n] + h(n). fScore[n] represents our current best guess as to
  // // how short a path from start to finish can be if it goes through n.
  // fScore := map with default value of Infinity
  // fScore[start] := h(start)
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].position[0] === start[0] && nodes[i].position[1] === start[1]) {
      nodes[i].fScore = heuristic(start, goal);
      nodes[i].gScore = 0;
      openSet.push(nodes[i]);
    }
  }
  // var el = e;
  // }
  // while openSet is not empty
  while (openSet.length > 0) {
    //     // This operation can occur in O(1) time if openSet is a min-heap or a priority queue
    //     current := the node in openSet having the lowest fScore[] value
    var current = openSet[0];
    // openSet.map((e) => {
    //   if (current.fScore > e.fScore) {
    //     current = e;
    //   }
    // });

    //     if current = goal
    //         return reconstruct_path(cameFrom, current)
    //     // Current node goes into the closed set
    if (current.position[0] === goal[0] && current.position[1] === goal[1]) {
      var total_path = reconstruct_path(cameFrom, current);
      console.log("Total Path", total_path);
      console.log("path", path);
      return total_path;
    }

    //     closeSet.add(current)
    closeSet.push(current);

    //     openSet.Remove(current)
    openSet.splice(openSet.indexOf(current), 1);
    var neighbors = neighbor(current, nodes);
    //     for each neighbor of current
    neighbors.map((neighbor) => {
      //         // d(current,neighbor) is the weight of the edge from current to neighbor
      //         // tentative_gScore is the distance from start to the neighbor through current
      //         tentative_gScore := gScore[current] + d(current, neighbor)
      var tentative_gScore = current.gScore + 1;
      //         if tentative_gScore < gScore[neighbor]
      if (tentative_gScore < nodes[nodes.indexOf(neighbor)].gScore) {
        //             // This path to neighbor is better than any previous one. Record it!
        //             cameFrom[neighbor] := current
        path.push(neighbor);
        //             gScore[neighbor] := tentative_gScore
        nodes[nodes.indexOf(neighbor)].gScore = tentative_gScore;
        //             fScore[neighbor] := gScore[neighbor] + h(neighbor)
        nodes[nodes.indexOf(neighbor)].fScore =
          nodes[nodes.indexOf(neighbor)].gScore +
          heuristic(nodes[nodes.indexOf(neighbor)].position, goal);
        //             if neighbor not in closeSet
        if (!closeSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
        //                 openSet.add(neighbor)
      }
    });
  }

  // // Open set is empty but goal was never reached
  // return failure
  // for (let i = 0; i < shortestPath.length; i++) {
  //   newGrid[parseInt(shortestPath[i][0])][parseInt(shortestPath[i][1])].short = true;
  // }
  // return newGrid;
};
export default AStar;

// 2nd

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
      return path;
    }

    // Remove current form Openset and put it in the closeset array
    removeFromArr(openSet, current);
    current.s = "checked";
    closeSet.push(current);

    var neighbors = current.neighbors;

    for (let i = 0; i < neighbors.length; i++) {
      var neighbor = neighbors[i];
      if (!closeSet.includes(neighbor) && neighbor.s !== "wall") {
        var tempG = current.g + 1;
        if (openSet.includes(neighbor)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG;
          }
        } else {
          neighbor.g = tempG;
          neighbor.s = "needCheck";
          openSet.push(neighbor);
        }
        neighbor.cameFrom = current;
        neighbor.h = heuristic(neighbor, end);
        neighbor.f = neighbor.h + neighbor.g;

        // if (tempG < neighbor.g) {
        //   neighbor.g = tempG;
        //   neighbor.cameFrom = current;
        //   neighbor.h = heuristic(neighbor, end);
        //   neighbor.f = neighbor.h + neighbor.g;
        //   if (!openSet.includes(neighbor)) {
        //     openSet.push(neighbor);
        //   }
        // }
      }
    }
  }
  console.log("No Path Found!");
  return path;
}
export default AStar;
