import React from 'react';
import './index.css';

import Start from './Start';
import Prompt from './Prompt';

const FadeScreen = (props) => {
  if (props.gameState === 'waiting') {
    return (
      <div className="fade-screen">
        <Start
          onClick={props.handleStart}
          gameId={props.gameId}
          isCreator={props.isCreator}
          players={props.players}
        />
      </div>
    );
  } else if (props.gameState === 'prompt') {
    return (
      <div className="fade-screen">
        <Prompt
          onClick={props.handleStartNewGame}
          handleJoinGame={props.handleJoinGame}/>
      </div>
    );
  }
};

export default FadeScreen;
