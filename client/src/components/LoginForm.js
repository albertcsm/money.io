import React, { Component } from 'react';
import { auth, provider } from '../firebaseApp.js';

class LoginForm extends Component {

  login() {
    auth.signInWithPopup(provider);
  }

  render() {
    return (
      <div>
        <div style={{"minHeight":"45vh"}} className="d-flex align-items-end justify-content-center bg-primary text-white py-2">
          <h1 className="font-weight-bold"><span className="fa fa-credit-card"/> money.io</h1>
        </div>
        <div style={{"minHeight":"55vh"}} className="d-flex align-items-start justify-content-center">
          <button className="btn btn-secondary btn-lg my-3" onClick={this.login}>Login with Google</button>
        </div>
      </div>
    )
  }
}

export default LoginForm;