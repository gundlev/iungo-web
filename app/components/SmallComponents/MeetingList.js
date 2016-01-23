import React, {Component} from 'react'
import Firebase from 'firebase'
import Rebase from 're-base'
import {List, ListItem} from 'react-toolbox'
import utils from '../../utils/firebaseUtils'
//import {URL} from '../../config/firebase'
const URL = "https://brilliant-torch-4963.firebaseio.com/"
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
          {this.props.list.map(meeting => {
            var now = Date.now()
            console.log(now)
            if (meeting['startTimestamp'] >= now.toString()) {

            }
              return (<ListItem
                selectable={true}
                key={meeting['id']}
                caption={meeting['title']}
                legend={meeting['groupName'] + ' - ' + meeting['startTimestamp']}
                onClick={_ => this.props.onMeetingSelected(meeting['id'])}
              /> )}
          )}
        </List>
      </div>
    )
  }
}

export default MeetingList

{/*<div>
  <List selectable>
    {Object.keys(this.props.list).forEach(meetingId => {
      <ListItem
        caption={this.props.list[meetingId]['title']}
        legend={this.props.list[meetingId]['text']}
      />
    })}
  </List>
</div>*/}
