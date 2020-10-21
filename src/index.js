import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";
const boardSize = 3;

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

function Board(props) {
  const renderSquare = (i) => {
    if (
      props.winLine &&
      (i === props.winLine[0] ||
        i === props.winLine[1] ||
        i === props.winLine[2])
    ) {
      return (
        <Square
          value={props.squares[i]}
          onClick={() => props.onClick(i)}
          winLine={true}
        />
      );
    }
    return (
      <Square
        value={props.squares[i]}
        onClick={() => props.onClick(i)}
        winLine={false}
      />
    );
  };

  const render = () => {
    let i;
    let j;
    var col = [];
    var row = [];
    for (i = 0; i < boardSize; i++) {
      for (j = 0; j < boardSize; j++) {
        col.push(renderSquare(boardSize * i + j));
      }
      row.push(<div className="board-row">{col}</div>);
      col = [];
    }
    return <div>{row}</div>;
  };

  return render();
}

function Game() {
  const squares = Array(9).fill(null);
  const moves = [];
  const [history, setHistory] = useState([{ squares, moves }]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [isAcscending, setIsAcscending] = useState(true);

  const handleClick = (i) => {
    const newHistory = history.slice(0, stepNumber + 1);
    const current = newHistory[newHistory.length - 1];
    const squares = current.squares.slice();
    const moves = current.moves.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = xIsNext ? "X" : "O";
    moves.push(i);

    setHistory(newHistory.concat({ squares, moves }));
    setStepNumber(newHistory.length);
    setXIsNext(!xIsNext);
  };

  const jumpTo = (step) => {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  };

  const render = () => {
    const current = history[stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move
        ? "Go to move #" +
          move +
          "(" +
          (step.moves[move - 1] % boardSize) +
          ", " +
          parseInt(step.moves[move - 1] / boardSize) +
          ")"
        : "Go to game start";
      if (move === stepNumber) {
        return (
          <li key={move}>
            <button onClick={() => jumpTo(move)} style={{ fontWeight: "bold" }}>
              {desc}
            </button>
          </li>
        );
      }
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{desc}</button>
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
        status = "next player: " + (xIsNext ? "X" : "O");
      }
    }
    let list;
    if (isAcscending) {
      list = <ol>{moves}</ol>;
    } else {
      list = <ol>{moves.reverse()}</ol>;
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => handleClick(i)}
            winLine={winner}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button
            onClick={() => {
              setIsAcscending(!isAcscending);
            }}
          >
            Reverse Sort
          </button>
          {list}
        </div>
      </div>
    );
  };
  return render();
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
