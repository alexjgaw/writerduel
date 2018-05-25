import React from 'react';
import WordArea from './WordArea';
import TileHome from './TileHome';
import TileStaging from './TileStaging';
import Clock from './Clock';

import './index.css';

const Board = (props) => {
  return (
    <div className="board">
      <WordArea
        words={props.words}
      />
      <TileHome
        letters={props.letters}
        gameState={props.gameState}
      />
      <TileStaging
        stagingLetters={props.stagingLetters}
      />
      <Clock
        gameState={props.gameState}
        handleGameOver={props.handleGameOver}
      />
    </div>
  );
};

export default Board;
