import React from 'react'
import firebaseUtils from '../../utils/firebaseUtils'

module.exports = class Login extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      error: false
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    var email = this.refs.email.value;
    var pw = this.refs.pw.value;

    firebaseUtils.loginWithPW({email: email, password: pw}, null, (loggedIn) =>{
      if (!loggedIn)
        return this.setState({ error: true })

      var { location } = this.props

      if (location.state && location.state.nextPathname) {
        this.props.history.replaceState(null, location.state.nextPathname)
      } else {
        this.props.history.replaceState(null, '/dashboard')
      }
    });
  }

  render(){
    var errors = this.state.error ? <p> Error on Login </p> : '';
    return (
      <div className="col-sm-6 col-sm-offset-3">
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label> Email </label>
            <input className="form-control" ref="email" placeholder="Email"/>
          </div>
          <div className="form-group">
            <label>Password</label>
            <input ref="pw" type="password" className="form-control" placeholder="Password" />
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
          {errors}
        </form>
      </div>
    );
  }
}
