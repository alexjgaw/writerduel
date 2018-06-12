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
          shareId={props.shareId}
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
  } else if (props.gameState === 'over') {
    return (
      <div className="fade-screen">
        <h1>GAME OVER</h1>
        <ul>
          {Object.values(props.players).map((player, i) => {
            return (
              <li key={i + 'score'}>{player.name} : {player.score}</li>
            );
          })}
        </ul>
      </div>
    );
  }
};

export default FadeScreen;
