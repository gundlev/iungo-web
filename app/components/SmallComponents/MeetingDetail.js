import React from 'react'
import Style from '../../style.scss'

import Time from 'react-time'

import {List, ListItem} from 'react-toolbox'

const Participants = ({participants}) => participants
    ?
    <List>
    <p>Participants:</p>
        { Object.keys(participants).map((id) =>
            <ListItem
                key={id}
                avatar='https://dl.dropboxusercontent.com/u/2247264/assets/m.jpg'
                caption={id}
                legend={id}
            />
        )}
    </List>
    :
    <div>No participants</div>
;

export default ({id, title, address, text, endTimestamp, startTimestamp, participants}) => <div>
  <h3>{title}</h3>
  <p>{address}</p>
    <Time value={new Date(startTimestamp*1000)} format={"DD/MM/YYYY"}/>
    <span>  </span>
    <Time value={new Date(startTimestamp*1000)} format={"HH:mm"}/>
    <span> - </span>
    <Time value={new Date(endTimestamp*1000)} format={"HH:mm"}/>
    <p>{text}</p>
    <Participants participants={participants}/>
</div>
