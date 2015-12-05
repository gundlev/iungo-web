import React, {Component} from 'react'
import Rebase from 're-base'
import {TransitionMotion, spring, presets} from 'react-motion'

import {URL} from '../../config/firebase'
let base = Rebase.createClass(URL)

import {Tab, Tabs, Card, CardTitle, CardMedia, ProgressBar} from 'react-toolbox';
import Time from 'react-time'

import groupBy from 'lodash.groupby'

const STATUS = {
  aktiv     : 'active',
  inaktiv   : 'inactive',
  invitered : 'invited'
}, statusToLabel = (status) => STATUS[status]

let refs = []

function listenTo(path, options){
  let ref = base.listenTo(path, options)
  refs.push(ref)
  return ref
}

class Dashboard extends Component{
  constructor(props){
    super(props)

    this.state = {
      groups: {},
      status: {},
      activeTabGroups: 0,
      activeTabMeetings: 0
    }
  }

  componentDidMount(){
    listenTo(`users/${this.props.uid}/ngroup`, {
    context: this,
    then(groupRefs){
      Object.keys(groupRefs).forEach(key =>{
        let ref = groupRefs[key];
        listenTo(ref, {
          context: this,
          then(s){
            this.setState({status: {
              [key]: s,
              ...this.state.status
            }})
            listenTo(`networkgroups/${key}`, {
              context: this,
              then(group){
                this.setState({groups: {
                  [key]: group,
                  ...this.state.groups
                }})
              }
            })
          }
        })
      })
    }
    })
  }

  componentWillUnmount(){
    refs.forEach(ref => base.removeBinding(ref))
    refs = []
  }

  handleGroupTabChange = (activeTabGroups) => {
    this.setState({activeTabGroups})
  }

  handleMeetingTabChange = (activeTabMeetings) => {
    this.setState({activeTabMeetings})
  }

  render(){
    const groupTabs = deriveGroupTabs(this.state.status, this.state.groups)

    const meetings = Object.keys(this.state.status)
      .filter(status => this.state.status[status] === "aktiv")
      .map(key => this.state.groups[key])
      .reduce((acc, group) => group
          ? {
            ...group.meetings, ...acc
          } : acc
      , {})

    const partition = groupBy(Object.keys(meetings), key => ~~(Date.now()/1000) >= meetings[key].startTimestamp ? "past" : "future")

    const meetingTabs = Object.keys(partition).reduce((acc, key) =>
    Object.assign(acc, {[key]: partition[key].map(key => <MeetingCard meeting={meetings[key]}/>).concat(acc[key])}),
    {
      "future": [],
      "past": []
    })

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
      .filter(ss => status && status[ss] == s)

    const groups_with_status = (groups) => Object.keys(groups)
      .filter(key => ids_with_status.indexOf(key) > -1)
      .map(key => groups[key])

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

function MeetingCard({/*id,*/ meeting}){

  const getCardDescription = ({startTimestamp, endTimestamp}) => `start: ${<Time value={new Date(startTimestamp*1000)} format="DD/MM HH:mm"/>} - end: ${new Date(endTimestamp*1000)}`
  return meeting
    ? <Card
        color="rgba(0,0,0,.4)"
        style={{width: "350px", height: "220px"}}>
        <CardMedia
          aspectRatio="wide"
          image={'http://placehold.it/320x175'}>
        </CardMedia>
        <CardTitle
          title={meeting.title}
          subtitle={getCardDescription(meeting)}/>
      </Card>
    : <ProgressBar type="circular" mode="indeterminate" />
}

function GroupCard({/*id,*/ group}){

  const getCardDescription = ({meetings={}, members={}}) => `Meetings: ${Object.keys(meetings).length}  |  Members: ${Object.keys(members).length}`

  return group
    ? <Card
        color="rgba(0,0,0,.4)"
        style={{width: "350px", height: "220px"}}>
        <CardMedia
          aspectRatio="square"
          contentOverlay={true}
          image={'data:image/jpg;base64,' + group.image}>
          <CardTitle
            title={group.name}
            subtitle={getCardDescription(group)}/>
        </CardMedia>
      </Card>
    : <ProgressBar type="circular" mode="indeterminate" />
}

let EmptyGroupCard = ({type}) => <div> no {type} groups</div>

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
  })

    return <Tabs index={activeTab} onChange={handleTabChange}>
        {
          labels.map(label => {
            if(!tabs[label]) return (
              <Tab label={label}><ProgressBar type="circular" mode="indeterminate" /></Tab>
            )

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
}

export default Dashboard
