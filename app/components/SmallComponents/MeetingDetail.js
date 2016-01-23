import React, {Component} from 'react'
import Firebase from 'firebase'
import Rebase from 're-base'
import {List, ListItem} from 'react-toolbox'
import utils from '../../utils/firebaseUtils'
//import {URL} from '../../config/firebase'
const URL = "https://brilliant-torch-4963.firebaseio.com/"
import Style from '../../style.scss'


class MeetingDetail extends Component {

  static propTypes = {
    meeting: React.PropTypes.string
  }

  constructor(props) {
    super(props)
  }

  render() {
    return(
      <div>
        {this.props.meeting}
      </div>
    )
  }
}

export default MeetingDetail
