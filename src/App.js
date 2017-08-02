import React, { Component } from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { currentUser } from './helpers/firebase';

// material ui
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';

import Container from './components/Container';
import SignIn from './components/SignIn';
import Check from './components/Check';

const requireAuth = (nextState, replace) => {
  const user = currentUser();
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
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
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
