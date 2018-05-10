import React, { Component } from 'react';
import { auth, provider } from '../firebaseApp.js';

class LoginForm extends Component {

  login() {
    auth.signInWithPopup(provider);
  }

  render() {
    return (
      <button onClick={this.login}>Log In</button>
    )
  }
}

export default LoginForm;