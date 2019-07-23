import Config from '../../config/app'
import firebase from '../../config/database'
import * as FirebaseSDK from 'firebase'
import React from 'react'
import { initFirebase } from './initFirebase'

export const withLoginStatus =
  WrappedComponent => class extends React.Component {
    state = {
      loggedIn: false,
      pushSettings: false,
    }

    checkPermissions = (user, successCallback) => {
      if (
        Config.adminConfig.allowedUsers === undefined ||
        Config.adminConfig.allowedUsers.indexOf(user.email) == -1
      ) {
        successCallback(user)
      } else {
        // Error, this user is not allowed anyway
        alert('The user ' + user.email +
          ' doens\'t have access to this admin panel!')
        firebase.app.auth().signOut()
      }

    }

    updateNavigationForSignedUser = (user) => {
      // Update Paths
      for (let index = 0; index < Config.navigation.length; index++) {
        Config.navigation[index].path = Config.navigation[index].path.replace(
          '{useruuid}', user.uid)
        if (Config.navigation[index].subMenus) {
          for (let subIndex = 0; subIndex <
          Config.navigation[index].subMenus.length; subIndex++) {
            Config.navigation[index].subMenus[subIndex].path = Config.navigation[index].subMenus[subIndex].path.replace(
              '{useruuid}', user.uid)
          }
        }
      }
    }

    updateRemotePushConfig = () => {
      if (Config.pushSettings.remoteSetup) {
        const fetcherPushConfigFirebaseApp = FirebaseSDK.initializeApp(
          Config.firebaseConfig, 'pushFetcher')
        fetcherPushConfigFirebaseApp.database().
          ref(Config.pushSettings.remotePath).
          once('value').
          then(function (snapshot) {
            // have to updated the state, to do the update on the childs
            Config.pushSettings = snapshot.val()
            this.setState({pushSettings: Config.pushSettings})
          })
      }

    }

    onUserAuth = (user) => {
      console.log('onUserAuth', {user})
      this.setState({loggedIn: true})
      this.updateNavigationForSignedUser(user)
      this.updateRemotePushConfig()
    }

    onAuthChanged = user => {
      console.log('onAuthChanged', {user})
        if (user) {
          this.checkPermissions(user, this.onUserAuth)
        } else {
          // No user is signed in.
          console.log('No user is signed in ')
          this.setState({loggedIn: false})
          if (window.display) {
            window.display()
          }
        }
    }

    componentDidMount = () => {
      const {checkPermissions, onUserAuth, setState} = this
      firebase.app = initFirebase()
      firebase.app.auth().onAuthStateChanged(this.onAuthChanged)
    }

    render () {
      return <WrappedComponent {...{...this.props, ...this.state}}/>
    }
  }

export default withLoginStatus
