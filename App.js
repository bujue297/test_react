import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board-row">
        {[...Array(15).keys()].map((i) => (
          <Square
            key={i}
            value={squares[i]}
            onSquareClick={() => handleClick(i)}
          />
        ))}
      </div>
      {[...Array(14).keys()].map((i) => (
        <div className="board-row" key={i}>
          {[...Array(15).keys()].map((j) => (
            <Square
              key={j}
              value={squares[i * 15 + j]}
              onSquareClick={() => handleClick(i * 15 + j)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(225).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <button key={move} onClick={() => jumpTo(move)}>
        {description}
      </button>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <div>{moves}</div>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [];
  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 15; j++) {
      lines.push([
        i * 15 + j,
        i * 15 + j + 4,
        i * 15 + j + 8,
        i * 15 + j + 12,
        i * 15 + j + 16,
      ]);
      lines.push([
        j * 15 + i,
        j * 15 + i + 15,
        j * 15 + i + 30,
        j * 15 + i + 45,
        j * 15 + i + 60,
      ]);
    }
    lines.push([0 + i, 15 + i, 30 + i, 45 + i, 60 + i]); // horizontal
    lines.push([
      15 * 14 + i,
      15 * 13 + i,
      15 * 12 + i,
      15 * 11 + i,
      15 * 10 + i,
    ]); // horizontal
  }
  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 15; j++) {
      lines.push([
        i * 15 + j,
        (i + 1) * 15 + (j + 4),
        (i + 2) * 15 + (j + 8),
        (i + 3) * 15 + (j + 12),
        (i + 4) * 15 + (j + 16),
      ]);
      lines.push([
        (i + 4) * 15 + j,
        (i + 3) * 15 + (j + 4),
        (i + 2) * 15 + (j + 8),
        (i + 1) * 15 + (j + 12),
        i * 15 + (j + 16),
      ]);
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c, d, e] = lines[i];
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c] &&
      squares[a] === squares[d] &&
      squares[a] === squares[e]
    ) {
      return squares[a];
    }
  }
  return null;
}
