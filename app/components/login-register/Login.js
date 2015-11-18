import React from 'react'
import firebaseUtils from '../../utils/firebaseUtils'
import {Button, Input} from 'react-toolbox'
import Style from '../../style.scss'

module.exports = class Login extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      error: false,
      email: '',
      password: ''
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();

    console.log(this.state.email);
    console.log(this.state.password);
    firebaseUtils.loginWithPW({email: this.state.email, password: this.state.password}, null, (loggedIn) =>{
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

  handleChange = (name, event) => {
    const newState = {};
    newState[`${name}`] = event.target.value;
    this.setState(newState);
  }

  render(){
    var errors = this.state.error ? <p> Error on Login </p> : '';
    return (
      <div className="col-sm-6 col-sm-offset-3">
        <form onSubmit={this.handleSubmit}>
          <Input name="email" type='text' label='Email' value={this.state.email} onChange={this.handleChange.bind(this, 'email')}  required/>
          <Input name="password" type='text' label='Password' value={this.state.pw} onChange={this.handleChange.bind(this, 'password')}  required/>
          <Button className={Style.loginButton} label='Login' raised />
          {errors}
        </form>
      </div>
    );
  }
}

// <div className="col-sm-6 col-sm-offset-3">
//   <form onSubmit={this.handleSubmit}>
//     <div className="form-group">
//       <label> Email </label>
//       <input className="form-control" ref="email" placeholder="Email"/>
//     </div>
//     <div className="form-group">
//       <label>Password</label>
//       <input ref="pw" type="password" className="form-control" placeholder="Password" />
//     </div>
//     <Button className={Style.loginButton} type="submit" label='Login' raised />
//     {errors}
//   </form>
// </div>
