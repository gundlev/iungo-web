import React from 'react'
import firebaseUtils from '../../utils/firebaseUtils'

module.exports = class Register extends React.Component{

  handleSubmit = (e) => {
    e.preventDefault();
    var email = this.refs.email.value;
    var pw = this.refs.pw.value;
    firebaseUtils.createUser({email: email, password: pw}, (result) =>{
      if(result){
        this.props.history.replaceState(null, '/dashboard')
      }
    });
  }

  render(){
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
          <button type="submit" className="btn btn-primary">Register</button>
        </form>
      </div>
    )
  }
}
