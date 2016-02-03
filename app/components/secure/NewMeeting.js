import React, {Component} from 'react'
import {findDOMNode} from 'react-dom'
import Firebase from 'firebase'
import Rebase from 're-base'
import utils from '../../utils/firebaseUtils'
//import {URL} from '../../config/firebase'
const URL = "https://brilliant-torch-4963.firebaseio.com/";

let ref = new Firebase(URL);
let base = Rebase.createClass(URL);
var initialDate = new Date();

import {Button, Dialog} from 'react-toolbox'

import MeetingEditor from '../SmallComponents/MeetingEditor'

class NewMeeting extends Component {

  state = {
    visible: false,
    gid: 'forsam', //from props
    groupName: 'Forsam', //from props
  };

  onClick = () => {
    this.setState({
      visible: true
    })
  };

  closeModal = () => {
    this.setState({
      visible: false
    })
  };

  onOverlayClick = () => {
    this.setState({
      visible: false
    })
  };

  handleSubmit = (formData) => {
    console.log("submitted!");

    console.log("formData", formData);

    const {
      title, address, agenda, date, startTime, endTime, notification,
    } = formData;

    var path = 'networkgroups/' + this.state.gid + '/members';
    console.log(path);
    var result = base.fetch(path, {
      context: this,
      then(data){
        var part = {};
        Object.keys(data).forEach(key => {
          part[key] = {status: 0}
        });
        console.log(part);


        this.createNewMeetingToFB({
          title,
          address,
          endTimestamp: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            endTime.getHours(),
            endTime.getMinutes(),
            endTime.getSeconds()).getTime()/1000,
          startTimestamp: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            startTime.getHours(),
            startTime.getMinutes(),
            startTime.getSeconds()).getTime()/1000,
          participants: part,
          text: agenda
        }, this.state.gid, this.state.groupName, notification, data);

        /*
        TODO: Check if the meeting was successfully created
        (use rebase in utils and have createNewMeetingToFB return true or false),
        and send notifications to all users. Use Object.keys(data).forEach().
        */

      }
    })
  };

  createNewMeetingToFB = (meeting, gid, groupName, notification, members) =>{
    var meetingRef = ref.child('networkgroups').child(gid).child('meetings').push(meeting, function(error) {
      if (error) {
        console.log('The meeting could not be saved');
      } else {
        console.log("The meeting has been saved");
        console.log(meetingRef.key());
      if(notification){
        Object.keys(members).forEach(key => {
          ref.child('notifications').push({
            from: gid,
            fromName: groupName,
            read: false,
            to: key,
            title: "Nyt møde hos " + groupName,
            type: 'newMeeting',
            reference: "/networkgroups/" + gid + "/meetings/" + meetingRef.key(),
            timestamp: new Date().getTime()
          })
        })
      }
      }
    });
    console.log("Done");
    this.closeModal()
  };

  render(){
    return (
  <div>
    <Dialog
      active={this.state.visible}
      onOverlayClick={this.onOverlayClick}>
      <h4 className="headlineStyle">Create new meeting</h4>
    <MeetingEditor handleFormSubmit={this.handleSubmit.bind(this)}/>
    </Dialog>
    <Button label="New meeting" onClick={this.onClick} raised primary/>
  </div>)
  }
}

export default NewMeeting
