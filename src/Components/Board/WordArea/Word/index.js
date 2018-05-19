import React from 'react';
import Tile from '../../Tile';
import './index.css';

const Word = (props) => {
  return (
    <div className="word">
      <ul>
        {props.letters.split('').map((letter, i) => {
            return (
              <Tile
                tileLetter={letter.toUpperCase()}
                key={letter.toUpperCase() + i + 'Word' + props.key}
              />
            );
          })
        }
      </ul>
    </div>
  );
};

export default Word;
