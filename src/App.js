import React, { Component } from 'react';

import Start from './Components/Start';

import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameState: 'waiting'
    };
  }

  handleStart() {
    this.setState({
      gameState: 'playing'
    });
  }

  handleEnter(event) {
    if (event.key === 'Enter') {
      this.setState({
        gameState: 'playing'
      });
    }
  }

  render() {
    return (
      <div className="App" onKeyUp={this.handleEnter.bind(this)} tabIndex="0">
        {this.state.gameState === 'waiting' &&
          <Start
            onClick={this.handleStart.bind(this)}
          />
        }
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>

      </div>
    );
  }
}

export default App;
