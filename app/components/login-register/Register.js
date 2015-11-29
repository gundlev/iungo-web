import React, {Component} from 'react'
import firebaseUtils from '../../utils/firebaseUtils'
import {Button, Input} from 'react-toolbox'
import Style from '../../style.scss'

class Register extends Component{
  constructor(props){
    super(props)
    this.state = {
      error: false,
      email: '',
      password: '',
      name: '',
      title:'',
      company: ''
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // console.log(this.state.email);
    // console.log(this.state.password);
    // console.log(this.state.name);
    // console.log(this.state.title);
    // console.log(this.state.company);
    firebaseUtils.createUser({
      email: this.state.email,
      password: this.state.password,
      name: this.state.name,
      title: this.state.title,
      company: this.state.company
      }, (result) =>{
        if(result){
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
    var errors = this.state.error ? <p> Error on creating user </p> : '';
    return (
      <div className="col-sm-6 col-sm-offset-3">
        <form onSubmit={this.handleSubmit}>
          <Input name="email" type='text' label='Email' value={this.state.email} onChange={this.handleChange.bind(this, 'email')}  required/>
          <Input name="password" type='password' label='Password' value={this.state.password} onChange={this.handleChange.bind(this, 'password')}  required/>
          <Input name="name" type='text' label='Name' value={this.state.name} onChange={this.handleChange.bind(this, 'name')}  required/>
          <Input name="title" type='text' label='Title' value={this.state.title} onChange={this.handleChange.bind(this, 'title')}  required/>
          <Input name="company" type='text' label='Company' value={this.state.company} onChange={this.handleChange.bind(this, 'company')}  required/>
          <Button className={Style.loginButton} label='Register' raised primary />
          {errors}
        </form>
      </div>
    );

    // return (
    //   <div className="col-sm-6 col-sm-offset-3">
    //     <form onSubmit={this.handleSubmit}>
    //       <div className="form-group">
    //         <label> Email </label>
    //         <input className="form-control" ref="email" placeholder="Email"/>
    //       </div>
    //       <div className="form-group">
    //         <label>Password</label>
    //         <input ref="pw" type="password" className="form-control" placeholder="Password" />
    //       </div>
    //       <button type="submit" className="btn btn-primary">Register</button>
    //     </form>
    //   </div>
    // )
  }
}

export default Register
