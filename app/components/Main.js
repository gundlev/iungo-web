import React from 'react'
import {Link} from 'react-router'
import firebaseUtils from '../utils/firebaseUtils'
import {AppBar, Navigation} from 'react-toolbox'
import Style from '../style.scss'

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
    var links = []
    if (this.state.loggedIn) {
      links = [
        {href: "/", label: "Home"},
        {href: "/dashboard", label: "Dashboard"},
        {href: "/logout", label: "Logout"}
      ]
    } else {
      links = [
        {href: "/", label: "Home"},
        {href: "/dashboard", label: "Dashboard"},
        {href: "/login", label: "Login"},
        {href: "/register", label: "Register"}
      ]
    }
    return (
      <span>
        <AppBar flat>
          <Link to="/">IUNGO</Link>
          <div className={Style.navigationButtons}>
            {links.map(link=><Link className={Style.appBarLink} to={link.href}>{link.label}</Link>)}
          </div>
        </AppBar>

        <div style={{padding: '30px'}}>
          <div>
             {this.props.children}
          </div>
        </div>
      </span>
    )
  }
}

// <nav className="navbar navbar-default navbar-static-top">
//   <div className="container">
//     <div className="navbar-header">
//       <Link to="/" className="navbar-brand"> IUNGO </Link>
//     </div>
//     <ul className="nav navbar-nav pull-right">
//       <li><Link to="/" className="navbar-brand"> Home </Link></li>
//       <li><Link to="/dashboard" className="navbar-brand"> Dashboard </Link></li>
//       {
//         !this.state.loggedIn
//         && (<li><Link to="/register" className="navbar-brand"> Register </Link></li>)
//       }
//       {
//         this.state.loggedIn
//         ? (<li><Link to="/logout" className="navbar-brand">Logout</Link></li>)
//         : (<li><Link to="/login" className="navbar-brand">Login</Link></li>)
//       }
//     </ul>
//   </div>
// </nav>

export default Main;
