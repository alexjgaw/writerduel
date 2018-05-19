import React from 'react';
import Tile from '../Tile';
import './index.css';

const TileHome = (props) => {
  return (
    <div className="tile-home">
      <ul>
        {(!props.letters) ?
          <li>No letters, scuzzball.</li> :
          props.letters.split('').map((letter, i) => {
            return (
              <Tile
                tileLetter={letter.toUpperCase()}
                key={letter.toUpperCase() + i + 'TileHome'}
              />
            );
          })
        }
      </ul>
    </div>
  );
};

export default TileHome;
