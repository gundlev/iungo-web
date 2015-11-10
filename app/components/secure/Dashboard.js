import React, {Component} from 'react'
import Rebase from 're-base'

import {URL} from '../../config/firebase'
let base = Rebase.createClass(URL)

const USER_ID = '00591a2d-49a1-4a6c-a569-4dad284b8f23'

import {Tab, Tabs, Card, ProgressBar} from 'react-toolbox';

const STATUS = {
  aktiv     : 'active',
  inaktiv   : 'inactive',
  invitered : 'invited'
}

module.exports = class Dashboard extends Component{
  constructor(props){
    super(props)
    this.state = {
      groups: null
    }

    base.listenTo(`users/${USER_ID}/ngroup`, {
    context: this,
    then(groupRefs){
      Object.keys(groupRefs).forEach(key =>{
        let ref = groupRefs[key];
        base.listenTo(ref, {
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

  render(){
    return <GroupViews groups={this.state.groups}/>
  }

}

class GroupCard extends Component{
  constructor(props){
    super(props)
    this.state = {
      group: null
    }
    base.listenTo(`networkgroups/${props.id}`, {
      context: this,
      then(group){
        this.setState({group})
      }
    })
  }

  getCardDescription = ({meetings, members}) => `Meetings: ${Object.keys(meetings).length}  |  Members: ${Object.keys(members).length}`

  render(){ return this.state.group
    ? <Card
        image={'data:image/jpg;base64,' + this.state.group.image}
        text={this.getCardDescription(this.state.group)}
        title={this.state.group.name}
        color="rgba(0,0,0,.4)"
      />
    : <ProgressBar type="circular" mode="indeterminate" />
  }
}

let EmptyGroupCard = ({type}) => <div> no {type} groups</div>

let GroupViews = ({groups}) => {
  let style = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
  if(!groups)
    return <ProgressBar type="circular" mode="indeterminate" />
    let keys = Object.keys(groups);
    return <Tabs>
        {
          Object.keys(STATUS).map(status => {
            let count = keys.filter(key => groups[key] == status).length;
            console.log("count", status, count)
            return (<Tab label={status}>
              { count
                ? <div style={style}>
                    {keys.map(id =>
                      <div style={{margin: 3}}><GroupCard id={id}/></div>
                    )}
                  </div>
                : <EmptyGroupCard type={status} />
              }
            </Tab>)

          })
        }
      </Tabs>

}
