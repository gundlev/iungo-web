import Firebase from 'firebase'
//import {URL} from '../config/firebase'
const URL = "https://brilliant-torch-4963.firebaseio.com/"

let ref = new Firebase(URL);
//let cachedUser = null;

let addNewUserToFB = (newUser, {uid} = newUser) =>
  ref.child('users').child(uid).set(newUser);


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
              uid: authData.uid,
              email: user.email,
              name: user.name,
              title: user.title,
              company: user.company,
              address: "",
              description: "",
              mobilNo: "",
              phoneNo: "",
              notifications: 0,
              picture: "",
              website: ""
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
        console.log("user logged in!");
        //checkForAdmin(authData.uid);
        authData.email = userObj.email;
//        cachedUser = authData;
        cb && cb(authData);
        this.onChange(authData);
        cbOnRegister && cbOnRegister(true);
      }
    });
  },
  loggedInUser(){
    return ref.getAuth() || false;
  },
  logout(){
    ref.unauth();
//    cachedUser = null;
    this.onChange(false);
  },
  createNewMeetingToFB(meeting, gid) {
    ref.child('networkgroups').child(gid).child('meetings').push(meeting)
    console.log("Done");
  }
};
