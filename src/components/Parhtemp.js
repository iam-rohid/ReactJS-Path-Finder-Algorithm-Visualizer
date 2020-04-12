import React, { Component } from "react";

import { AStar } from "../Algorithms/AStar";

export class PathFindingVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adding: "wall",
      startPos: [0, 0],
      goalPos: [5, 5],
      girdHeight: 500,
      girdWidth: 500,
      cellSize: 60,
      grid: [],
    };
  }

  // Set grid
  setGrid() {
    var newGrid = [];
    var coll = this.state.girdHeight / this.state.cellSize;
    var row = this.state.girdWidth / this.state.cellSize;
    for (let i = 0; i < coll; i++) {
      var gridColl = [];
      for (let j = 0; j < row; j++) {
        var obj = {
          position: [i, j],
          start: false,
          goal: false,
          wall: false,
          short: false,
        };
        if (this.state.startPos[0] === i && this.state.startPos[1] === j) {
          obj.start = true;
        } else if (this.state.goalPos[0] === i && this.state.goalPos[1] === j) {
          obj.goal = true;
        }
        gridColl.push(obj);
      }
      newGrid.push(gridColl);
    }
    this.setState({
      grid: newGrid,
    });
  }

  // Add wall on click
  AddWallOrRemove(event, x, y) {
    var newGrid = this.state.grid;
    if (this.state.adding === "wall" && !newGrid[x][y].start && !newGrid[x][y].goal) {
      newGrid[x][y].wall = !newGrid[x][y].wall;
      this.setState({ grid: newGrid });
    } else if (this.state.adding === "start" && !newGrid[x][y].wall && !newGrid[x][y].goal) {
      if (this.state.startPos && (this.state.startPos[0] !== x || this.state.startPos[1] !== y)) {
        newGrid[this.state.startPos[0]][this.state.startPos[1]].start = false;
      }
      newGrid[x][y].start = true;
      this.setState({
        grid: newGrid,
        startPos: [x, y],
      });
    } else if (this.state.adding === "goal" && !newGrid[x][y].wall && !newGrid[x][y].start) {
      if (this.state.goalPos && (this.state.goalPos[0] !== x || this.state.goalPos[1] !== y)) {
        newGrid[this.state.goalPos[0]][this.state.goalPos[1]].goal = false;
      }
      newGrid[x][y].goal = true;
      this.setState({
        grid: newGrid,
        goalPos: [x, y],
      });
    }
  }

  // Random Wall generator
  generateRandomWall() {
    var newGrid = this.state.grid;
    for (let i = 0; i < newGrid.length; i++) {
      for (let j = 0; j < newGrid[i].length; j++) {
        newGrid[i][j].wall = false;
        newGrid[i][j].short = false;
      }
    }
    var wallnumber =
      ((this.state.girdWidth / this.state.cellSize) *
        (this.state.girdWidth / this.state.cellSize)) /
      2;
    for (let i = 0; i < wallnumber; i++) {
      var x = Math.floor(Math.random() * (this.state.girdHeight / this.state.cellSize));
      var y = Math.floor(Math.random() * (this.state.girdWidth / this.state.cellSize));
      if (!newGrid[x][y].start && !newGrid[x][y].goal) {
        newGrid[x][y].wall = true;
      }
    }
    this.setState({ grid: newGrid });
  }

  // Calling A* pathfinding algorithm
  CallAStar() {
    AStar();
  }

  // Style for cells
  cellStyle(e) {
    var bgColor = "white";
    if (e.start) {
      bgColor = "rgb(0,0,255)";
    } else if (e.goal) {
      bgColor = "rgb(255,0,0)";
    } else if (e.wall) {
      bgColor = "rgb(0,0,0)";
    } else if (e.short) {
      bgColor = "rgb(0,255,0)";
    } else {
      bgColor = "#fff";
    }
    return {
      width: `${this.state.cellSize}px`,
      height: `${this.state.cellSize}px`,
      backgroundColor: `${bgColor}`,
    };
  }

  componentDidMount() {
    this.setGrid();
  }

  render() {
    return (
      <div className="main-wrapper">
        <div className="side-bar">
          <button
            className={`btn ${this.state.adding === "wall" ? "active" : ""}`}
            onClick={(event) => {
              this.setState({ adding: "wall" });
            }}
          >
            Add or Remove Walls
          </button>
          <button
            className="btn"
            onClick={(event) => {
              this.generateRandomWall();
            }}
          >
            Add Random Walls
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
          </button>
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
            {this.state.grid.map((coll, x) => {
              return (
                <div className="column" key={x}>
                  {coll.map((e, y) => {
                    return (
                      <div
                        key={y}
                        className="cell"
                        id={`${x}${y}`}
                        style={this.cellStyle(e)}
                        onClick={(event) => {
                          this.AddWallOrRemove(event, x, y);
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
