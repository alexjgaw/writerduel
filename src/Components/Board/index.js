import React from 'react';
import TileHome from './TileHome';
import TileStaging from './TileStaging';

import './index.css';

const Board = (props) => {
  return (
    <div className="board">
      <TileHome
        letters={props.letters}
      />
      <TileStaging />
    </div>
  );
};

export default Board;
