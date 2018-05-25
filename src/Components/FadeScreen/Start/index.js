import React from 'react';
import './index.css';

const Start = (props) => {
  const copyToClipBoard = () => {
    const textField = document.createElement('textarea');
    textField.innerText = props.gameId;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
    alert('ID copied to clipboard!');
  };

  if (props.players.length >= 2 && props.isCreator) {
    return (
        <div className="start" onClick={props.onClick}>
          Start
          <span className="press-enter">(Click or Press Enter)</span>
        </div>
    );
  } else if (props.players.length >= 2 && !props.isCreator) {
    return (
        <div className="start waiting-creator">
          Waiting for Creator to start game
        </div>
    );
  } else {
    return (
        <div className="start" onClick={copyToClipBoard}>
          Waiting for other player
          <span className="press-enter">Click to copy Game ID: {props.gameId}</span>
        </div>
    );
  }
};

export default Start;
