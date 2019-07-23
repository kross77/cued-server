import React from 'react'
import { branch, compose, renderComponent } from 'recompose'
import Admin from '../../Admin'
import Login from '../../Login'
import Splash from '../../Splash'
import Config from '../../config/app'
import { createPromiseHOC } from '../../components/hoc/createPromiseHOC'
import { loadConfigFromFirebase } from '../../components/firebase/loadConfigFromFirebase'
import withLoginStatus from '../../components/firebase/withLoginStatus'
import traceProps   from '../../components/hoc/traceProps'

require('firebase/firestore')

const withRemoteConf = createPromiseHOC(loadConfigFromFirebase, 'config',
  () => <h1>Loading remote config</h1>)

const hoc = compose(
  withRemoteConf,
  withLoginStatus,
  traceProps('Navigator', (props => ({...props, Config}))),
  branch(({loggedIn}) => !loggedIn, renderComponent(Login))
)

export const Navigator = hoc(Admin)

export default Navigator

