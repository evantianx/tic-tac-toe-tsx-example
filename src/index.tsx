import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css';

type SquareValue = 'X' | 'O' | null;

interface SquareProps {
  value: SquareValue;
  onClick(): void;
}

interface BoardProps {
  onClick(i: number): void;
  squares: SquareValue[];
}

const calculateWinner = (squares: SquareValue[]): SquareValue => {
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
      return squares[a];
    }
  }
  return null;
};

const Square: React.FC<SquareProps> = props => (
  <button className='square' onClick={props.onClick}>
    {props.value}
  </button>
);

const Board: React.FC<BoardProps> = ({ squares, onClick }) => {
  const renderSquare = (i: number): React.ReactNode => (
    <Square value={squares[i]} onClick={() => onClick(i)} />
  );

  return (
    <div>
      <div className='board-row'>
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className='board-row'>
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className='board-row'>
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
};

const Game: React.FC = () => {
  const [xIsNext, setXIsNext] = React.useState<boolean>(true);
  const [stepNumber, setStepNumber] = React.useState<number>(0);
  const [history, setHistory] = React.useState<{ squares: SquareValue[] }[]>([
    {
      squares: Array(9).fill(null),
    },
  ]);

  const handleClick = (i: number): void => {
    const newHistory = history.slice(0, stepNumber + 1);
    const current = newHistory[newHistory.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = xIsNext ? 'X' : 'O';
    setXIsNext(!xIsNext);
    setStepNumber(newHistory.length);
    setHistory(
      newHistory.concat([
        {
          squares: squares,
        },
      ]),
    );
  };

  const jumpTo = (step: number): void => {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  };

  const current = history[stepNumber];
  const winner = calculateWinner(current.squares);

  const moves = history.map((step, move) => {
    const desc = move ? 'Go to move #' + move : 'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <div className='game'>
      <div className='game-board'>
        <Board squares={current.squares} onClick={i => handleClick(i)} />
      </div>
      <div className='game-info'>
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
};

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));
