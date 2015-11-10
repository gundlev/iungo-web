import React from 'react'
import {render} from 'react-dom'
import Router from 'react-router'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import routes from './config/routes'

import style from './style';

render(
  <Router routes={routes} history={createBrowserHistory()}/>,
  document.getElementById('app')
);
