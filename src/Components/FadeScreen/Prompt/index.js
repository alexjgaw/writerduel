import React, { Component } from 'react';
import './index.css';

class Prompt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      gameId: ''
    };
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleStartNewGame = this.handleStartNewGame.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleKeyPress(event) {
    const isComplete = this.state.userName !== '' && this.state.gameId !== '';
    if (event.key ==='Enter') {
      if (isComplete) {
        this.props.handleJoinGame(this.state.gameId, this.state.userName);
      } else {
        alert('Please fill out both fields.');
      }
    }
  }

  handleStartNewGame() {
    if (this.state.userName !== '') {
      this.props.onClick(this.state.userName);
    } else {
      alert('Please fill out Screen Name');
    }
  }

  render() {
    return (
        <div className="prompt">
          <p>Enter Game</p>
          <input
            type="text"
            name="userName"
            placeholder="Screen Name"
            onKeyPress={this.handleKeyPress}
            onChange={this.handleInputChange}
          />
          <input
            type="text"
            name="gameId"
            placeholder="Game ID"
            onKeyPress={this.handleKeyPress}
            onChange={this.handleInputChange}
          />
          <p>or</p>
          <p className="start-new" onClick={this.handleStartNewGame}>Start New Game</p>
        </div>
    );
  }
}

export default Prompt;
