import React, {Component} from 'react'
import {findDOMNode} from 'react-dom'
import Firebase from 'firebase'
import Rebase from 're-base'
import utils from '../../utils/firebaseUtils'
import {Button, Dialog, Input} from 'react-toolbox'

//import {URL} from '../../config/firebase'
const URL = "https://brilliant-torch-4963.firebaseio.com/"
let base = Rebase.createClass(URL)
let ref = new Firebase(URL);

class NewNotification extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      gid: 'iungo', //from props
      groupName: 'iungo', //from props
      text: ""
    }
  }

  onClick = () => {
    this.setState({
      visible: true
    })
  };

  onOverlayClick = () => {
    this.setState({
      visible: false,
      text: ""
    })
  };

  closeModal = () => {
    this.setState({
      visible: false
    })
  };

  handleChange = (name, value) => {
    this.setState({...this.state, [name]: value});
    console.log(event.target.value);
  };

  sendNotification = () => {
    Object.keys(this.props.members).forEach(key => {
      ref.child('notifications').push({
        from: this.state.gid,
        fromName: this.state.groupName,
        read: false,
        to: key,
        title: this.state.text,
        type: 'reminder',
        reference: "/networkgroups/" + this.state.gid + "/meetings/" + this.props.meetingId,
        timestamp: new Date().getTime()
      })
    })
    this.closeModal()
  }

  render() {
    return (
      <div>
        <Dialog
          active={this.state.visible}
          onOverlayClick={this.onOverlayClick}>
          <h4 className="headlineStyle">Send Reminder Notification</h4>
          <Input name="text" type='text' label='Text' value={this.state.text} onChange={this.handleChange.bind(this, 'text')} />
          <Button label="Send" onClick={this.sendNotification} raised primary/>
        </Dialog>
        <Button label="New Reminder" onClick={this.onClick} raised primary/>
      </div>
    )
    // return(
    //   <div className="col-md-6 col-md-offset-3">
    //     <h4 className="headlineStyle">Create new meeting</h4>
    //     <form onSubmit={this.handleSubmit}>
    //       <Input name="title" type='text' label='Title' value={this.state.title} onChange={this.handleChange.bind(this, 'title')}/>
    //       <Input name="text" type='text' label='Text' value={this.state.text} onChange={this.handleChange.bind(this, 'text')} />
    //       <Input name="address" type='text' label='Address' value={this.state.address} onChange={this.handleChange.bind(this, 'address')} />
    //       <DatePicker value={this.state.date} placeholder="Dato" name='date' onChange={this.handleDateChange.bind(this)}/>
    //       <TimePicker value={this.state.startTime} placeholder="Start Tid" label="Start Time" onChange={this.handleTimeChange.bind(this, 'startTime')}/>
    //       <TimePicker value={this.state.endTime} placeholder="Slut Tid" label="End Time" onChange={this.handleTimeChange.bind(this, 'endTime')}/>
    //       <Button label="submit" raised primary/>
    //     </form>
    //
    //   </div>
    // )
  }

}
export default NewNotification
