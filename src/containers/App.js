import React, { Component, PropTypes } from 'react'
import { Link, Redirect } from 'react-router'
import NavBar from '../components/NavBar'

class App extends Component {
  constructor (props) {
    super(props)
  }
  componentDidMount () {
    // Uncomment if you want to do a edirect
    // this.props.router.push('/fireadmin/clubs+skopje+items') //Path where you want user to be redirected initialy
  }
  render () {
    return (
      <div className='content'>
        <NavBar />

        Dashboard
        <br />
        Add your own content here, instructions etc...
      </div>
    )
  }
}
export default App
