import React, {Component} from 'react'
import Rebase from 're-base'
import {Input, Button, DatePicker, TimePicker} from 'react-toolbox'
import utils from '../../utils/firebaseUtils'

import {URL} from '../../config/firebase'
let base = Rebase.createClass(URL)
var initialDate = new Date();

class NewMeeting extends Component {

  constructor(props){
    super(props)
    /*
    This variables date, startTime and endTime will be created and
    added to the state.
    */
    this.state = {
      error: false,
      gid: 'iungo',
      title: '',
      address: '',
      text: ''
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitted!")
    var path = 'networkgroups/' + this.state.gid + '/members'
    console.log(path);
    var result = base.fetch(path, {
      context: this,
      then(data){
        var part = {}
        Object.keys(data).forEach(key => {
          part[key] = {status: 0}
        })
        console.log(part);
        var date = this.state.date
        var start = this.state.startTime
        var end = this.state.endTime
        utils.createNewMeetingToFB({
          title: this.state.title,
          address: this.state.address,
          endTimestamp: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            end.getHours(),
            end.getMinutes(),
            end.getSeconds()).getTime()/1000,
          startTimestamp: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            start.getHours(),
            start.getMinutes(),
            start.getSeconds()).getTime()/1000,
          participants: part,
          text: this.state.text
        }, 'Test')
        /*
        TODO: Check if the meeting was successfully created
        (use rebase in utils and have createNewMeetingToFB return true or false),
        and send notifications to all users. Use Object.keys(data).forEach(). 
        */

      }
    })
  }

  handleChange = (name, event) => {
    const newState = {};
    newState[`${name}`] = event.target.value;
    this.setState(newState);
    console.log(this.state);
  }

  handleDateChange = (value) => {
    this.setState({
      date: value
    });
    console.log(this.state);
  };

  handleTimeChange = (item, value) => {
    const newState = {};
    newState[item] = value;
    this.setState(newState);
  }

  render() {
    return (
      <div className="col-md-6 col-md-offset-3">
        <h4 className="headlineStyle">Create new meeting</h4>
        <form onSubmit={this.handleSubmit}>
          <Input name="title" type='text' label='Title' value={this.state.title} onChange={this.handleChange.bind(this, 'title')}/>
          <Input name="text" type='text' label='Text' value={this.state.text} onChange={this.handleChange.bind(this, 'text')} />
          <Input name="address" type='text' label='Address' value={this.state.address} onChange={this.handleChange.bind(this, 'address')} />
          <DatePicker value={this.state.date} placeholder="Dato" name='date' onChange={this.handleDateChange.bind(this)}/>
          <TimePicker value={this.state.startTime} placeholder="Start Tid" label="Start Time" onChange={this.handleTimeChange.bind(this, 'startTime')}/>
          <TimePicker value={this.state.endTime} placeholder="Slut Tid" label="End Time" onChange={this.handleTimeChange.bind(this, 'endTime')}/>
          <Button label="submit" raised primary/>
        </form>

      </div>
    )
  }
}

export default NewMeeting
