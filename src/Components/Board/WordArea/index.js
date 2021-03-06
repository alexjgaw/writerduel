import React from 'react';
import Word from './Word';
import './index.css';

const WordArea = (props) => {
  return (
    <div className="word-area">
        {(!props.words) ?
          null :
          props.words.map((word, i) => {
            return (
              <Word
                letters={word.value}
                key={word.value.toUpperCase() + i + 'WordArea'}
                extraKey={word.value.toUpperCase() + i + 'WordArea'}
              />
            );
          })
        }
    </div>
  );
};

export default WordArea;
