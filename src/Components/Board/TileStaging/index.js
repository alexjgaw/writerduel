import React from 'react';
import Tile from '../Tile';
import './index.css';

const TileStaging = (props) => {
  return (
    <div className="tile-staging">
      <ul>
        {(!props.stagingLetters) ?
          null :
          props.stagingLetters.split('').map((letter, i) => {
            return (
              <Tile
                tileLetter={letter.toUpperCase()}
                key={letter.toUpperCase() + i + 'TileStaging'}
              />
            );
          })
        }
      </ul>
    </div>
  );
};

export default TileStaging;
