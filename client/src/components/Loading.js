import React, { Component } from 'react';

class Loading extends Component {

  render() {
    return (
      <div style={{"minHeight":"100vh"}} className="d-flex align-items-center justify-content-center">
        <div className="MoneyIO-loading"></div>
      </div>
    )
  }
}

export default Loading;