import React, { Component } from 'react';
import AppBar from './AppBar';

class Container extends Component {
  render() {
    const { children } = this.props;
    return (
      <div style={{ height: '100vh' }}>
        <AppBar />
        <div>
          {children}
        </div>
      </div>
    );
  }
}

export default Container;
