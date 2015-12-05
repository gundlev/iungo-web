import React, {Component} from 'react'
import Firebase from 'firebase'
import Rebase from 're-base'
import {List, ListItem} from 'react-toolbox'
import utils from '../../utils/firebaseUtils'
import {URL} from '../../config/firebase'
import Style from '../../style.scss'


class MeetingList extends Component {

  static propTypes = {
    list: React.PropTypes.object
  }

  constructor(props) {
    super(props)
  }

  render() {
    return(
      <div>
        <List selectable>
          {Object.keys(this.props.list).forEach(meetingId => {
            <ListItem
              caption={this.props.list[meetingId]['title']}
              legend={this.props.list[meetingId]['text']}
            />
          })}
        </List>
      </div>
    )
  }
}

export default MeetingList
