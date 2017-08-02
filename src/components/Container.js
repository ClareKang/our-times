import React, { Component } from 'react';
import AppBar from './AppBar';

class Container extends Component {
  render() {
    const { children } = this.props;
    return (
      <div>
        <AppBar />
        <div>
          {children}
        </div>
      </div>
    );
  }
}

export default Container;
