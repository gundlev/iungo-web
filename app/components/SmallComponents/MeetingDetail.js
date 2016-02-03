import React from 'react'
import Style from '../../style.scss'

import Time from 'react-time'

import {Tab, Tabs} from 'react-toolbox';

export default ({id, title, address, text, endTimestamp, startTimestamp}) => <div>
  <h3>{title}</h3>
  <p>{address}</p>
    <Time value={new Date(startTimestamp*1000)} format={"DD/MM/YYYY"}/>
    <span>  </span>
    <Time value={new Date(startTimestamp*1000)} format={"HH:mm"}/>
    <span> - </span>
    <Time value={new Date(endTimestamp*1000)} format={"HH:mm"}/>
    <p>{text}</p>
</div>
