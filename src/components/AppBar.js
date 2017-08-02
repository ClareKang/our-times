import React, { Component } from 'react';
import { AppBar as MUIAppBar, FlatButton } from 'material-ui';
import FireBaseTools, { currentUser } from '../helpers/firebase';

const appBarTitle = process.env.REACT_APP_WEBSITE_NAME;
const appBarTitleStyle = {
  color: '#fff',
};

class AppBar extends Component {
  constructor(props) {
    super(props);
    const user = currentUser();
    this.state = {
      user: user || null,
    };
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
  }
  signIn() {
    const user = FireBaseTools.signIn();
    this.setState({
      user,
    });
  }
  signOut() {
    FireBaseTools.signOut();
    this.setState({
      user: null,
    });
  }
  render() {
    const { user } = this.state;
    const ButtonSignIn = (
      <FlatButton
        label="Sign In"
        onClick={this.signIn}
        labelStyle={appBarTitleStyle}
      />
    );
    const ButtonSignOut = (
      <FlatButton
        label="Sign Out"
        onClick={this.signOut}
        labelStyle={appBarTitleStyle}
      />
    );
    const button = user ? ButtonSignOut : ButtonSignIn;
    console.log(user, button);
    return (
      <MUIAppBar
        title={appBarTitle}
        titleStyle={appBarTitleStyle}
        showMenuIconButton={false}
        iconElementRight={button}
      />
    );
  }
}

export default AppBar;
