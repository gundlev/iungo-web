import React, {Component} from 'react'
import Firebase from 'firebase'
import Rebase from 're-base'
import {List, ListItem} from 'react-toolbox'

import Style from '../../style.scss'
import Time from 'react-time'

const meetingLegend = ({startTimestamp, groupName}) =>
    <p>
        {groupName} <span> - </span>
    <Time value={new Date(startTimestamp*1000)} format="DD/MM/YYYY HH:mm"/>
</p>;

const sortMap = (map, comparator) =>
    Object.keys(map).map(key => ({
        key, ...map[key]
    })).sort(comparator);

const MeetingList = ({list, onMeetingSelected, comparator}) =>
      <div>
        <List selectable>
          {sortMap(list, comparator).map(meeting => <ListItem
                selectable={true}
                key={meeting.key}
                itemContent={
                    <div style={{paddingTop: 7, paddingBottom: 7}}>
                        <h6>{meeting['title']}</h6>
                        {meetingLegend(meeting)}
                    </div>
                }
                onClick={_ => onMeetingSelected(meeting.key)}
              />
          )}
        </List>
      </div>;

MeetingList.propTypes = {
    list: React.PropTypes.object.isRequired
};

export default MeetingList
