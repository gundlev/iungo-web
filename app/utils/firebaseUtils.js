import Firebase from 'firebase'
import {URL} from '../config/firebase'

let ref = new Firebase(URL);
let cachedUser = null;

let addNewUserToFB = (newUser, {uid} = newUser) =>
  ref.child('user').child(uid).set(newUser);

export default {
  createUser(user, cb) {
    ref.createUser(user, (err) => {
      if (err) {
        switch (err.code) {
          case "EMAIL_TAKEN":
            console.log("The new user account cannot be created because the email is already in use.");
            break;
          case "INVALID_EMAIL":
            console.log("The specified email is not a valid email.");
            break;
          default:
            console.log("Error creating user:", err);
        }
      } else {
          this.loginWithPW(user, function(authData){
            addNewUserToFB({
              email: user.email,
              uid: authData.uid,
              token: authData.token
            });
          }, cb);
      }
    });
  },
  loginWithPW(userObj, cb, cbOnRegister){
    ref.authWithPassword(userObj, (err, authData) => {
      if(err){
        console.log('Error on login:', err.message);
        cbOnRegister && cbOnRegister(false);
      } else {
        authData.email = userObj.email;
        cachedUser = authData;
        cb && cb(authData);
        this.onChange(authData);
        cbOnRegister && cbOnRegister(true);
      }
    });
  },
  loggedInUser(){
    return cachedUser || ref.getAuth() || false;
  },
  logout(){
    ref.unauth();
    cachedUser = null;
    this.onChange(false);
  }
};
