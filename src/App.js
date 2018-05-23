import React, { Component } from 'react';
import * as firebase from 'firebase';

import Board from './Components/Board';
import FadeScreen from './Components/FadeScreen';

import './App.css';

// Firebase config and initialization
var config = {
    apiKey: process.env.REACT_APP_FIREBASE_API,
    authDomain: "writer-duel.firebaseapp.com",
    databaseURL: "https://writer-duel.firebaseio.com",
    projectId: "writer-duel",
    storageBucket: "writer-duel.appspot.com",
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID
  };
  firebase.initializeApp(config);

  // TODO: this will have to move once I set up the "start new game" functionality so the path isn't hardcoded
  const FB_GAMES = firebase.database().ref('games');
  const FB_GAME_STATE = firebase.database().ref(`games/game1/gameState`);
  const FB_LETTERS = firebase.database().ref(`games/game1/letters`);
  const FB_WORDS = firebase.database().ref(`games/game1/words`);

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
      gameId: '',
      gameState: 'prompt',
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
    FB_WORDS.on('value', (snapshot) => {
      console.log(snapshot.val());
      this.setState({
        words: Object.values(snapshot.val())
      });
    });
  }

  handleStart() {
    // TODO: move ref path to variable
    firebase.database().ref('games/game1').update({
      'gameState' : 'playing'
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
      FB_WORDS.push().set({
        'value' : word,
        'user' : 'Alex'
      })
    }
    this.setState({
      letters: this.state.letters.concat(this.state.stagingLetters),
      stagingLetters: ''
    });
  }

  handleKeyUp(event) {
    console.log(event.key);
    if (this.state.gameState === 'waiting' && event.key === 'Enter') {
      this.handleStart();
    } else if (this.state.gameState === 'playing' && event.key === 'Escape') {
      firebase.database().ref('games/game1').update({
        'gameState' : 'prompt'
      });
    } else if (this.state.gameState === 'playing' && this.state.stagingLetters && event.key === 'Backspace') {
      this.setState({
        letters: this.state.letters + this.state.stagingLetters[this.state.stagingLetters.length - 1],
        stagingLetters: this.state.stagingLetters.substring(0,this.state.stagingLetters.length - 1)
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

  handleJoinGame(game) {
    console.log('in the function');
    FB_GAMES.once('value').then(snapshot => {
      if (snapshot.val()[game]) {
        this.setState({
          gameId: game
        });
      }
    });
  }

  render() {
    return (
      <div className="App" onKeyUp={this.handleKeyUp.bind(this)} tabIndex="0">
        {this.state.gameState !== 'playing' &&
          <FadeScreen
            handleStart={this.handleStart.bind(this)}
            handleJoinGame={this.handleJoinGame.bind(this)}
            gameState={this.state.gameState}
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
