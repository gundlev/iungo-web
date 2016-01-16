import React, {Children, Component, PropTypes} from 'react'
import {Validation, Joi} from 'react-validation-decorator'

class ValidationForm extends Component{
  static propTypes = {
    schema: PropTypes.object.isRequired, //instanceOf(Joi.Object)
    handleStateChange: PropTypes.func.isRequired,
    onFormValid: PropTypes.func,
    onFormInvalid: PropTypes.func,
  }
  constructor(props){
    super(props)
    this.state = {}
    this.validationSchema = props.schema
  }

  handleChange = (name, value) => {
    this.setState({...this.state, [name]: value},
    () => {
      this.validate(name);
      const {value, errors} = this.state.validation
      const {onFormValid, onFormInvalid} = this.props
      if(value && !errors.length){
        onFormValid && this.props.onFormValid(value)
      }else{
        onFormInvalid && this.props.onFormInvalid(errors)
      }
    });
  }

  render({children, handleStateChange, onFormValid} = this.props){
    return <form>
      {
        Children.map(children, input =>{
          const name = input.key
          return (
          <div className={this.getValidationClassName(name)}>
            {
              React.cloneElement(input, {
                onChange: (value/*, {target}*/) => {
                  handleStateChange(name, value)
                  this.handleChange(name, value)
                }
              })
            }
          {this.renderValidationMessages(name)}
          </div>)
        })
      }
    </form>
  }
}

export default Validation(ValidationForm)
