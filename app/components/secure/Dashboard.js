import React, {Component} from 'react'
import {TransitionMotion, spring, presets} from 'react-motion'

import {Tab, Tabs, Button, Card, CardTitle, CardMedia, CardText, CardActions, ProgressBar} from 'react-toolbox';
import Time from 'react-time'

import groupBy from 'lodash.groupby'
import isempty from 'lodash.isempty'

const STATUS = {
  aktiv     : 'active',
  inaktiv   : 'inactive',
  invitered : 'invited'
}, statusToLabel = (status) => STATUS[status];

class Dashboard extends Component{
  constructor(props){
    super(props);

    this.state = {
      activeTabGroups: 0,
      activeTabMeetings: 0
    }
  }

  handleGroupTabChange = (activeTabGroups) => {
    this.setState({activeTabGroups})
  };

  handleMeetingTabChange = (activeTabMeetings) => {
    this.setState({activeTabMeetings})
  };

  render(){
    const groupTabs = (isempty(this.props.status) || isempty(this.props.groups))
      ? {}
      : deriveGroupTabs(this.props.status, this.props.groups);

    const meetings = Object.keys(this.props.status)
      .filter(status => this.props.status[status] === "aktiv")
      .map(key => this.props.groups[key])
      .reduce((acc, group) => group
          ? {
            ...group.meetings, ...acc
          } : acc
      , {});

    const partition = groupBy(Object.keys(meetings), key => ~~(Date.now()/1000) >= meetings[key].startTimestamp ? "past" : "future");

    const meetingTabs = Object.keys(partition).reduce((acc, key) =>
    Object.assign(acc, {[key]: partition[key].map(key => <MeetingCard meeting={meetings[key]}/>).concat(acc[key])}),
    {
      "future": [],
      "past": []
    });

    return (
      <div>
        <ItemsRow
          handleTabChange={this.handleGroupTabChange}
          activeTab={this.state.activeTabGroups}
          labels={Object.keys(STATUS).map(statusToLabel)}
          tabs={groupTabs}/>
        <ItemsRow
          handleTabChange={this.handleMeetingTabChange}
          activeTab={this.state.activeTabMeetings}
          labels={["future", "past"]}
          tabs={meetingTabs}
          />
      </div>
    )
  }

}

function deriveGroupTabs(status, groups){
  return Object.keys(STATUS).reduce((acc, s) => {
    const ids_with_status = Object.keys(status)
      .filter(ss => status && status[ss] == s);

    const groups_with_status = (groups) => Object.keys(groups)
      .filter(key => ids_with_status.indexOf(key) > -1)
      .map(key => groups[key]);

    return Object.keys(groups).length
      ? Object.assign(acc, {
        [statusToLabel(s)]: groups_with_status(groups)
          .map(group => <GroupCard group={group}/>)
      })
      : acc
  }, {})
}

function MeetingsRow({groups}){
  return (
    <div>meetings</div>
  )
}

function MeetingCard({meeting, icon}){
const {/*id,*/
  title, address, startTimestamp, endTimestamp
} = meeting;
return meeting
    ? <Card
        color="rgba(0,0,0,.4)"
        style={{width: "340px"}}>
      <CardTitle
        title={title}
        subtitle={address}>
          <Time value={new Date(startTimestamp*1000)} format={"DD/MM"}/>
          <span> : </span>
          <Time value={new Date(startTimestamp*1000)} format={"HH:mm"}/>
          <span> - </span>
          <Time value={new Date(endTimestamp*1000)} format={"HH:mm"}/>
      </CardTitle>
    </Card>
    : <ProgressBar type="circular" mode="indeterminate" />
}

function GroupCard({/*id,*/ group}){

  const getCardDescription = ({meetings={}, members={}}) => `Meetings: ${Object.keys(meetings).length}  |  Members: ${Object.keys(members).length}`;

  return group
    ? <Card
        color="rgba(0,0,0,.4)"
        style={{width: "340px"}}>
        <CardMedia
          aspectRatio="wide"
          contentOverlay={true}
          image={'data:image/jpg;base64,' + group.image}>
          <CardTitle
            title={group.name}
            subtitle={getCardDescription(group)}/>
        </CardMedia>
      </Card>
    : <ProgressBar type="circular" mode="indeterminate" />
}

let EmptyGroupCard = ({type}) => <div> no {type} groups</div>;

let ItemsRow = ({labels, tabs, activeTab, handleTabChange}) => {
  const style = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  preset = [50, 13],
  defaultStyles = () => {
    return {
      val: {
        //height: spring(0),
        y: spring(200),
        opacity: spring(0),
        scale: spring(0.3)
      }
    }
  },
  getStyles = () => {
    return {
      val: {
        //height: spring(226),
        y: spring(0, preset),
        opacity: spring(1, preset),
        scale: spring(1, preset)
      }
    }
  },
  willLeave = () => {
    return {
      val: {
        //height: spring(0),
        y: spring(0),
        opacity: spring(0),
        scale: spring(0)
      }
    }
  },
  willEnter = () => {
    return {
      val: {
        //height: spring(0),
        y: spring(0),
        opacity: spring(0),
        scale: spring(0)
      }
    }
  },
  cardStyle = ({opacity, y, scale}) => ({
    opacity,
    transform: `translate(0px, ${y}px) scale(${scale})`
  });

    return <Tabs index={activeTab} onChange={handleTabChange}>
        {
          labels.map(label => {
            if(!tabs[label]) return (
              <Tab label={label}><ProgressBar type="circular" mode="indeterminate" /></Tab>
            );

            return <Tab label={label}>
              { <div style={style}>
                    {tabs[label].map(tab =>
                      <div style={{margin: 6}}>
                        <TransitionMotion
                          defaultStyles={defaultStyles()} styles={getStyles()}
                          willEnter={willEnter} willLeave={willLeave}>
                          {({val}) =>
                            <div style={cardStyle(val)}>
                              {tab}
                            </div>}
                        </TransitionMotion>
                      </div>
                    )}
                </div>
              }
            </Tab>
          })
        }
      </Tabs>
};

export default Dashboard
