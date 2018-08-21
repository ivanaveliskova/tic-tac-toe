import React, { Component, Fragment } from "react";
import "./App.css";

import classNames from "classnames";

const winningCombinations = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
  [1, 5, 9],
  [3, 5, 7]
];

class Board extends Component {
  state = {
    currentPlayer: "",
    gameBoard: [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
    winner: "",
    ex: [],
    oh: [],
    moveNumber: 0,
    tie: false
  };

  pushToStateArray = (arrayName, value) => {
    this.setState(prevState => {
      return prevState[arrayName].push(value);
    });
  };

  setInitialPlayer = value => {
    this.setState({ currentPlayer: value });
  };

  switchPlayer = () => {
    this.setState(prevState => {
      const { currentPlayer } = prevState;
      if (!currentPlayer) {
        return;
      }
      const newState = currentPlayer === "ex" ? "oh" : "ex";
      return (prevState.currentPlayer = newState);
    });
  };

  checkForWinner = () => {
    const { moveNumber, currentPlayer } = this.state;

    if (moveNumber < 5) {
      this.switchPlayer();
      return;
    }

    const sorted = this.state[currentPlayer].sort();
    let winner = false;
    winningCombinations.forEach(combination => {
      winner = combination.every(item => {
        return sorted.includes(item);
      });
    });
    if (winner) {
      this.setState(prevState => (prevState.winner = currentPlayer));
    } else if (moveNumber === 9) {
      this.setState(prevState => (prevState.winner = "tie"));
      this.setState(prevState => (prevState.tie = true));
    } else {
      this.switchPlayer();
    }
  };

  resetGame = () => {
    this.setState({ currentPlayer: "", moveNumber: 0, winner: "", tie: false });
  };

  increaseMoveNumber = () => {
    this.setState(prevState => prevState.moveNumber++, this.checkForWinner);
  };

  render() {
    const { currentPlayer, gameBoard, winner, tie } = this.state;
    const toggleInitialPlayer =
      currentPlayer === "" ? (
        <InitialPlayerSelector setInitialPlayer={this.setInitialPlayer} />
      ) : null;

    let currentPlayerNormal = null;
    let winnerNormal = "";

    if (currentPlayer.length) {
      currentPlayerNormal = currentPlayer === "ex" ? "x" : "o";
    }

    if (tie) {
      winnerNormal = winner;
    } else if (winner.length) {
      winnerNormal = winner === "ex" ? "x" : "o";
    }

    return (
      <div className="Board">
        <p className="currentPlayer">Current player: {currentPlayerNormal}</p>
        <GameBoard
          gameBoard={gameBoard}
          currentPlayer={currentPlayer}
          addToPlayerArray={this.pushToStateArray}
          increaseMoveNumber={this.increaseMoveNumber}
        />
        <div className="toggle">{toggleInitialPlayer}</div>
        <div className="winner">Winner: {winnerNormal}</div>
        <button className="reset" onClick={this.resetGame}>
          Reset game
        </button>
      </div>
    );
  }
}

class GameBoard extends Component {
  render() {
    const {
      gameBoard,
      currentPlayer,
      addToPlayerArray,
      increaseMoveNumber
    } = this.props;

    const gameBlocks = gameBoard.map((row, index) => {
      return row.map((block, i) => {
        return (
          <GameBlock
            key={`${index}-${i}`}
            value={block}
            currentPlayer={currentPlayer}
            addToPlayerArray={addToPlayerArray}
            increaseMoveNumber={increaseMoveNumber}
          />
        );
      });
    });

    return <div className="GameBoard">{gameBlocks}</div>;
  }
}

class GameBlock extends Component {
  state = {
    blockContent: ""
  };

  componentDidUpdate(prevProps) {
    if (this.props.currentPlayer === "" && prevProps.currentPlayer !== "") {
      this.setState({ blockContent: "" });
    }
  }

  handleClick = () => {
    const {
      currentPlayer,
      addToPlayerArray,
      value,
      increaseMoveNumber
    } = this.props;
    const { blockContent } = this.state;

    if (!currentPlayer || blockContent) {
      return;
    }
    const pieceValue = currentPlayer === "ex" ? "X" : "O";

    this.setState({
      blockContent: (
        <PlayingPiece
          className={`TTT__playing-piece-${currentPlayer}`}
          value={pieceValue}
        />
      )
    });
    addToPlayerArray(currentPlayer, value);
    increaseMoveNumber();
  };

  render() {
    const { blockContent } = this.state;

    return (
      <div className="GameBlock" onClick={this.handleClick}>
        {blockContent}
      </div>
    );
  }
}

class InitialPlayerSelector extends Component {
  state = {
    selectedPlayer: "ex"
  };

  setPlayer = () => {
    const { setInitialPlayer } = this.props;
    const { selectedPlayer } = this.state;

    setInitialPlayer(selectedPlayer);
  };

  handleChange = event => {
    this.setState({
      selectedPlayer: event.target.value
    });
  };

  render() {
    const { selectedPlayer } = this.state;
    return (
      <Fragment>
        <button onClick={this.setPlayer}>Select Initial Player</button>
        <div>
          <label htmlFor="ex">
            <PlayingPiece className="TTT__playing-piece-ex" value="X" />
          </label>
          <input
            type="radio"
            name="player"
            value="ex"
            id="ex"
            checked={selectedPlayer === "ex"}
            onChange={this.handleChange}
          />
        </div>
        <div>
          <label htmlFor="oh">
            <PlayingPiece className="TTT__playing-piece-oh" value="O" />
          </label>
          <input
            type="radio"
            name="player"
            value="oh"
            id="oh"
            checked={selectedPlayer === "oh"}
            onChange={this.handleChange}
          />
        </div>
      </Fragment>
    );
  }
}

class PlayingPiece extends Component {
  render() {
    const { className, value } = this.props;

    const cn = classNames("TTT__playing-piece", className);
    return <div className={cn}>{value}</div>;
  }
}

export default Board;
