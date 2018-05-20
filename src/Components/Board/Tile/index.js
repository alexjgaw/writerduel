import React from 'react';
import './index.css';
import lock from './lock.svg';

//https://fontawesome.com/license

const Tile = (props) => {
  return (
    <li className="tile">
      <p>{ (props.gameState === 'playing') ?
          props.tileLetter :
          <img src={lock} alt="Locked"/>
      }</p>
    </li>
  );
};

export default Tile;
