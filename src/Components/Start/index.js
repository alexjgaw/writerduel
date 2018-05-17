import React from 'react';
import './index.css';

const Start = (props) => {
  return (
    <div className="fade-screen">
      <a className="start" onClick={props.onClick}>
        Start
        <span className="press-enter">(Press Enter)</span>
      </a>
    </div>
  );
};

export default Start;
