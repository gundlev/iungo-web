import React, {Component} from 'react'
import {Tab, Tabs} from 'react-toolbox'
import Style from '../../style.scss'
import MeetingList from '../SmallComponents/MeetingList'
import MeetingDetail from '../SmallComponents/MeetingDetail'
import NewMeeting from './NewMeeting'
import NewNotification from './NewNotification'

import Participants from '../SmallComponents/Participants'

import mapValues from 'lodash.mapvalues'

const MeetingAttendees = ({index, handleTabChange, participants}) => {
    const attending = Object.keys(participants).filter(key => participants[key].status == 1).map(key => key);
    const declined = Object.keys(participants).filter(key => participants[key].status == -1).map(key => key);
    const unanswered = Object.keys(participants).filter(key => participants[key].status == 0).map(key => key);

    return <Tabs index={index} onChange={handleTabChange.bind(this)}>
        <Tab label="attending">
            <Participants list={attending}/>
        </Tab>
        <Tab label="declined">
            <Participants list={declined}/>
        </Tab>
        <Tab label="unanswered">
            <Participants list={unanswered}/>
        </Tab>
    </Tabs>
};

class MyMeetings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMeeting: "",
      lists: {},
      categories: ['Tilmeldt', 'Afmeldt', 'Ikke svaret'],
      current: [],
      currentTabIndex: 0,
      activeTabIdx: 0
    }
  }

  onMeetingSelected = (meetingId) => {
      this.setState({selectedMeeting: meetingId});
  };

  onTabChange = (activeTabIdx) => {
      this.setState({activeTabIdx})
  };

  render() {
    const meetings = Object.keys(this.props.status)
      .filter(status => this.props.status[status] === "aktiv"
        || this.props.status[status] === "admin"
      )
      .map(key => this.props.groups[key])
      .reduce((acc, group) => group
          ? {
              ...mapValues(group.meetings, meeting => ({
                  groupName: group.name, ...meeting
              })), ...acc
          } : acc
      , {});

    const meeting = meetings[this.state.selectedMeeting];

    return(
      <div className={Style.masterDetail}>
        <div className={Style.master}>
          <NewMeeting />
          <MeetingList
              list={meetings}
              comparator={
                (a, b) => b.startTimestamp - a.startTimestamp
              }
              onMeetingSelected={this.onMeetingSelected}
          />
        </div>
        <div className={Style.detail}>
            {
                !meeting
                    ? <div> nothing selected</div>
                    : <div className={Style.masterDetail}>
                        <div className={Style.detail}>
                            <NewNotification
                                members={meeting.participants}
                                meetingId={this.state.selectedMeeting}/>
                            <MeetingDetail id={this.state.selectedMeeting}
                                {...meeting} />
                        </div>
                        <div className={Style.master}>
                            <MeetingAttendees
                                index={this.state.activeTabIdx}
                                participants={meeting.participants}
                                handleTabChange={this.onTabChange}
                            />
                        </div>
                    </div>
            }
        </div>
      </div>
    )
  }
}

export default MyMeetings
