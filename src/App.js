import React, { Component } from 'react';
import * as firebase from 'firebase';

import Start from './Components/Start';
import Board from './Components/Board';

import './App.css';

var config = {
    apiKey: process.env.REACT_APP_FIREBASE_API,
    authDomain: "writer-duel.firebaseapp.com",
    databaseURL: "https://writer-duel.firebaseio.com",
    projectId: "writer-duel",
    storageBucket: "writer-duel.appspot.com",
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID
  };
  firebase.initializeApp(config);
  const FB_GAME_STATE = firebase.database().ref('gameState');
  const FB_LETTERS = firebase.database().ref('letters');

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
      gameState: '',
      letters: '',
      stagingLetters: '',
      words: []
    };
  }

  componentDidMount() {
    FB_GAME_STATE.on('value', (snapshot) => {
      this.setState({
        gameState: snapshot.val()
      });
    });
    FB_LETTERS.on('value', (snapshot) => {
      this.setState({
        letters: snapshot.val()
      });
    });
  }

  handleStart() {
    firebase.database().ref().update({
      'gameState' : 'playing'
    });
    // this.setState({
    //   gameState: 'playing'
    // });
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
          gameState={this.state.gameState}
        />

      </div>
    );
  }
}

export default App;
