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

import {Button, Dialog, Dropdown} from 'react-toolbox'

import MeetingEditor from '../SmallComponents/MeetingEditor'

// To be deleted when the group dropdown is no longer in effect.
const groups = [
  {value: 0, gid: '', label: ''},
  {value: 1, gid: 'iungo', label:'IUNGO'},
  {value: 2, gid: 'forsam', label: 'ForSam'}
]

class NewMeeting extends Component {

  state = {
    visible: false,
    gid: 'iungo', //from props
    groupName: 'IUNGO', //from props
    value: 0
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

  handleSubmit = (formData) => {

    const {
      title, address, agenda, date, startTime, endTime, notification, value
    } = formData;

    var path = 'networkgroups/' + groups[value]['gid'] + '/members';

    base.fetch(path, {
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
        }, groups[value]['gid'], groups[value]['label'], notification, data);

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
          onOverlayClick={this.closeModal}>
          <h4 className="headlineStyle">Create new meeting</h4>
        <MeetingEditor handleFormSubmit={this.handleSubmit}/>
        </Dialog>
        <Button label="New meeting" onClick={this.onClick} raised primary/>
      </div>
    )
  }
}

export default NewMeeting
