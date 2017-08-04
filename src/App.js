import React, { Component } from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import FirebaseTools from './models/firebase';

// material ui
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import customTheme from './helpers/theme';

import Container from './components/Container';
import SignIn from './components/SignIn';
import Check from './components/Check';

const requireAuth = (nextState, replace) => {
  const user = FirebaseTools.user;
  if (!user) { // no session user date
    replace({
      pathname: '/',
      state: { nextPathname: nextState.location.pathname },
    });
  }
};

class App extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(customTheme)}>
        <Router history={hashHistory}>
          <Route path="/" component={Container}>
            <IndexRoute component={SignIn} />
            <Route path="/check" component={Check} onEnter={requireAuth} />
          </Route>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
