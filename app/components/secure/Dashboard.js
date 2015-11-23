import React, {Component} from 'react'
import Rebase from 're-base'
import {TransitionMotion, spring, presets} from 'react-motion'

import {URL} from '../../config/firebase'
let base = Rebase.createClass(URL)

import {Tab, Tabs, Card, ProgressBar} from 'react-toolbox';

const STATUS = {
  aktiv     : 'active',
  inaktiv   : 'inactive',
  invitered : 'invited'
}

let refs = []

function listenTo(path, options){
  let ref = base.listenTo(path, options)
  refs.push(ref)
  return ref
}

class Dashboard extends Component{
  constructor(props){
    super(props)
    console.log(props)
    this.state = {
      groups: null,
      activeTab: 0
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
          then(status){
            let groups = Object.assign({}, this.state.groups);
            groups[key] = status;
            this.setState({groups})
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

  handleTabChange = (activeTab) => {
    this.setState({activeTab})
  }

  render(){
    return (
      <GroupViews handleTabChange={this.handleTabChange} activeTab={this.state.activeTab} groups={this.state.groups}/>
    )
  }

}

class GroupCard extends Component{
  constructor(props){
    super(props)
    this.state = {
      group: null
    }
    listenTo(`networkgroups/${props.id}`, {
      context: this,
      then(group){
        this.setState({group})
      }
    })
  }

  getCardDescription = ({meetings={}, members={}}) => `Meetings: ${Object.keys(meetings).length}  |  Members: ${Object.keys(members).length}`

  preset = [50, 13]

  defaultStyles = () => {
    return {
      val: {
        //height: spring(0),
        y: spring(200),
        opacity: spring(0),
        scale: spring(0.3)
      }
    }
  }

  getStyles = () => {
    return {
      val: {
        //height: spring(226),
        y: spring(0, this.preset),
        opacity: spring(1, this.preset),
        scale: spring(1, this.preset)
      }
    }
  }

  willLeave = () => {
    return {
      val: {
        //height: spring(0),
        y: spring(0),
        opacity: spring(0),
        scale: spring(0)
      }
    }
  }

  willEnter = () => {
    return {
      val: {
        //height: spring(0),
        y: spring(0),
        opacity: spring(0),
        scale: spring(0)
      }
    }
  }

  render(){ return this.state.group
    ? <div>
    <TransitionMotion
      defaultStyles={this.defaultStyles()} styles={this.getStyles()}
      willEnter={this.willEnter} willLeave={this.willLeave}
      >
      {({val: {y, opacity, scale}}) =>
    <div style={{opacity, transform: `translate(0px, ${y}px) scale(${scale})`}}>
    <Card
        image={'data:image/jpg;base64,' + this.state.group.image}
        text={this.getCardDescription(this.state.group)}
        title={this.state.group.name}
        color="rgba(0,0,0,.4)"
      /></div>
    }</TransitionMotion>
    </div>
    : <ProgressBar type="circular" mode="indeterminate" />

  }
}

let EmptyGroupCard = ({type}) => <div> no {type} groups</div>

let GroupViews = ({groups, activeTab, handleTabChange}) => {
  let style = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  }



  if(!groups)
    return <ProgressBar type="circular" mode="indeterminate" />
    let keys = Object.keys(groups);
    return <Tabs index={activeTab} onChange={handleTabChange}>
        {
          Object.keys(STATUS).map(status => {
            let count = keys.filter(key => groups[key] == status).length;
            console.log("count", status, count)
            return (<Tab label={status}>
              { count
                ? <div style={style}>
                    {keys.map(id =>{
                      return <div style={{margin: 3}}>
                        <GroupCard id={id}/>
                      </div>
                    })}
                  </div>
                : <EmptyGroupCard type={status} />
              }
            </Tab>)

          })
        }
      </Tabs>

}

export default Dashboard
