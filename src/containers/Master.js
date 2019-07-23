import React, { Component, PropTypes } from 'react'
import md5 from 'md5'
import NavItem from '../components/NavItem'
import Config from '../config/app'

import firebase from './../config/database'
var pjson = require('../../package.json')

class Master extends Component {
  constructor (props) {
    super(props)
    this.state = { user: {} }
    this.handleLogout = this.handleLogout.bind(this)
    this.authListener = this.authListener.bind(this)
    this.printMenuItem = this.printMenuItem.bind(this)
  }

  componentDidMount () {
    this.authListener()
  }

  authListener () {
    const setUser = (user) => {
      this.setState({ user: user })
    }
    firebase.app.auth().onAuthStateChanged(function (user) {
      if (user) {
        setUser(user)
        // User is signed in.
        console.log('User has Logged  in Master')
        console.log(user.email)
        // window.setSideBG(Config.adminConfig.design.sidebarBg)
      } else {
        // No user is signed in.
        console.log('User has logged out Master')
      }
    })
  }

  handleLogout (e) {
    e.preventDefault()

    console.log('The link was clicked.')
    firebase.app.auth().signOut()
  }

  ValidURL (str) {
    var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/
    if (!regex.test(str)) {
      return false
    } else {
      return true
    }
  }

  printMenuItem (menu) {
    var menuPath = this.ValidURL(menu.path) ? menu.path : menu.path.replace(/\//g, Config.adminConfig.urlSeparator)
    if (menu.subMenus && menu.subMenus.length > 0) {
      return (
        <li key='list'>
          <a data-toggle='collapse' href={'#' + menuPath} className='collapsed' aria-expanded='false'>
            <i className='material-icons'>{menu.icon}</i>
            <p>{menu.name}
              <b className='caret' />
            </p>
          </a>
          <div className='collapse' id={menuPath} aria-expanded='false'>

            <ul className='nav'>
              {menu.subMenus.map(this.printMenuItem)}
            </ul>
          </div>
        </li>
      )
    } else {
      return (<NavItem key={menuPath} index={menu.isIndex} onlyActiveOnIndex={menu.isIndex} menuPath={menuPath} to={menu.link + '/' + menuPath}>
        <i className='material-icons'>{menu.icon}</i>
        <p>{menu.name}</p>
      </NavItem>)
    }
  }

  render () {
    var bgStyle = {
      backgroundImage: 'require(../../assets/img/' + Config.adminConfig.design.sidebarBg + ')'
    }

    return (
      <div className='wrapper'>

        <div id='theSideBar' className='sidebar' has-image='true' data-active-color={Config.adminConfig.design.dataActiveColor} data-background-color={Config.adminConfig.design.dataBackgroundColor}>
          <div className='sidebar-wrapper'>
            <div className='user'>
              <div className='photo'>

                <img src={this.state.user.photoURL ? this.state.user.photoURL : 'http://www.gravatar.com/avatar/' + md5(this.state.user.email + '') + '?s=512'} />
              </div>
              <div className='info'>
                <a data-toggle='collapse' href='#collapseExample' className='collapsed'>{this.state.user.email}<b className='caret' /></a>
                <div className='collapse' id='collapseExample'>
                  <ul className='nav'>
                    <li>
                      <a onClick={this.handleLogout} >Logout</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <ul className='nav'>
              {Config.navigation.map(this.printMenuItem)}
            </ul>
          </div>

          <div className='sidebar-background' style={bgStyle} />

        </div>

        <div className='main-panel'>
          {this.props.children}
          <footer className='footer'>
            <div className='container-fluid'>
              <nav className='pull-left'>
                <ul />
              </nav>
              <p className='copyright pull-right'>
                        &copy;
                <script>
                            document.write(new Date().getFullYear())
                </script>
                <a href='#'>{Config.adminConfig.appName}</a>, {Config.adminConfig.slogan}.  v{pjson.version}
              </p>
            </div>
          </footer>
        </div>

      </div>)
  }
}

export default Master
