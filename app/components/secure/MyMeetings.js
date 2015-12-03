import React, {Component} from 'react'
import Firebase from 'firebase'
import Rebase from 're-base'
import {List} from 'react-toolbox'
import utils from '../../utils/firebaseUtils'
import {URL} from '../../config/firebase'
import Style from '../../style.scss'
import MeetingList from '../SmallComponents/MeetingList.js'

/*
1. make call to ngroup for the user and get references
2. make call
*/
let base = Rebase.createClass(URL)
let refs = []

function listenTo(path, options){
  let ref = base.listenTo(path, options)
  refs.push(ref)
  return ref
}

class MyMeetings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      lists: {},
      meetings: {},
      categories: ['Tilmeldt', 'Afmeldt', 'Ikke svaret'],
      current: {},
      currentTabIndex: 0,
      groups: {}
    }
  }

  categorizeMeetings = () => {
    console.log('Categorizing!')
    var meetings = this.state.meetings
    var currentTabIndex = this.state.currentTabIndex
    this.setState({current: {}})
    Object.keys(meetings).forEach(group =>{
      Object.keys(meetings[group]).forEach(meetingId => {
        if (meetingId != 'groupName') {
          var val = meetings[group][meetingId]['participants'][this.props.uid]['status']
          // console.log(val);
          if (currentTabIndex === 0 && val === 1) {
            var meeting = meetings[group][meetingId]
            meeting['groupId'] = group
            meeting['groupName'] = meetings[group]['groupName'] 
            this.setState({
              current: {
                [meetingId] : meeting,
                ...this.state.current
              }
            })
          } else if (currentTabIndex === 1 && val === -1) {
            var meeting = meetings[group][meetingId]
            meeting['groupId'] = group
            meeting['groupName'] = meetings[group]['groupName'] 
            this.setState({
              current: {
                [meetingId] : meeting,
                ...this.state.current
              }
            })
          } else if (currentTabIndex === 2 && val === 0) {
            var meeting = meetings[group][meetingId]
            meeting['groupId'] = group
            meeting['groupName'] = meetings[group]['groupName']
            this.setState({
              current: {
                [meetingId] : meeting,
                ...this.state.current
              }
            })
          }
        }
      })
    })
  }

  componentDidMount(){
    listenTo(`users/${this.props.uid}/ngroup`, {
      context: this,
      then(groupRefs){
        console.log('Recieved from ngroup');
        Object.keys(groupRefs).forEach(key =>{
          let ref = groupRefs[key];
          listenTo(ref, {
            context: this,
            then(s){
              console.log('Recieved from aktiv status');
              if (s === 'aktiv') {
                listenTo(`networkgroups/${key}`, {
                  context: this,
                  state: 'groups',
                  then(group){
                    console.log('Recieved from group');
                    console.log('The key ' + key);
                    console.log(group);
                    if (group.hasOwnProperty('meetings')) {
                      console.log('Has meetings');
                      var meetings = group['meetings']
                      meetings['groupName'] = group['name']
                      //console.log(meetings)
                      this.setState({meetings: {
                        [key]: meetings,
                        ...this.state.meetings
                      }})
                      this.categorizeMeetings()
                    }
                  }
                })
              }
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

  render() {
    return(
      <div>
        <MeetingList list={this.state.current} />
      </div>
    )
  }
}

export default MyMeetings



// var lists = [{
//   "-JzenXCX2jW976YpwCaV" : {
//     "address" : "Parkvej 78, 2630 Taastrup",
//     "endTimestamp" : 1446742800,
//     "participants" : {
//       "2fda58c8-636e-455a-af71-f1180c4f7863" : {
//         "status" : 1
//       }
//     },
//     "startTimestamp" : 1446737400,
//     "text" : "Agenda er ikke fastlagt endnu",
//     "title" : "Stormøde Boost"
//   },
//   "-JzenXCX2jWGHKYpwCaV" : {
//     "address" : "Parkvej 78, 2630 Taastrup",
//     "endTimestamp" : 1446842800,
//     "participants" : {
//       "2fda58c8-636e-455a-af71-f1180c4f7863" : {
//         "status" : 1
//       }
//     },
//     "startTimestamp" : 1446837400,
//     "text" : "Agenda er ikke fastlagt endnu",
//     "title" : "Netværksmøde"
//   }
// }, {
//   "-JzenXCX2kla76YpwCaV" : {
//     "address" : "Parkvej 78, 2630 Taastrup",
//     "endTimestamp" : 1446942800,
//     "participants" : {
//       "2fda58c8-636e-455a-af71-f1180c4f7863" : {
//         "status" : 1
//       }
//     },
//     "startTimestamp" : 1446937400,
//     "text" : "Agenda er ikke fastlagt endnu",
//     "title" : "Møde"
//   }
// }] 


// switch (meetings[group][meetingId]['participants'][this.props.uid]['status']) {
//   case 1:
//     this.setState({
//       lists: {
//         'Tilmeldt': {
//           [meetingId]: meetings[group][meetingId],
//           ...this.state.lists['Tilmeldt']
//         },
//         ...this.state.lists
//       }
//     })
//   case 0:
//     this.setState({
//       lists: {
//         'Ikke svaret': {
//           [meetingId]: meetings[group][meetingId],
//           ...this.state.lists['Ikke svaret']
//         },
//         ...this.state.lists
//       }
//     })
//   case -1:
//     this.setState({
//       lists: {
//         'Afmeldt': {
//           [meetingId]: meetings[group][meetingId],
//           ...this.state.lists['Afmeldt']
//         },
//         ...this.state.lists
//       }
//     })
// }
