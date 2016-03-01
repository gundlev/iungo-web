import React from 'react'
import {Link} from 'react-router'
import Rebase from 're-base'
import firebaseUtils from '../utils/firebaseUtils'
import {AppBar, Navigation} from 'react-toolbox'
import Style from '../style.scss'

//import {URL} from '../../config/firebase'
const URL = "https://brilliant-torch-4963.firebaseio.com/";
let base = Rebase.createClass(URL);
let refs = [];

function listenTo(path, options){
  let ref = base.listenTo(path, options);
  refs.push(ref);
  return ref
}

class Main extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      auth: firebaseUtils.loggedInUser(),
      user: {},
      status: {},
      groups: {}
    };

    console.log("userAuth: " + JSON.stringify(this.state.auth, null, 4));
    this.getUser()
    firebaseUtils.onChange = (loggedIn) => this.handleLogout(loggedIn);
  }

  getUser(){
    let ref = new Firebase(URL);
    if (ref.getAuth()) {
      var userAuth = ref.getAuth();
      ref.child("users").child(userAuth.uid).on("value", (snapshot) => {
        this.setState({user: snapshot.val()});
        //console.log("userInfo: " + JSON.stringify(this.state.user, null, 4));
      })
    }
  }

  componentDidMount(){
    if(this.state.auth)
    listenTo(`users/${this.state.auth.uid}/ngroup`, {
    context: this,
    then(groupRefs){
      Object.keys(groupRefs).forEach(key =>{
        let ref = groupRefs[key];
        listenTo(ref, {
          context: this,
          then(s){
            this.setState({status: {
              [key]: s,
              ...this.state.status
            }});
            listenTo(`networkgroups/${key}`, {
              context: this,
              then(group){
                this.setState({groups: {
                  [key]: group,
                  ...this.state.groups
                }})
              }
            })
          }
        })
      })
    }
    })
  }

  componentWillUnmount(){
    refs.forEach(ref => base.removeBinding(ref));
    refs = []
  }

  handleLogout(loggedIn){
    this.setState({
      auth: loggedIn
    });
  }

  render(){
    var links = [];
    if (this.state.auth) {
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
          {React.cloneElement(this.props.children, {
//          uid: this.state.auth ? this.state.auth.uid : null,
          groups: this.state.groups,
          status: this.state.status
          })}
          </div>
        </div>
      </span>
    )
  }
}

export default Main;
