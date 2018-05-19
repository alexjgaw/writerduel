import React from 'react';
import './index.css';

const Tile = (props) => {
  return (
    <li className="tile">
      <p>{props.tileLetter}</p>
    </li>
  );
};

export default Tile;
