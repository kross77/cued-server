import React, { Component, PropTypes } from 'react'

class TextArea extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: props.value
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (event) {
    this.setState({ value: event.target.value })
    console.log(event.target.value)
    this.props.updateAction(this.props.theKey, event.target.value)
  }

  render () {
    return (
      <div className='form-group label-floating is-empty'>
        <label className='control-label' />
        <textarea type='text' className={this.props.class + ' form-control'} onChange={this.handleChange} value={this.state.value} />
      </div>
    )
  }
}
export default TextArea

