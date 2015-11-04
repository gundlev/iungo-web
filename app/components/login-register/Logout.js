import React from 'react'
import firebaseUtils from '../../utils/firebaseUtils'

class Logout extends React.Component{
  constructor(props){
    super(props);
    firebaseUtils.logout();
  }
  render() {
    return <p>You are now logged out</p>;
  }
}

export default Logout;
