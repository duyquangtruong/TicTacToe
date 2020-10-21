import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  if (props.winLine) {
    return (
      <button
        className="square"
        style={{ color: "red" }}
        onClick={props.onClick}
      >
        {props.value}
      </button>
    );
  }
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    if (
      this.props.winLine &&
      (i === this.props.winLine[0] ||
        i === this.props.winLine[1] ||
        i === this.props.winLine[2])
    ) {
      return (
        <Square
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
          winLine={true}
        />
      );
    }
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        winLine={false}
      />
    );
  }

  render() {
    let i;
    let j;
    var col = [];
    var row = [];
    for (i = 0; i < 3; i++) {
      for (j = 0; j < 3; j++) {
        col.push(this.renderSquare(3 * i + j));
      }
      row.push(<div className="board-row">{col}</div>);
      col = [];
    }
    return <div>{row}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          moves: [],
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      isAcscending: true,
    };
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const moves = current.moves.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    moves.push(i);
    this.setState({
      history: history.concat([
        {
          squares: squares,
          moves: moves,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move
        ? "Go to move #" +
          move +
          "(" +
          (step.moves[move - 1] % 3) +
          ", " +
          parseInt(step.moves[move - 1] / 3) +
          ")"
        : "Go to game start";
      if (move === this.state.stepNumber) {
        return (
          <li key={move}>
            <button
              onClick={() => this.jumpTo(move)}
              style={{ fontWeight: "bold" }}
            >
              {desc}
            </button>
          </li>
        );
      }
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + current.squares[winner[0]];
    } else {
      if (current.squares.some((x) => x === null) === false) {
        status = "Draw";
      } else {
        status = "next player: " + (this.state.xIsNext ? "X" : "O");
      }
    }
    let list;
    if (this.state.isAcscending) {
      list = <ol>{moves}</ol>;
    } else {
      list = <ol>{moves.reverse()}</ol>;
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winLine={winner}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button
            onClick={() => {
              this.setState({
                isAcscending: !this.state.isAcscending,
              });
            }}
          >
            Reverse Sort
          </button>
          {list}
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
