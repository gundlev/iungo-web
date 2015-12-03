import React, {Component} from 'react'
import Firebase from 'firebase'
import Rebase from 're-base'
import {List} from 'react-toolbox'
import utils from '../../utils/firebaseUtils'
import {URL} from '../../config/firebase'
import Style from '../../style.scss'


class MeetingList extends Component {

  static propTypes = {
    list: React.PropTypes.object
  }

  constructor(props) {
    super(props)
    this.state = {
      list: this.props.list,
    }
  }

  render() {
    return(
      <div>
        <List selectable>
          {Object.keys(this.state.list).forEach(meetingId => {
            <ListItem
              caption={this.state.list[meetingId]['title']}
              legend={this.state.list[meetingId]['text']}
            />
          })}
        </List>
      </div>
    )
  }
}

export default MeetingList
