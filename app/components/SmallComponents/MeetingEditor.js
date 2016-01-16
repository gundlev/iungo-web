import React, {Component} from 'react'
import {findDOMNode} from 'react-dom'
import {Input, Button, DatePicker, Switch, TimePicker} from 'react-toolbox'

import autobind from 'autobind-decorator'
import Style from '../../style.scss'
import Dialog from 'react-toolbox/lib/dialog'

import StepCarousel from '../SmallComponents/StepCarousel'
import ValidationForm from '../SmallComponents/ValidationForm'
import {Joi} from 'react-validation-decorator'

import isEmpty from 'lodash.isempty'

import update from 'react-addons-update'

class MeetingEditor extends Component {
  //TODO can be abstracted further. form state should live inside forms
  state = {
    error: false,
    title: '',
    address: '',
    text: '',
    agenda: '',
    notification: false,
    forms: [
    {
      schema: Joi.object().keys({
        title: Joi.string().min(3).required().label('Title'),
        address: Joi.string().required().label('Address'),
        date: Joi.date().min(new Date()).required().label('Date'),
        startTime: Joi.date().required().label('Start Time'),
        endTime: Joi.date().required().label('End Time')
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
  ],
    current: 0
  }

  handleChange = (name, value) => {
    this.setState({...this.state, [name]: value});
  }

  render() {

    const getStyles = () => {
      return {
        val: {
          x: spring(0, preset),
        }
      }
    }

    const setFormData = (b) => {
      this.setState(
        update(this.state, {
          forms: {[this.state.current]: {data: {$set: b}}}
        })
      )
    }

    const handleSubmit = () => {
      this.props.handleFormSubmit(
        this.state.forms.reduce((acc, form) => {
          return {...form.data, ...acc}
        }, ({}))
      )
    }

    const formValid = !isEmpty(this.state.forms[this.state.current].data)

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
          onFormInvalid={(errors) => {
            setFormData({})
          }}
          >
          <Input key="title" type='text' label='Title' value={this.state.title} />
          <Input key="address" type='text' label='Address' value={this.state.address} />
          <DatePicker key='date' value={this.state.date} placeholder="Dato"  label="Date" minDate={new Date()} />
          <TimePicker key='startTime' value={this.state.startTime} placeholder="Start Tid" label="Start Time" />
          <TimePicker key='endTime' value={this.state.endTime} placeholder="Slut Tid" label="End Time" />
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
