import React, { Component } from 'react';

import Start from './Components/Start';
import Board from './Components/Board';

import './App.css';

//thank you stackoverflow
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameState: 'waiting',
      letters: 'scuzzball'
    };
  }

  handleStart() {
    this.setState({
      gameState: 'playing'
    });
  }

  handleKeyUp(event) {
    console.log(event.key);
    if (event.key === 'Enter') {
      this.setState({
        gameState: 'playing'
      });
    } else if (event.key === ' ') {
      this.setState({
        letters: shuffle(this.state.letters.split('')).join('')
      });
    }
  }

  render() {
    return (
      <div className="App" onKeyUp={this.handleKeyUp.bind(this)} tabIndex="0">
        {this.state.gameState === 'waiting' &&
          <Start
            onClick={this.handleStart.bind(this)}
          />
        }
        <Board
          letters={this.state.letters}
        />

      </div>
    );
  }
}

export default App;
