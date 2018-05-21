import React from 'react';
import './index.css';
import lock from './lock.svg';

//https://fontawesome.com/license

const Tile = (props) => {
  return (
    <li className="tile">
      <p>{ (props.gameState === 'waiting') ?
          <img src={lock} alt="Locked"/> :
          props.tileLetter
      }</p>
    </li>
  );
};

export default Tile;
