import React, { Component } from 'react'
import { compose } from 'recompose'
import { Link } from 'react-router'
import firebase from '../config/database'
import Fields from '../components/fields/Fields.js'
import Input from '../components/fields/Input.js'
import Table from '../components/tables/Table.js'
import Config from '../config/app'
import Common from '../common.js'
import Notification from '../components/Notification'
import SkyLight from 'react-skylight'
import NavBar from '../components/NavBar'
import moment from 'moment'
import * as firebaseREF from 'firebase'
import { createPromiseHOC } from '../components/hoc/createPromiseHOC'
import { getFirestoreSchema } from '../components/firebase/getFirestoreSchema'
import { traceProps } from '../components/hoc/traceProps'
import $ from 'jquery'

require('firebase/firestore')

const ROUTER_PATH = '/firestoreadmin/'
const Loader = () => <h3>Loading</h3>

class FirestoreadminView extends Component {

  // MAIN RENDER FUNCTION
  render () {
    return (
      <div className='content'>
        <NavBar>{this.props.generateBreadCrumb()}</NavBar>

        <div className='content' sub={this.props.state.lastSub}>

          <div className='container-fluid'>

            <div style={{textAlign: 'center'}}>

              {this.props.state.isLoading ? <Loader color='#8637AD' size='12px'
                                              margin='4px'/> : ''}
            </div>

            {/* NOTIFICATIONS */}
            {this.props.state.notifications ? this.props.state.notifications.map(
              (notification) => {
                return this.props.generateNotifications(notification)
              }) : ''}

            {/* Documents in collection */}
            {this.props.state.isCollection && this.props.state.documents.length > 0
              ? this.props.makeCollectionTable()
              : ''}

            {/* DIRECT VALUE */}
            {this.props.state.directValue && this.props.state.directValue.length > 0
              ? this.props.makeValueCard(this.props.state.directValue)
              : ''}

            {/* FIELDS */}
            {this.props.state.fieldsAsArray && this.props.state.fieldsAsArray.length > 0 ? (
              <div className='col-md-12'>
                <div className='card'>
                  <a onClick={() => { $('#simpleDialog').show() }}>
                    <div id='addDiv' className='card-header card-header-icon'
                         data-background-color='purple'
                         style={{float: 'right'}}>
                      <i className='material-icons'>add</i>
                    </div>
                  </a>
                  <form className='form-horizontal'>
                    <div className='card-header card-header-text'
                         data-background-color='rose'>
                      <h4 className='card-title'>{Common.capitalizeFirstLetter(
                        Config.adminConfig.fieldBoxName)}</h4>
                    </div>
                    {this.props.state.fieldsAsArray ? this.props.state.fieldsAsArray.map(
                      (item) => {
                        return (
                          <Fields
                            isFirestore
                            parentKey={null}
                            key={item.theKey + this.props.state.lastSub}
                            deleteFieldAction={this.props.deleteFieldAction}
                            updateAction={this.props.updateAction}
                            theKey={item.theKey}
                            value={item.value}/>)
                      }) : ''}

                  </form>
                </div>
              </div>) : ''}

            {/* COLLECTIONS */}
            {this.props.state.theSubLink == null && this.props.state.isDocument &&
            this.props.state.collections && this.props.state.collections.length > 0 ? (
              <div className='col-md-12'>
                <div className='card'>

                  <form method='get' action='/' className='form-horizontal'>
                    <div className='card-header card-header-text'
                         data-background-color='rose'>
                      <h4 className='card-title'>{'Collections'}</h4>
                    </div>
                    <br/>
                    <div className='col-md-12'>
                      {this.props.state.theSubLink == null && this.props.state.collections
                        ? this.props.state.collections.map((item) => {
                          var theLink = '/firestoreadmin/' +
                            this.props.state.completePath +
                            Config.adminConfig.urlSeparator + item
                          return (<Link to={theLink}><a className='btn'>{item}
                            <div className='ripple-container'/>
                          </a></Link>)
                        })
                        : ''}
                    </div>

                  </form>
                </div>
              </div>) : ''}

            {/* ARRAYS */}
            {this.props.state.arrayNames ? this.props.state.arrayNames.map((key) => {
              return this.props.makeArrayCard(key)
            }) : ''}

            {/* ELEMENTS MERGED IN ARRAY */}
            {this.props.state.elementsInArray && this.props.state.elementsInArray.length > 0
              ? (this.props.makeTableCardForElementsInArray())
              : ''}

            {/* ELEMENTS */}
            {this.props.state.elements && this.props.state.elements.length > 0 ? (
              <div className='col-md-12'>
                <div className='card'>

                  <form method='get' action='/' className='form-horizontal'>
                    <div className='card-header card-header-text'
                         data-background-color='rose'>
                      <h4 className='card-title'>{this.props.state.lastPathItem +
                      '\' elements'}</h4>
                    </div>
                    <br/>
                    <div className='col-md-12'>
                      {this.props.state.elements ? this.props.state.elements.map((item) => {
                        var theLink = '/fireadmin/' + this.props.state.completePath +
                          Config.adminConfig.urlSeparatorFirestoreSubArray +
                          item.uidOfFirebase
                        return (
                          <Link
                            onClick={() => { this.props.showSubItems(theLink) }}><a
                            className='btn'>{item.uidOfFirebase}
                            <div className='ripple-container'/>
                          </a></Link>)
                      }) : ''}
                    </div>

                  </form>
                </div>
              </div>) : ''}

          </div>
        </div>
        <SkyLight hideOnOverlayClicked ref='deleteDialog' title=''>
          <span><h3 className='center-block'>Delete data</h3></span>
          <div className='col-md-12'>
            <Notification type='danger'>All data at this location, but not
              nested collections, will be deleted! To delete any collection's
              data go in each collection and detele the documents</Notification>
          </div>
          <div className='col-md-12'>
            Data Location
          </div>
          <div className='col-md-12'>
            <b>{this.props.state.pathToDelete + '/' + this.props.state.keyToDelete}</b>
          </div>

          <div className='col-sm-12' style={{marginTop: 80}}>
            <div className='col-sm-6'/>
            <div className='col-sm-3 center-block'>
              <a onClick={this.props.cancelDelete}
                 className='btn btn-info center-block'>Cancel</a>
            </div>
            <div className='col-sm-3 center-block'>
              <a onClick={this.props.doDelete}
                 className='btn btn-danger center-block'>Delete</a>
            </div>

          </div>

        </SkyLight>

        <SkyLight hideOnOverlayClicked ref='addCollectionDialog' title=''>
          <span><h3
            className='center-block'>Add first document in collection</h3></span>
          <div className='col-md-12'>
            <Notification type='success'>Looks like there are no documents in
              this collection. Add your first document in this
              collection</Notification>
          </div>

          <div className='col-md-12'>
            Data Location
          </div>
          <div className='col-md-12'>
            <b>{this.props.state.showAddCollection}</b>
          </div>

          <div className='col-sm-12' style={{marginTop: 80}}>
            <div className='col-sm-6'/>
            <div className='col-sm-3 center-block'>
              <a onClick={this.props.cancelAddFirstItem}
                 className='btn btn-info center-block'>Cancel</a>
            </div>
            <div className='col-sm-3 center-block'>
              <a onClick={() => {
                this.props.addDocumentToCollection(this.props.state.currentCollectionName)
              }} className='btn btn-success center-block'>ADD</a>
            </div>

          </div>

        </SkyLight>

        <SkyLight hideOnOverlayClicked id='simpleDialog' ref='simpleDialog' title=''>
          <span><h3 className='center-block'>Add new key</h3></span>
          <br/>
          <div className='card-content'>
            <div className='row'>
              <label className='col-sm-3 label-on-left'>Name of they key</label>
              <div className='col-sm-12'>
                <Input updateAction={this.props.updateAction} class=''
                       theKey='NAME_OF_THE_NEW_KEY' value={'name'}/>
              </div>
              <div className='col-sm-1'/>
            </div>
          </div>
          <br/><br/>
          <div className='card-content'>
            <div className='row'>
              <label className='col-sm-3 label-on-left'>Value</label>
              <div className='col-sm-12'>
                <Input updateAction={this.props.updateAction} class=''
                       theKey='VALUE_OF_THE_NEW_KEY' value={'value'}/>
              </div>
              <div className='col-sm-1'/>
            </div>
          </div>
          <div className='col-sm-12 '>
            <div className='col-sm-3 '/>
            <div className='col-sm-6 center-block'>
              <a onClick={this.props.addKey}
                 className='btn btn-rose btn-round center-block'><i
                className='fa fa-save'/> Add key</a>
            </div>
            <div className='col-sm-3 '/>
          </div>
        </SkyLight>
      </div>
    )
  }
}


export default FirestoreadminView
