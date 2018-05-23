import React from 'react';
import './index.css';

const Prompt = (props) => {
  function handleKeyPress(event) {
    if (event.key ==='Enter') {
      props.handleJoinGame(event.target.value);
    }
  }

  return (
      <div className="prompt">
        <p>Enter Game ID</p>
        <input className="game-id" type="text" onKeyPress={handleKeyPress}/>
        <p>or</p>
        <p className="start-new" onClick={props.onClick}>Start New Game</p>
      </div>
  );
};

export default Prompt;
