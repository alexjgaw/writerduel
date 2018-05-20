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
      letters: 'scuzzball',
      stagingLetters: '',
      words: []
    };
  }

  handleStart() {
    this.setState({
      gameState: 'playing'
    });
  }

  moveToStaging(letter) {
    let newLetters = this.state.letters;
    newLetters = newLetters.substring(0, newLetters.indexOf(letter)) + newLetters.substring(newLetters.indexOf(letter) + 1);
    this.setState({
      letters: newLetters,
      stagingLetters: this.state.stagingLetters.concat(letter)
    });
  }

  submitWord() {
    let word = this.state.stagingLetters;
    if (word && this.state.words.indexOf(word) === -1) {
      this.setState({
        words: this.state.words.concat([word])
      });
    }
    this.setState({
      letters: this.state.letters.concat(this.state.stagingLetters),
      stagingLetters: ''
    });
  }

  handleKeyUp(event) {
    console.log(event.key);
    if (this.state.gameState === 'waiting' && event.key === 'Enter') {
      this.setState({
        gameState: 'playing'
      });
    } else if (this.state.gameState === 'playing' && event.key === 'Enter') {
      this.submitWord();
    } else if (this.state.gameState === 'playing' && event.key === ' ') {
      this.setState({
        letters: shuffle(this.state.letters.split('')).join('')
      });
    } else if (this.state.gameState === 'playing' && this.state.letters.indexOf(event.key) !== -1) {
      this.moveToStaging(event.key);
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
          stagingLetters={this.state.stagingLetters}
          words={this.state.words}
        />

      </div>
    );
  }
}

export default App;
