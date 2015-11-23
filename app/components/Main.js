import React from 'react'
import {Link} from 'react-router'
import firebaseUtils from '../utils/firebaseUtils'
import {AppBar, Navigation} from 'react-toolbox'
import Style from '../style.scss'

class Main extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      auth: firebaseUtils.loggedInUser()
    }

    firebaseUtils.onChange = (loggedIn) => this.handleLogout(loggedIn);
  }

  handleLogout(loggedIn){
    this.setState({
      auth: loggedIn
    });
  }

  render(){
    var links = []
    if (this.state.auth) {
      links = [
        {href: "/newMeeting", label: "New Meeting"},
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
            {React.cloneElement(this.props.children, {
             uid: this.state.auth ? this.state.auth.uid : null
           })}
          </div>
        </div>
      </span>
    )
  }
}

export default Main;
