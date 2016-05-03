import React, {Component} from 'react'
import {findDOMNode} from 'react-dom'
import {Input, Button, DatePicker, Switch, TimePicker, Dropdown} from 'react-toolbox'

import autobind from 'autobind-decorator'
import Style from '../../style.scss'
import Dialog from 'react-toolbox/lib/dialog'

import StepCarousel from '../SmallComponents/StepCarousel'
import ValidationForm from '../SmallComponents/ValidationForm'
import {Joi} from 'react-validation-decorator'

import isEmpty from 'lodash.isempty'

import update from 'react-addons-update'

const groups = [
  {value: 0, gid: '', label: ''},
  {value: 1, gid: 'iungo', label:'IUNGO'},
  {value: 2, gid: 'forsam', label: 'ForSam'}
]

class MeetingEditor extends Component {

  static initialFormsState = [
    {
      schema: Joi.object().keys({
        title: Joi.string().min(3).required().label('Title'),
        address: Joi.string().required().label('Address'),
        date: Joi.date().min(new Date()).required().label('Date'),
        startTime: Joi.date().required().label('Start Time'),
        endTime: Joi.date().required().label('End Time'),
        value: Joi.number().min(1).required()
      }),
      data: {},
      nextIcon: 'arrow_forward'
    },
    {
      schema: Joi.object().keys({
        agenda: Joi.string().required().label('Agenda'),
        notification: Joi.boolean().optional().label('Notification')
      }),
      data: {},
      nextIcon: 'done'
    }
  ];

  //TODO can be abstracted further. form state should live inside forms
  state = {
    error: false,
    title: '',
    address: '',
    text: '',
    agenda: '',
    // gid: '',
    // groupName: '',
    value: 0,
    notification: false,
    forms: MeetingEditor.initialFormsState,
    current: 0
  };

  handleChange = (name, value) => {
    this.setState({...this.state, [name]: value});
  };

  resetForm = _ => this.setState({
    forms: MeetingEditor.initialFormsState
  });

  render() {
    console.log('INITIAL_FORM', MeetingEditor.initialFormsState);

    const setFormData = (b) => {
      this.setState(
        update(this.state, {
          forms: {[this.state.current]: {data: {$set: b}}}
        })
      )
    };

    const handleSubmit = () => {
      this.props.handleFormSubmit(
        this.state.forms.reduce((acc, form) => {
          return {...form.data, ...acc}
        }, ({}))
      );

      this.resetForm();
    };

    const formValid = !isEmpty(this.state.forms[this.state.current].data);

    return (
      <StepCarousel
        current={this.state.current}
        overlay={<div>
          { formValid &&
            <Button onClick={() => {
              if(this.state.current === this.state.forms.length - 1){
                handleSubmit()
              } else{
                this.setState({
                  current: this.state.current + 1
                })
              }
            }}
            icon={this.state.forms[this.state.current].nextIcon}
            floating accent={false}
            style={{position: 'absolute', right: "-30px", top: "260px"}}
            />
          }
        {
          this.state.current > 0 &&
          <Button onClick={() => {
               this.setState({
                 current: this.state.current - 1
               })
             }}
             icon='arrow_back'
             floating accent={false}
             style={{position: 'absolute', left: "-30px", top: "260px"}}
             />
        }
        </div>}
        >
        <ValidationForm
          handleStateChange={this.handleChange.bind(this)}
          schema={this.state.forms[0].schema}
          onFormValid={(formData) => {
            setFormData(formData)
          }}
          onFormInvalid={_ => {
            setFormData({})
          }}
          >
          <Input key="title" type='text' label='Title' maxLength={32} value={this.state.title} />
          <Input key="address" type='text' label='Address' value={this.state.address} />
          <DatePicker key='date' value={this.state.date} placeholder="Dato"  label="Date" minDate={new Date()} />
          <TimePicker key='startTime' value={this.state.startTime} placeholder="Start Tid" label="Start Time" />
          <TimePicker key='endTime' value={this.state.endTime} placeholder="Slut Tid" label="End Time" />
          <Dropdown auto key="value" source={groups} label={'Group'} value={this.state.value}/>
        </ValidationForm>

        <ValidationForm
          handleStateChange={this.handleChange.bind(this)}
          schema={this.state.forms[1].schema}
          onFormValid={(formData) => {
            setFormData(formData)
          }}
          onFormInvalid={(errors) => {
            setFormData({})
          }}>
          <Input key="agenda" style={{height: window.innerHeight / 2}}
            name="agenda"
            type='text'
            label='agenda'
            multiline={true}
            value={this.state.agenda} />
          <Switch key="notification"
            checked={this.state.notification}
            label="Push notifications"
          />
        </ValidationForm>

      </StepCarousel>

      )
  }
}

export default MeetingEditor


// Comments on group picker. The Dropdown sets a value corresponding to the group chosen.
// It is then found in a simular array in NewMeeting and the values from there are used to create meeting.
// It is done in that way to be easy to remove again.
