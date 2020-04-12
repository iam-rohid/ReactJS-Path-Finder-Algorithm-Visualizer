import React, { Component } from "react";
import AStar from "../Algorithms/AStar";

var grid = [];

function Node(i, j, a) {
  this.i = i;
  this.j = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.a = a;
  this.s = "normal";
  this.neighbors = [];
  this.cameFrom = undefined;
  this.color = function () {
    if (this.s === "normal") {
      return "#fff";
    } else if (this.s === "wall") {
      return "#999";
    } else if (this.s === "start") {
      return "rgb(0,0,255)";
    } else if (this.s === "end") {
      return "rgb(0,0,255)";
    } else if (this.s === "path") {
      return "rgb(0,255,0)";
    } else if (this.s === "checked") {
      return "rgb(255,0,0)";
    } else if (this.s === "needCheck") {
      return "rgb(0,255,255)";
    }
  };
  this.addNeighbors = function (grid, cols, row) {
    var i = this.i;
    var j = this.j;
    if (i < cols - 1) this.neighbors.push(grid[i + 1][j]);
    if (j < row - 1) this.neighbors.push(grid[i][j + 1]);
    if (i > 0) this.neighbors.push(grid[i - 1][j]);
    if (j > 0) this.neighbors.push(grid[i][j - 1]);
    if (i < cols - 1 && j < row - 1) this.neighbors.push(grid[i + 1][j + 1]);
    if (i < cols - 1 && j > 0) this.neighbors.push(grid[i + 1][j - 1]);
    if (i > 0 && j < row - 1) this.neighbors.push(grid[i - 1][j + 1]);
    if (i > 0 && j > 0) this.neighbors.push(grid[i - 1][j - 1]);
  };
}

export class PathFindingVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cols: 50,
      row: 50,
      gridW: 600,
      gridH: 600,
      grid: [],
      start: undefined,
      end: undefined,
    };
  }

  // set 2d grid
  setGrid() {
    var NodeA = this.state.gridW / this.state.cols;
    var newGrid = this.state.grid;

    for (var i = 0; i < this.state.cols; i++) {
      var row = [];
      for (var j = 0; j < this.state.row; j++) {
        row.push(new Node(i, j, NodeA));
      }
      newGrid.push(row);
    }

    for (var i = 0; i < newGrid.length; i++) {
      for (var j = 0; j < newGrid[i].length; j++) {
        newGrid[i][j].addNeighbors(newGrid, this.state.cols, this.state.row);
      }
    }

    var start = newGrid[0][0];
    var end = newGrid[this.state.cols - 1][this.state.row - 1];
    start.s = "start";
    end.s = "end";
    this.setState(
      {
        grid: newGrid,
        start: start,
        end: end,
      },
      () => {}
    );
  }

  setStartNode(node, s) {
    var newGrid = this.state.grid;
    if (s !== "wall") {
      for (var i = 0; i < this.state.grid.length; i++) {
        for (var j = 0; j < this.state.grid[i].length; j++) {
          if (newGrid[i][j].s === s) {
            newGrid[i][j].s = "normal";
          }
        }
      }
    }
    if (node.s === "normal") {
      node.s = s;
    } else if (node.s === s) {
      node.s = "normal";
    }
    if (s === "end") {
      this.setState({ end: node });
    } else if (s === "start") {
      this.setState({ start: node });
    } else if (s === "wall") {
      this.setState({});
    }
  }

  callSetState() {
    this.setState();
  }

  nodeClick(node) {
    this.setStartNode(node, "wall");
  }

  // Random Wall generator
  generateRandomWall() {
    var newGrid = this.state.grid;
    for (let i = 0; i < newGrid.length; i++) {
      for (let j = 0; j < newGrid[i].length; j++) {
        var node = newGrid[i][j];
        if (
          node.s === "wall" ||
          node.s === "path" ||
          node.s === "checked" ||
          node.s === "needCheck"
        ) {
          node.s = "normal";
        }
      }
    }
    var wallnumber = (this.state.cols * this.state.row) / 2;
    for (let i = 0; i < wallnumber; i++) {
      var x = Math.floor(Math.random() * this.state.cols);
      var y = Math.floor(Math.random() * this.state.row);
      if (newGrid[x][y].s !== "start" && newGrid[x][y].s !== "end") {
        newGrid[x][y].s = "wall";
      }
    }
    this.setState({ grid: newGrid });
  }
  // calling a* algorithm
  CallAStar() {
    AStar(this.state.grid, this.state.start, this.state.end);
    this.state.end.s = "end";
    this.state.start.s = "start";
    this.setState({});
  }

  componentDidMount() {
    this.setGrid();
  }

  render() {
    return (
      <div className="main-wrapper">
        <div className="side-bar">
          <button
            className="btn"
            onClick={(event) => {
              this.generateRandomWall();
            }}
          >
            Add Random Walls
          </button>
          {/* <button
            className={`btn ${this.state.adding === "wall" ? "active" : ""}`}
            onClick={(event) => {
              this.setState({ adding: "wall" });
            }}
          >
            Add or Remove Walls
          </button>
          
          <button
            className={`btn ${this.state.adding === "start" ? "active" : ""}`}
            onClick={(event) => {
              this.setState({ adding: "start" });
            }}
          >
            {this.state.startPos === null ? "Add Start Point" : "Change Start Point"}
          </button>
          <button
            className={`btn ${this.state.adding === "goal" ? "active" : ""}`}
            onClick={(event) => {
              this.setState({ adding: "goal" });
            }}
          >
            {this.state.goalPos === null ? "Add End Point" : "Change End Point"}
          </button> */}
          <h3>Algorithms</h3>
          <button
            className="btn"
            onClick={(event) => {
              this.CallAStar();
            }}
          >
            A* Algorithm
          </button>
        </div>
        <div className="wrapper">
          <div className="grid-wrapper">
            {this.state.grid.map((cols, key1) => {
              return (
                <div key={key1} className="cols">
                  {cols.map((row, key2) => {
                    return (
                      <div
                        key={key2}
                        className={`row ${row.s}`}
                        style={{
                          width: `${row.a}px`,
                          height: `${row.a}px`,
                        }}
                        onClick={(event) => {
                          this.nodeClick(row);
                        }}
                      ></div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default PathFindingVisualizer;
