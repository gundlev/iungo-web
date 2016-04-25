/**
 * Created by Niklas on 25/04/16.
 */

import React, {Component} from 'react'
import Firebase from 'firebase'
import Rebase from 're-base'
import {Tab, Tabs} from 'react-toolbox'
import utils from '../../utils/firebaseUtils'
import {URL} from '../../config/firebase'
import Style from '../../style.scss'
import MeetingList from '../SmallComponents/MeetingList'
import MeetingDetail from '../SmallComponents/MeetingDetail'
import NewMeeting from './NewMeeting'
import NewNotification from './NewNotification'

class Group extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    render() {
        return (
            <div>

            </div>
        )
    }
    
    
}

export default Group
