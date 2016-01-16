import React, {Component} from 'react'
import Dimensions from 'react-dimensions'
import {TransitionMotion, spring, presets} from 'react-motion'

class StepCarousel extends Component{
  constructor(props){
    super(props)
  }

  preset = [50, 13]

  render(){
    const getStyles = () => {
      return {
        val: {
          x: spring(
            this.props.current == 0
              ? 0
              : -(this.props.current * this.props.containerWidth)
            , this.preset
            )
        }
      }
    }

    return (
    <div>
    <div style={{overflow: "hidden"}}>
    <TransitionMotion
      styles={getStyles()}>
      {({val}) =>
      <div style={{
            display: 'flex',
            transform: `translate(${val.x}px, 0px)`
          }}>
        {this.props.children.map(child =>
          <div style={{
              flex: '1 0 100%'
            }}>
            {child}
          </div>
        )}
      </div>}
    </TransitionMotion>
  </div>
    {this.props.overlay}
  </div>)
  }
}

export default Dimensions()(StepCarousel)
