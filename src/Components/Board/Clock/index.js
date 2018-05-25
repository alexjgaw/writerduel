import React, { Component } from 'react';
import './index.css';

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMinute: 1,
      currentSecond: 0
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.gameState !== this.props.gameState) {
      if (this.props.gameState === 'playing') {
        this.startTimer();
      }
    }

    if (prevState !== this.state) {
      if ( this.state.currentMinute === 0 && this.state.currentSecond === 0 ) {
        clearInterval(this.timerId);
        this.props.handleGameOver();
      }
    }
  }

  startTimer() {
    this.timerId = setInterval(
      () => {
        if ( this.state.currentSecond > 0 ) {

          this.setState({
            currentSecond: this.state.currentSecond - 1
          });
        } else if ( this.state.currentMinute > 0) {
          this.setState({
            currentMinute: this.state.currentMinute - 1,
            currentSecond: 59
          });
        }
      },
      1000
    );
  }



  render() {
    return (
      <div className="clock">
          <span>{this.state.currentMinute.toString().padStart(2,'0')}</span>
          <span>:</span>
          <span>{this.state.currentSecond.toString().padStart(2,'0')}</span>
      </div>
    );
  }
}

export default Clock;
