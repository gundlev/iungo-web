import React from 'react'
import {Link} from 'react-router'
import firebaseUtils from '../utils/firebaseUtils'

class Main extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      loggedIn: firebaseUtils.isLoggedIn()
    }

    firebaseUtils.onChange = (loggedIn) => this.handleLogout(loggedIn);
  }

  handleLogout(loggedIn){
    this.setState({
      loggedIn: loggedIn
    });
  }

  render(){
    return (
      <span>
        <nav className="navbar navbar-default navbar-static-top">
          <div className="container">
            <div className="navbar-header">
              <Link to="/" className="navbar-brand"> IUNGO </Link>
            </div>
            <ul className="nav navbar-nav pull-right">
              <li><Link to="/" className="navbar-brand"> Home </Link></li>
              <li><Link to="/dashboard" className="navbar-brand"> Dashboard </Link></li>
              {
                !this.state.loggedIn
                && (<li><Link to="/register" className="navbar-brand"> Register </Link></li>)
              }
              {
                this.state.loggedIn
                ? (<li><Link to="/logout" className="navbar-brand">Logout</Link></li>)
                : (<li><Link to="/login" className="navbar-brand">Login</Link></li>)
              }
            </ul>
          </div>
        </nav>
        <div className="container">
          <div className="row">
             {this.props.children}
          </div>
        </div>
      </span>
    )
  }
}

export default Main;
