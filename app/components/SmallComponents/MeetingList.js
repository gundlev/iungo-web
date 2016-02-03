import React, {Component} from 'react'
import Firebase from 'firebase'
import Rebase from 're-base'
import {List, ListItem} from 'react-toolbox'

import Style from '../../style.scss'


class MeetingList extends Component {

  static propTypes = {
    list: React.PropTypes.object
  };

  render() {
    return(
      <div>
        <List selectable>
          {Object.keys(this.props.list).map(idx => {
          const meeting = this.props.list[idx];
          //const now = Date.now();

            /*
            if (meeting['startTimestamp'] >= now) {

            }
            */
              return (<ListItem
                selectable={true}
                key={idx}
                caption={meeting['title']}
                legend={meeting['groupName'] + ' - ' + meeting['startTimestamp']}
                onClick={_ => this.props.onMeetingSelected(idx)}
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
