import React, {Component} from 'react'
import Rebase from 're-base'
import {Input, Button, DatePicker, TimePicker, Dropdown} from 'react-toolbox'
import utils from '../../utils/firebaseUtils'

import {URL} from '../../config/firebase'
let base = Rebase.createClass(URL)

class NewMeeting extends Component {
  constructor(props) {
    super(props)
    this.state {
      title: '',
      type: '',
      reference: ''
      //reference should be this.props.reference but that has to be set.
    }
  }

  render() {
    return(
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
