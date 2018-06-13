import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/database';
import { isWord } from './modules/scrabble-checker';

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

const FB_GAMES = firebase.database().ref('games');
const FB_LASTID = firebase.database().ref('lastId');

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

// Create a string with 9 random letters with at least 2 vowels and at least 2 consonants
function getLetters() {
  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
  }

  function countFrom(str, from) {
    if(typeof str !== 'string') {
      return false;
    }

    const pattern = new RegExp('[' + from + ']', 'g');
    const matches = str.match(pattern);
    return matches !== null? matches.length:0;
  }

  const vowels = 'AEIOU';
  const consonants = 'QWRTYPSDFGHJKLZXCVBNM';
  let str = '';

  for (let i = 1; i <= 9; i++) {
    let index = getRandomIntInclusive(0,25);
    str += consonants.concat(vowels)[index];
  }
  return countFrom(str, vowels) >= 2 && countFrom(str, consonants) >= 2 ? str : getLetters();
}

// Create current shareId from lastId
function createId(id) {
  const letters = id.replace(/\d/g, '');
  const digits = +id.replace(/\D/g, '') + 1;
  return letters + digits.toString().padStart(6, '0');
}

class App extends Component {
  constructor(props) {
    super(props);
    this.appRef = React.createRef();
    this.focusApp = this.focusApp.bind(this);
    this.state = {
      gameId: '',
      shareId: '',
      gameState: 'prompt',
      letters: '',
      stagingLetters: '',
      userName: '',
      playerKey: '',
      isCreator: false,
      players: [],
      words: []
    };
  }

  componentDidMount() {
    FB_LASTID.once('value').then(snapshot => {
      this.setState({
        shareId : createId(snapshot.val() || 'g000001')
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.gameState !== 'playing' && this.state.gameState === 'playing') {
      this.focusApp();
    }
  }

  handleJoinGame(game, user) {
    // Look for a game with shareId equal to game parameter
    FB_GAMES.orderByChild('shareId').equalTo(game).once('value').then(snapshot => {
      const gameId = snapshot.val() && Object.keys(snapshot.val())[0];
      if (gameId) {
        // check if user name is taken
        const userNames = Object.values(snapshot.val()[gameId].players);
        const userMatches = userNames.filter(obj => obj.name === user);
        const userNameFree = userMatches.length === 0;
        if (!userNameFree) {
          alert('That screen name is taken in that game.');
          return;
        }
        // if not taken, add info to local state
        this.setState({
          gameId,
          userName: user
        });
        // add player to database and save key locally
        const playerRef = FB_GAMES.child(`${gameId}/players`).push();
        playerRef.set({
          'creator': 'false',
          'name': user,
          'score': '0'
        });
        this.setState({
          playerKey: playerRef.key
        });
        this.handleSubscribe(gameId);
      } else {
        alert('That game does not exist');
      }
    });
  }

  handleStartNewGame(user) {
    const gameRef = FB_GAMES.push();
    gameRef.set({
      'gameState' : 'waiting',
      'shareId' : this.state.shareId,
      'letters' : getLetters(),
      'players' : {
        [user] : {
          'creator' : 'true',
          'name' : user,
          'score' : '0'
        }
      },
      'words' : ''
    });
    FB_LASTID.set(this.state.shareId);
    this.setState({
      gameId: gameRef.key,
      playerKey: user,
      isCreator: true
    });
    this.handleSubscribe(gameRef.key);
  }

  handleStart() {
    FB_GAMES.child(this.state.gameId).update({
      'gameState' : 'playing'
    });
  }

  handleGameOver() {
    FB_GAMES.child(this.state.gameId).update({
      'gameState' : 'over'
    });
  }

  handleSubscribe(game) {
    FB_GAMES.child(`${game}/gameState`).on('value', (snapshot) => {
      this.setState({
        gameState: snapshot.val()
      });
    });
    FB_GAMES.child(`${game}/letters`).on('value', (snapshot) => {
      this.setState({
        letters: snapshot.val()
      });
    });
    FB_GAMES.child(`${game}/words`).on('value', (snapshot) => {
      this.setState({
        words: Object.values(snapshot.val())
      });
    });
    FB_GAMES.child(`${game}/players`).on('value', (snapshot) => {
      this.setState({
        players: Object.values(snapshot.val())
      })
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
    const word = this.state.stagingLetters;
    const validWord = isWord(word);
    const isUsed = this.state.words.filter(obj => obj.value === word).length > 0;
    if (word && !isUsed && validWord) {
      FB_GAMES.child(`${this.state.gameId}/words`).push().set({
        'value' : word,
        'user' : this.state.userName
      });
      // keep score
      let newScore = word.length;
      FB_GAMES.child(`${this.state.gameId}/players/${this.state.playerKey}/score`).once('value', snap => {
        newScore += parseInt(snap.val(), 10);
      });
      FB_GAMES.child(`${this.state.gameId}/players/${this.state.playerKey}`).update({
        'score' : newScore
      });
    }
    // remove letters from staging
    this.setState({
      letters: this.state.letters.concat(this.state.stagingLetters),
      stagingLetters: ''
    });
  }

  handleKeyUp(event) {
    const key = event.key.toUpperCase();
    if (this.state.gameState === 'waiting' && key === 'ENTER') {
      this.handleStart();
    } else if (this.state.gameState === 'playing' && key === 'ESCAPE') {
      // TODO: Get rid of this else if block when I'm done testing
      FB_GAMES.child(this.state.gameId).update({
        'gameState' : 'prompt'
      });
    } else if (this.state.gameState === 'playing' && this.state.stagingLetters && key === 'BACKSPACE') {
      // remove letter from end of staging
      this.setState({
        letters: this.state.letters + this.state.stagingLetters[this.state.stagingLetters.length - 1],
        stagingLetters: this.state.stagingLetters.substring(0,this.state.stagingLetters.length - 1)
      });
    } else if (this.state.gameState === 'playing' && key === 'ENTER') {
      this.submitWord();
    } else if (this.state.gameState === 'playing' && key === ' ') {
      this.setState({
        letters: shuffle(this.state.letters.split('')).join('')
      });
    } else if (this.state.gameState === 'playing' && this.state.letters.indexOf(key) !== -1) {
      this.moveToStaging(key);
    }
  }

  focusApp() {
    this.appRef.current.focus();
  }

  render() {
    return (
      <div
        className="App"
        onKeyUp={this.handleKeyUp.bind(this)}
        tabIndex="0"
        ref={this.appRef}
      >
        {this.state.gameState !== 'playing' &&
          <FadeScreen
            handleStartNewGame={this.handleStartNewGame.bind(this)}
            handleStart={this.handleStart.bind(this)}
            handleJoinGame={this.handleJoinGame.bind(this)}
            gameState={this.state.gameState}
            shareId={this.state.shareId}
            isCreator={this.state.isCreator}
            players={this.state.players}
          />
        }
        <Board
          letters={this.state.letters}
          stagingLetters={this.state.stagingLetters}
          words={this.state.words}
          gameState={this.state.gameState}
          handleGameOver={this.handleGameOver.bind(this)}
        />

      </div>
    );
  }
}

export default App;
