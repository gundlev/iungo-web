import React from 'react'
import {Route, IndexRoute} from 'react-router'
import Main from '../components/Main'
import Register from '../components/login-register/Register'
import Login from "../components/login-register/Login"
import Logout from '../components/login-register/Logout'
import Dashboard from '../components/secure/Dashboard'
import Home from "../components/Home"

import requireAuth from '../utils/authenticated'

export default
<Route path="/" component={Main}>
  <IndexRoute component={Home}/>
  <Route path="login" component={Login} />
  <Route path="logout" component={Logout} />
  <Route path="register" component={Register} />
  <Route path="dashboard" component={Dashboard} onEnter={requireAuth}/>
  <Route path="*" component={Home} />
</Route>
