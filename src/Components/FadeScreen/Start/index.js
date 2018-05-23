import React from 'react';
import './index.css';

const Start = (props) => {
  return (
      <div className="start" onClick={props.onClick}>
        Start
        <span className="press-enter">(Press Enter)</span>
      </div>
  );
};

export default Start;
