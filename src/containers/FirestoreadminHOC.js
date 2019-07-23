import React, { Component } from 'react'
import { compose } from 'recompose'
import { Link } from 'react-router'
import firebase from '../config/database'
import Input from '../components/fields/Input.js'
import Table from '../components/tables/Table.js'
import Config from '../config/app'
import Common from '../common.js'
import Notification from '../components/Notification'
import moment from 'moment'
import * as firebaseREF from 'firebase'
import { createPromiseHOC } from '../components/hoc/createPromiseHOC'
import { getFirestoreSchema } from '../components/firebase/getFirestoreSchema'
import { traceProps } from '../components/hoc/traceProps'

require('firebase/firestore')

const ROUTER_PATH = '/firestoreadmin/'

const withFirestore = (WrappedComponent) => class  extends Component {

  constructor (props) {
    super(props)

    // Create initial step
    this.state = {
      documents: [],
      collections: [],
      currentCollectionName: '',
      isCollection: false,
      isDocument: false,
      keyToDelete: null,
      pathToDelete: null,
      theSubLink: null,
      fieldsOfOnsert: null,
      isLoading: true,
      showAddCollection: '',
    }

    var call = Component.prototype.call;
    Component.prototype.call = function() {
      console.log(this, arguments);
      return call.apply(this, arguments);
    };

    // Bind function to this
    this.resetDataFunction = this.resetDataFunction.bind(this)
    this.getMeTheFirestorePath = this.getMeTheFirestorePath.bind(this)
    this.findFirestorePath = this.findFirestorePath.bind(this)
    this.getCollecitonDataFromFireStore = this.getCollecitonDataFromFireStore.bind(this)
    this.findDocumentCollections = this.findDocumentCollections.bind(this)
    this.setupFirestoreSchema = this.setupFirestoreSchema.bind(this)
    this.processRecords = this.processRecords.bind(this)
    this.processValueToSave = this.processValueToSave.bind(this)
    this.updatePartOfObject = this.updatePartOfObject.bind(this)
    this.updateAction = this.updateAction.bind(this)
    this.addDocumentToCollection = this.addDocumentToCollection.bind(this)
    this.addKey = this.addKey.bind(this)
    this.addItemToArray = this.addItemToArray.bind(this)
    this.showSubItems = this.showSubItems.bind(this)
    this.deleteFieldAction = this.deleteFieldAction.bind(this)
    this.doDelete = this.doDelete.bind(this)
    this.cancelDelete = this.cancelDelete.bind(this)
    this.cancelAddFirstItem = this.cancelAddFirstItem.bind(this)
    this.findHeadersBasedOnPath = this.findHeadersBasedOnPath.bind(this)
    this.makeCollectionTable = this.makeCollectionTable.bind(this)
    this.makeArrayCard = this.makeArrayCard.bind(this)
    this.makeTableCardForElementsInArray = this.makeTableCardForElementsInArray.bind(this)
    this.makeValueCard = this.makeValueCard.bind(this)
    this.generateBreadCrumb = this.generateBreadCrumb.bind(this)
  }

  /**
   * Step 0a
   * Start getting data
   */
  componentDidMount () {
    this.findFirestorePath()
  }

  /**
   * Step 0b
   * Resets data function
   */
  resetDataFunction () {
    var newState = {}
    newState.documents = []
    newState.collections = []
    newState.currentCollectionName = ''
    newState.fieldsAsArray = []
    newState.arrayNames = []
    newState.fields = []
    newState.arrays = []
    newState.elements = []
    newState.elementsInArray = []
    newState.theSubLink = null

    this.setState(newState)
    this.findFirestorePath()
  }

  /**
   * Step 0c
   * componentWillReceiveProps event of React, fires when component is mounted and ready to display
   * Start connection to firebase
   */
  componentWillReceiveProps (nextProps, nextState) {
    console.log('Next SUB: ' + nextProps.params.sub)
    console.log('Prev SUB : ' + this.props.params.sub)
    if (nextProps.params.sub == this.props.params.sub) {
      console.log('update now')
      this.setState({isLoading: true})
      this.resetDataFunction()
    }
  }

  /**
   * Step 0d
   * getMeTheFirestorePath created firestore path based on the router parh
   */
  getMeTheFirestorePath () {
    var thePath = (this.props.route.path.replace(ROUTER_PATH, '').
      replace(':sub', '')) + (this.props.params && this.props.params.sub
      ? this.props.params.sub
      : '').replace(/\+/g, '/')

    return thePath
  }

  /**
   * Step 1
   * Finds out the Firestore path
   * Also creates the path that will be used to access the insert
   */
  findFirestorePath () {
    var pathData = {}
    if (this.props.params && this.props.params.sub) {
      pathData.lastSub = this.props.params.sub
    }

    // Find the firestore path
    var firebasePath = this.getMeTheFirestorePath()
    pathData.firebasePath = firebasePath

    // Find last path - the last item
    var subPath = this.props.params && this.props.params.sub
      ? this.props.params.sub
      : ''
    var items = subPath.split(Config.adminConfig.urlSeparator)
    pathData.lastPathItem = Common.capitalizeFirstLetter(
      items[items.length - 1])
    pathData.completePath = subPath

    // Save this in state
    this.setState(pathData)

    // Go to next step of finding the collection data
    this.getCollecitonDataFromFireStore(firebasePath)
  }

  /**
   * Step 2
   * Connect to firestore to get the current item we need
   * @param {String} collection - this infact can be collection or document
   */
  getCollecitonDataFromFireStore (collection) {
    // Create the segmments based on the path / collection we have
    var segments = collection.split('/')
    var lastSegment = segments[segments.length - 1]

    // Is this a call to a collections data
    var isCollection = segments.length % 2

    // Reference to this
    var _this = this

    // Save know info for now
    this.setState({
      currentCollectionName: segments[segments.length - 1],
      isCollection: isCollection,
      isDocument: !isCollection,
    })

    // Get reference to firestore
    var db = firebase.app.firestore()

    // Here, we will save the documents from collection
    var documents = []

    if (isCollection) {
      // COLLECTIONS - GET DOCUMENTS

      db.collection(collection).get().then(function (querySnapshot) {
        var datacCount = 0
        querySnapshot.forEach(function (doc) {
          // Increment counter
          datacCount++

          // Get the object
          var currentDocument = doc.data()

          // Sace uidOfFirebase inside him
          currentDocument.uidOfFirebase = doc.id

          console.log(doc.id, ' => ', currentDocument)

          // Save in the list of documents
          documents.push(currentDocument)
        })
        console.log('DOCS----')
        console.log(documents)

        // Save the douments in the sate
        _this.setState({
          isLoading: false,
          documents: documents,
          showAddCollection: datacCount == 0 ? collection : '',
        })
        if (datacCount == 0) {
          _this.refs.addCollectionDialog.show()
        }
        console.log(_this.state.documents)
      })
    } else {
      // DOCUMENT - GET FIELDS && COLLECTIONS
      var referenceToCollection = collection.replace('/' + lastSegment, '')

      // Create reference to the document itseld
      var docRef = db.collection(referenceToCollection).doc(lastSegment)

      // Get the starting collectoin
      var parrentCollection = segments
      parrentCollection.splice(-1, 1)

      // Find the collections of this document
      this.findDocumentCollections(parrentCollection)

      docRef.get().then(function (doc) {
        if (doc.exists) {
          console.log('Document data:', doc.data())

          // Directly process the data
          _this.processRecords(doc.data())
        } else {
          console.log('No such document!')
        }
      }).catch(function (error) {
        console.log('Error getting document:', error)
      })
    }
  }

  /**
   * Step 3
   * findDocumentCollections - what collections should we display / currently there is no way to get collection form docuemnt
   * @param {Array} chunks - the collection / documents
   */
  findDocumentCollections (chunks) {
    console.log('Search for the schema now of ' + chunks)
    const {setupFirestoreSchema} = this
    const {firestoreDynamic} = Config
    // In firestore, use the last chunk only
    console.log('Modified chunk ' + chunks, {firestoreDynamic})
    setupFirestoreSchema(this.props.schema, chunks)
  }

  setupFirestoreSchema (theInsertSchemaObject, chunks) {
    chunks = [chunks[chunks.length - 1]]
    var cuurrentFields = null
    console.log('CHUNKS')
    console.log(chunks)

    // Foreach chunks, find the collections / fields
    chunks.map((item, index) => {
      console.log('current chunk:' + item)

      // Also make the last object any
      // In the process, check if we have each element in our schema
      if (theInsertSchemaObject != null && theInsertSchemaObject &&
        theInsertSchemaObject[item] &&
        theInsertSchemaObject[item]['collections']) {
        var isLastObject = (index == (chunks.length - 1))

        if (isLastObject && theInsertSchemaObject != null &&
          theInsertSchemaObject[item] &&
          theInsertSchemaObject[item]['fields']) {
          cuurrentFields = theInsertSchemaObject[item]['fields']
        }

        if (isLastObject && theInsertSchemaObject != null) {
          // It is last
          theInsertSchemaObject = theInsertSchemaObject[item]['collections']
        } else {
          theInsertSchemaObject = theInsertSchemaObject[item]['collections']
        }
      } else {
        theInsertSchemaObject = []
      }
      console.log('Current schema')
      console.log(theInsertSchemaObject)
    })

    // Save the collection to be shown as button and fieldsOfOnsert that will be used on inserting object
    this.setState(
      {collections: theInsertSchemaObject, fieldsOfOnsert: cuurrentFields})
  }

  /**
   * Step 4
   * Processes received records from firebase
   * @param {Object} records
   */
  processRecords (records) {
    console.log(records)

    var fields = {}
    var arrays = {}
    var elements = []
    var elementsInArray = []
    var newState = {}
    var directValue = ''
    newState.fieldsAsArray = fieldsAsArray
    newState.arrayNames = arrayNames
    newState.fields = fields
    newState.arrays = arrays
    newState.elements = elements
    newState.directValue = directValue
    newState.elementsInArray = elementsInArray
    newState.records = null

    this.setState(newState)

    // Each display is consisted of
    // Fields   - This are string, numbers, photos, dates etc...
    // Arrays   - Arrays of data, ex items:[0:{},1:{},2:{}...]
    //         - Or object with prefixes that match in array
    // Elements - Object that don't match in any prefix for Join - They are represented as buttons.

    // In FireStore
    // GeoPoint
    // DocumentReference

    // If record is of type array , then there is no need for parsing, just directly add the record in the arrays list
    if (Common.getClass(records) == 'Array') {
      // Get the last name
      console.log('This is array')
      var subPath = this.props.params && this.props.params.sub
        ? this.props.params.sub
        : ''
      var allPathItems = subPath.split('+')
      console.log(allPathItems)
      if (allPathItems.length > 0) {
        var lastItem = allPathItems[allPathItems.length - 1]
        console.log(lastItem)
        arrays[lastItem] = records
      }
      // this.setState({"arrays":this.state.arrays.push(records)})
    } else if (Common.getClass(records) == 'Object') {
      // Parse the Object record
      for (var key in records) {
        if (records.hasOwnProperty(key)) {
          var currentElementClasss = Common.getClass(records[key])
          console.log(key + '\'s class is: ' + currentElementClasss)

          // Add the items by their type
          if (currentElementClasss == 'Array') {
            // Add it in the arrays  list
            arrays[key] = records[key]
          } else if (currentElementClasss == 'Object') {
            // Add it in the elements list
            var isElementMentForTheArray = false // Do we have to put this object in the array
            for (var i = 0; i < Config.adminConfig.prefixForJoin.length; i++) {
              if (key.indexOf(Config.adminConfig.prefixForJoin[i]) > -1) {
                isElementMentForTheArray = true
                break
              }
            }

            var objToInsert = records[key]
            objToInsert.uidOfFirebase = key

            if (isElementMentForTheArray) {
              // Add this to the merged elements
              elementsInArray.push(objToInsert)
            } else {
              // Add just to elements
              elements.push(objToInsert)
            }
          } else if (currentElementClasss != 'undefined' &&
            currentElementClasss != 'null') {
            // This is string, number, or Boolean
            // Add it to the fields list
            fields[key] = records[key]
          } else if (currentElementClasss == 'GeoPoint') {
            // This is GeoPOint
            // Add it to the fields list
            fields[key] = records[key]
          } else if (currentElementClasss == 'DocumentReference') {
            // This is DocumentReference
            // Add it to the fields list
            fields[key] = records[key]
          }
        }
      }
    }
    if (Common.getClass(records) == 'String') {
      console.log('We have direct value of string')
      directValue = records
    }

    // Convert fields from object to array
    var fieldsAsArray = []
    console.log('Add the items now inside fieldsAsArray')
    console.log('Current schema')
    console.log(this.state.currentInsertStructure)
    // currentInsertStructure
    var keysFromFirebase = Object.keys(fields)
    console.log('keysFromFirebase')
    console.log(keysFromFirebase)
    var keysFromSchema = Object.keys(this.state.currentInsertStructure || {})
    console.log('keysFromSchema')
    console.log(keysFromSchema)

    keysFromSchema.forEach((key) => {
      if (fields.hasOwnProperty(key)) {
        fieldsAsArray.push({'theKey': key, 'value': fields[key]})
        var indexOfElementInFirebaseObject = keysFromFirebase.indexOf(key)
        if (indexOfElementInFirebaseObject > -1) {
          keysFromFirebase.splice(indexOfElementInFirebaseObject, 1)
        }
      }
    })

    console.log('keysFromFirebase')
    console.log(keysFromFirebase)

    keysFromFirebase.forEach((key) => {
      if (fields.hasOwnProperty(key)) {
        fieldsAsArray.push({'theKey': key, 'value': fields[key]})
      }
    })

    // Get all array names
    var arrayNames = []
    Object.keys(arrays).forEach((key) => {
      arrayNames.push(key)
    })

    var newState = {}
    newState.fieldsAsArray = fieldsAsArray
    newState.arrayNames = arrayNames
    newState.fields = fields
    newState.arrays = arrays
    newState.isJustArray = Common.getClass(records) == 'Array'
    newState.elements = elements
    newState.elementsInArray = elementsInArray
    newState.directValue = directValue
    newState.records = records
    newState.isLoading = false

    console.log('THE elements')
    console.log(elements)

    // Set the new state
    this.setState(newState)

    // Additional init, set the DataTime, check format if something goes wrong
    window.additionalInit()
  }

  /**
   *
   * Create R Update D
   *
   */

  /**
   * processValueToSave  - helper for saving in Firestore , converts value to correct format
   * @param {value} value
   * @param {type} type of field
   */
  processValueToSave (value, type) {
    // To handle number values
    if (!isNaN(value)) {
      value = Number(value)
    }

    // To handle boolean values
    value = value === 'true' ? true : (value === 'false' ? false : value)

    if (type == 'date') {
      // To handle date values
      if (moment(value).isValid()) {
        value = moment(value).toDate()
        // futureStartAtDate = new Date(moment().locale("en").add(1, 'd').format("MMM DD, YYYY HH:MM"))
      }
    }

    return value
  }

  /**
   * updatePartOfObject  - updates sub data from document in firestore, this also does Delete
   * @param {String} key to be updated
   * @param {String} value
   * @param {Boolean} refresh after action
   * @param {String} type of file
   * @param {String} firebasePath current firestore path
   * @param {String} byGivvenSubLink force link to field
   * @param {Function} callback function after action
   */
  updatePartOfObject (
    key, value, dorefresh = false, type = null, firebasePath,
    byGivvenSubLink = null, callback = null) {
    var subLink = this.state.theSubLink
    if (byGivvenSubLink != null) {
      subLink = byGivvenSubLink
    }
    console.log(
      'Sub save ' + key + ' to ' + value + ' and the path is ' + firebasePath +
      ' and theSubLink is ' + subLink)
    var chunks = subLink.split(
      Config.adminConfig.urlSeparatorFirestoreSubArray)
    var _this = this
    // First get the document
    // DOCUMENT - GET FIELDS && COLLECTIONS
    var docRef = firebase.app.firestore().doc(firebasePath)
    docRef.get().then(function (doc) {
      if (doc.exists) {
        var numChunks = chunks.length - 1
        var doc = doc.data()
        if (value == 'DELETE_VALUE') {
          if (numChunks == 2) {
            doc[chunks[1]].splice(chunks[2], 1)
          }
          if (numChunks == 1) {
            doc[chunks[1]] = null
          }
        } else {
          // Normal update, or insert
          if (numChunks == 2) {
            doc[chunks[1]][chunks[2]] = value
          }
          if (numChunks == 1) {
            doc[chunks[1]][key] = value
          }
        }

        if (key == 'NAME_OF_THE_NEW_KEY' || key == 'VALUE_OF_THE_NEW_KEY') {
          var ob = {}
          ob[key] = value
          _this.setState(ob)
        } else {
          console.log('Document data:', doc)
          _this.updateAction(chunks[1], doc[chunks[1]], dorefresh, null, true)
          if (callback) {
            callback()
          }
        }

        // alert(chunks.length-1);
        // _this.processRecords(doc.data())
        // console.log(doc);
      } else {
        console.log('No such document!')
      }
    }).catch(function (error) {
      console.log('Error getting document:', error)
    })
  }

  /**
   * Firebase update based on key / value,
   * This function also sets derect name and value
   * @param {String} key
   * @param {String} value
   */

  /**
   * updateAction  - updates sub data from document in firestore, this also does Delete
   * @param {String} key to be updated
   * @param {String} value
   * @param {Boolean} refresh after action
   * @param {String} type of file
   * @param {Boolean} forceObjectSave force saving sub object
   */
  updateAction (
    key, value, dorefresh = false, type = null, forceObjectSave = false) {
    value = this.processValueToSave(value, type)
    var firebasePath = (this.props.route.path.replace('/firestoreadmin/', '').
      replace(':sub', '')) + (this.props.params && this.props.params.sub
      ? this.props.params.sub
      : '').replace(/\+/g, '/')
    if (this.state.theSubLink != null && !forceObjectSave) {
      // alert(key+"<-mk->"+value+"<-->"+dorefresh+"<-->"+type+"<-->"+firebasePath)
      this.updatePartOfObject(key, value, dorefresh, type, firebasePath)
    } else {
      // value=firebase.firestore().doc("/users/A2sWwzDop0EAMdfxfJ56");
      // key="creator";

      console.log('firebasePath from update:' + firebasePath)
      console.log('Update ' + key + ' into ' + value)

      if (key == 'NAME_OF_THE_NEW_KEY' || key == 'VALUE_OF_THE_NEW_KEY') {
        console.log('THE_NEW_KEY')
        var updateObj = {}
        updateObj[key] = value
        this.setState(updateObj)
        console.log('-- OBJ update --')
        console.log(updateObj)
      } else {
        var db = firebase.app.firestore()

        var databaseRef = db.doc(firebasePath)
        var updateObj = {}
        updateObj[key] = value
        databaseRef.set(updateObj, {merge: true})
      }
    }
  }

  /**
   * addDocumentToCollection  - used recursivly to add collection's document's collections
   * @param {String} name name of the collection
   * @param {FirestoreReference} reference
   */
  async addDocumentToCollection (name, reference = null) {
    var pathChunks = this.state.firebasePath.split('/')
    pathChunks.pop()
    var withoutLast = pathChunks.join('/')
    console.log(name + ' vs ' + withoutLast)
    // Find the fields to be inserted
    const schema = this.props.schema

    console.log('schema', {schema, name})
    var theInsertSchemaObject = schema[name].fields
    console.log(JSON.stringify(theInsertSchemaObject))

    // Find the collections to be inserted
    var theInsertSchemaCollections = schema[name].collections
    console.log(JSON.stringify(theInsertSchemaCollections))

    // Reference to root firestore or existing document reference
    var db = reference == null ? (pathChunks.length > 1
      ? firebase.app.firestore().doc(withoutLast)
      : firebase.app.firestore()) : reference

    // Check type of insert
    var isTimestamp = Config.adminConfig.methodOfInsertingNewObjects ==
      'timestamp'

    // Create new element
    var newElementRef = isTimestamp
      ? db.collection(name).doc(Date.now())
      : db.collection(name).doc()
    // Add data to the new element
    newElementRef.set(theInsertSchemaObject)

    // Go over sub collection and insert them
    if (theInsertSchemaCollections) {
      for (var i = 0; i < theInsertSchemaCollections.length; i++) {
        this.addDocumentToCollection(theInsertSchemaCollections[i],
          newElementRef)
      }
    }

    // Show the notification on root element
    if (reference == null) {
      this.cancelAddFirstItem()
      var message = 'Element added. You can find it in the table bellow.'
      if (Config.adminConfig.goDirectlyInTheInsertedNode) {
        this.props.router.push(this.props.route.path.replace(':sub', '') +
          (this.props.params && this.props.params.sub
            ? this.props.params.sub
            : '') + Config.adminConfig.urlSeparator + newElementRef.id)
        message = 'Element added. You can now edit it'
      }
      this.setState({notifications: [{type: 'success', content: message}]})
      this.refreshDataAndHideNotification()

      if (Config.adminConfig.goDirectlyInTheInsertedNode) {
        this.props.router.push(this.props.route.path.replace(':sub', '') +
          (this.props.params && this.props.params.sub
            ? this.props.params.sub
            : '') + Config.adminConfig.urlSeparator + newElementRef.id)
      }
    }
  }

  /**
   * addKey
   * Adds key in our list of fields in firestore
   */
  addKey () {
    if (this.state.NAME_OF_THE_NEW_KEY &&
      this.state.NAME_OF_THE_NEW_KEY.length > 0) {
      if (this.state.VALUE_OF_THE_NEW_KEY &&
        this.state.VALUE_OF_THE_NEW_KEY.length > 0) {
        this.setState(
          {notifications: [{type: 'success', content: 'New key added.'}]})
        this.updateAction(this.state.NAME_OF_THE_NEW_KEY,
          this.state.VALUE_OF_THE_NEW_KEY)
        this.refs.simpleDialog.hide()
        this.refreshDataAndHideNotification()
      }
    }
  }

  /**
   * addItemToArray  - add item to array
   * @param {String} name name of the array
   * @param {Number} howLongItIs count of items, to know the next index
   */
  addItemToArray (name, howLongItIs) {
    console.log('Add item to array ' + name)
    console.log('Is just array ' + this.state.isJustArray)

    console.log('Data ')
    console.log(this.state.fieldsOfOnsert)

    var dataToInsert = null
    var correctPathToInsertIn = ''
    if (this.state.fieldsOfOnsert) {
      if (this.state.isJustArray) {
        console.log('THIS IS Array')
        dataToInsert = this.state.fieldsOfOnsert[0]
        correctPathToInsertIn = this.state.firebasePath +
          Config.adminConfig.urlSeparatorFirestoreSubArray +
          (parseInt(howLongItIs))
      } else {
        dataToInsert = this.state.fieldsOfOnsert[name]
        dataToInsert = dataToInsert ? dataToInsert[0] : null
        correctPathToInsertIn = this.state.firebasePath +
          Config.adminConfig.urlSeparatorFirestoreSubArray + name +
          Config.adminConfig.urlSeparatorFirestoreSubArray +
          (parseInt(howLongItIs))
      }
    }

    console.log('Data to insert')
    console.log(dataToInsert)
    console.log('Path to insert')
    console.log(correctPathToInsertIn)

    var _this = this
    this.updatePartOfObject('DIRECT_VALUE_OF_CURRENT_PATH', dataToInsert, true,
      null, this.state.firebasePath, correctPathToInsertIn, function (e) {
        _this.setState(
          {notifications: [{type: 'success', content: 'New element added.'}]})
        _this.refreshDataAndHideNotification()
      })
  }

  /**
   *
   * C Read U D
   *
   */

  /**
   * showSubItems - displays sub object, mimics opening of new page
   * @param {String} theSubLink , direct link to the sub object
   */
  showSubItems (theSubLink) {
    var chunks = theSubLink.split(
      Config.adminConfig.urlSeparatorFirestoreSubArray)
    this.setState({
      itemOfInterest: chunks[1],
      theSubLink: theSubLink,
    })
    var items = this.state.records
    for (var i = 1; i < chunks.length; i++) {
      console.log(chunks[i])
      items = items[chunks[i]]
    }
    console.log('--- NEW ITEMS ')
    console.log(items)
    this.processRecords(items)
  }

  /**
   *
   * C R U Delete
   *
   */

  /**
   * deleteFieldAction - displays sub object, mimics opening of new page
   * @param {String} key to be updated
   * @param {Boolean} isItArrayItem
   * @param {String} theLink
   */
  deleteFieldAction (key, isItArrayItem = false, theLink = null) {
    console.log('Delete ' + key)
    console.log(theLink)
    if (theLink != null) {
      theLink = theLink.replace('/firestoreadmin', '')
    }
    if (isNaN(key)) {
      isItArrayItem = false
    }
    console.log('Is it array: ' + isItArrayItem)
    var firebasePathToDelete = (this.props.route.path.replace(ROUTER_PATH, '').
      replace(':sub', '')) + (this.props.params && this.props.params.sub
      ? this.props.params.sub
      : '').replace(/\+/g, '/')
    if (key != null) {
      // firebasePathToDelete+=("/"+key)
    }

    console.log('firebasePath for delete:' + firebasePathToDelete)
    this.setState({
      pathToDelete: theLink || firebasePathToDelete,
      isItArrayItemToDelete: isItArrayItem,
      keyToDelete: theLink ? '' : key,
    })
    window.scrollTo(0, 0)
    this.refs.deleteDialog.show()
  }

  /**
   * doDelete - do the actual deleting based on the data in the state
   */
  doDelete () {
    var _this = this
    console.log('Do delete ')
    console.log('Is it array ' + this.state.isItArrayItemToDelete)
    console.log('Path to delete: ' + this.state.pathToDelete)
    var completeDeletePath = this.state.pathToDelete + '/' +
      this.state.keyToDelete
    console.log('completeDeletePath to delete: ' + completeDeletePath)
    if (this.state.pathToDelete.indexOf(
      Config.adminConfig.urlSeparatorFirestoreSubArray) > -1) {
      // Sub data
      _this.refs.deleteDialog.hide()
      this.updatePartOfObject('DIRECT_VALUE_OF_CURRENT_PATH', 'DELETE_VALUE',
        true, null, this.state.firebasePath, this.state.pathToDelete,
        function (e) {
          _this.setState(
            {notifications: [{type: 'success', content: 'Element deleted.'}]})
          _this.refreshDataAndHideNotification()
        })
    } else {
      // Normal data

      var chunks = completeDeletePath.split('/')

      var db = firebase.app.firestore()

      if (chunks.length % 2) {
        // odd
        // Delete fields from docuemnt
        var refToDoc = db.doc(this.state.pathToDelete)

        // Remove the 'capital' field from the document
        var deleteAction = {}
        deleteAction[this.state.keyToDelete] = firebaseREF.firestore.FieldValue.delete()
        var removeKey = refToDoc.update(deleteAction).then(function () {
          console.log('Document successfully deleted!')
          _this.refs.deleteDialog.hide()
          _this.setState({
            keyToDelete: null,
            pathToDelete: null,
            notifications: [{type: 'success', content: 'Field is deleted.'}],
          })
          _this.refreshDataAndHideNotification()
        }).catch(function (error) {
          console.error('Error removing document: ', error)
        })
      } else {
        // even
        // delete document from collection
        // alert("Delete document "+completeDeletePath);
        db.collection(this.state.pathToDelete).
          doc(this.state.keyToDelete).
          delete().
          then(function () {
            console.log('Document successfully deleted!')
            _this.refs.deleteDialog.hide()
            _this.setState({
              pathToDelete: null,
              notifications: [{type: 'success', content: 'Field is deleted.'}],
            })
            _this.refreshDataAndHideNotification()
          }).
          catch(function (error) {
            console.error('Error removing document: ', error)
          })
      }
    }

    /* firebase.database().ref(this.state.pathToDelete).set(null).then((e)=>{
      console.log("Delete res: "+e)
      this.refs.deleteDialog.hide();
      this.setState({keyToDelete:null,pathToDelete:null,notifications:[{type:"success",content:"Field is deleted."}]});
      this.refreshDataAndHideNotification();

    }) */
  }

  /**
   * cancelDelete - user click on cancel
   */
  cancelDelete () {
    console.log('Cancel Delete')
    this.refs.deleteDialog.hide()
  }

  cancelAddFirstItem () {
    console.log('Cancel Add')
    this.refs.addCollectionDialog.hide()
  }

  /**
   *
   * UI GENERATORS
   *
   */

  /**
   * This function finds the headers for the current menu
   * @param firebasePath - we will use current firebasePath to find the current menu
   */
  findHeadersBasedOnPath (firebasePath) {
    var headers = null

    var itemFound = false
    var navigation = Config.navigation
    for (var i = 0; i < navigation.length && !itemFound; i++) {
      if (navigation[i].path == firebasePath && navigation[i].tableFields &&
        navigation[i].link == 'firestoreadmin') {
        headers = navigation[i].tableFields
        itemFound = true
      }

      // Look into the sub menus
      if (navigation[i].subMenus) {
        for (var j = 0; j < navigation[i].subMenus.length; j++) {
          if (navigation[i].subMenus[j].path == firebasePath &&
            navigation[i].subMenus[j].tableFields &&
            navigation[i].subMenus[j].link == 'firestoreadmin') {
            headers = navigation[i].subMenus[j].tableFields
            itemFound = true
          }
        }
      }
    }
    return headers
  }

  /**
   * makeCollectionTable
   * Creates single collection documents
   */
  makeCollectionTable () {
    var name = this.state.currentCollectionName
    return (
      <div className='col-md-12' key={name}>
        <div className='card'>
          <div className='card-header card-header-icon'
               data-background-color='purple'>
            <i className='material-icons'>assignment</i>
          </div>
          <a onClick={() => { this.addDocumentToCollection(name) }}>
            <div id='addDiv' className='card-header card-header-icon'
                 data-background-color='purple' style={{float: 'right'}}>
              <i className='material-icons'>add</i>
            </div>
          </a>
          <div className='card-content'>
            <h4 className='card-title'>{Common.capitalizeFirstLetter(name)}</h4>
            <div className='toolbar'/>
            <div className='material-datatables'>
              <Table
                caller={'firestore'}
                headers={this.findHeadersBasedOnPath(this.state.firebasePath)}
                deleteFieldAction={this.deleteFieldAction}
                fromObjectInArray
                name={name}
                routerPath={this.props.route.path}
                isJustArray={false}
                sub={this.props.params && this.props.params.sub
                  ? this.props.params.sub
                  : ''}
                data={this.state.documents}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  /**
   * Creates single array section
   * @param {String} name, used as key also
   */
  makeArrayCard (name) {
    return (
      <div className='col-md-12' key={name}>
        <div className='card'>
          <div className='card-header card-header-icon'
               data-background-color='purple'>
            <i className='material-icons'>assignment</i>
          </div>
          <a onClick={() => {
            this.addItemToArray(name, this.state.arrays[name].length)
          }}>
            <div id='addDiv' className='card-header card-header-icon'
                 data-background-color='purple' style={{float: 'right'}}>
              <i className='material-icons'>add</i>
            </div>
          </a>
          <div className='card-content'>
            <h4 className='card-title'>{Common.capitalizeFirstLetter(name)}</h4>
            <div className='toolbar'/>
            <div className='material-datatables'>
              <Table
                caller={'firestore'}
                isFirestoreSubArray
                showSubItems={this.showSubItems}
                headers={this.findHeadersBasedOnPath(this.state.firebasePath)}
                deleteFieldAction={this.deleteFieldAction}
                fromObjectInArray={false} name={name}
                routerPath={this.props.route.path}
                isJustArray={this.state.isJustArray}
                sub={this.props.params && this.props.params.sub
                  ? this.props.params.sub
                  : ''}
                data={this.state.arrays[name]}/>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /**
   * Creates  table section for the elements object
   * @param {String} name, used as key also
   */
  makeTableCardForElementsInArray () {
    const lastPathItemName = this.state.lastPathItem
    return (
      <div className='col-md-12' key={lastPathItemName}>
        <div className='card'>
          <div className='card-header card-header-icon'
               data-background-color='purple'>
            <i className='material-icons'>assignment</i>
          </div>

          <div className='card-content'>
            <h4 className='card-title'>{Common.capitalizeFirstLetter(
              lastPathItemName)}</h4>
            <div className='toolbar'/>
            <div className='material-datatables'>
              <Table
                caller={'firestore'}
                isFirestoreSubArray
                showSubItems={this.showSubItems}
                headers={this.findHeadersBasedOnPath(this.state.firebasePath)}
                deleteFieldAction={this.deleteFieldAction}
                fromObjectInArray name={lastPathItemName}
                routerPath={this.props.route.path}
                isJustArray={this.state.isJustArray}
                sub={this.props.params && this.props.params.sub
                  ? this.props.params.sub
                  : ''} data={this.state.elementsInArray}/>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /**
   * Creates direct value section
   * @param {String} value, valu of the current path
   */
  makeValueCard (value) {
    return (
      <div className='col-md-12'>
        <div className='card'>
          <div className='card-header card-header-icon'
               data-background-color='purple'>
            <i className='material-icons'>assignment</i>
          </div>
          <div className='card-content'>
            <h4 className='card-title'>Value</h4>
            <div className='toolbar'/>
            <div>
              <Input updateAction={this.updateAction} class=''
                     theKey='DIRECT_VALUE_OF_CURRENT_PATH' value={value}/>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /**
   * generateBreadCrumb
   */
  generateBreadCrumb () {
    const subPath = this.props.params && this.props.params.sub
      ? this.props.params.sub
      : ''
    const items = subPath.split(Config.adminConfig.urlSeparator)
    let path = '/firestoreadmin/'
    return (
      <div>
        {
          items.map((item, index) => {
            if (index === 0) {
              path += item
            } else {
              path += '+' + item
            }

            return (
              <Link className='navbar-brand' to={path}>{item}
                <span
                  className='breadcrumbSeparator'>
          {index === items.length - 1
            ? ''
            : '/'}
            </span>
                <div className='ripple-container'/>
              </Link>
            )
          })}</div>)
  }

  /**
   * generateNotifications
   * @param {Object} item - notification to be created
   */
  generateNotifications (item) {
    return (
      <div className='col-md-12'>
        <Notification type={item.type}>{item.content}</Notification>
      </div>
    )
  }

  /**
   * refreshDataAndHideNotification
   * @param {Boolean} refreshData
   * @param {Number} time
   */
  refreshDataAndHideNotification (refreshData = true, time = 3000) {
    // Refresh data,
    if (refreshData) {
      this.resetDataFunction()
    }

    // Hide notifications
    setTimeout(function () { this.setState({notifications: []}) }.bind(this),
      time)
  }

  // MAIN RENDER FUNCTION
  render () {
    return (
      <WrappedComponent {...{
        ...this.props,
        state: this.state,
        resetDataFunction: this.resetDataFunction,
        getMeTheFirestorePath: this.getMeTheFirestorePath,
        findFirestorePath: this.findFirestorePath,
        getCollecitonDataFromFireStore: this.getCollecitonDataFromFireStore,
        findDocumentCollections: this.findDocumentCollections,
        setupFirestoreSchema: this.setupFirestoreSchema,
        processRecords: this.processRecords,
        processValueToSave: this.processValueToSave,
        updatePartOfObject: this.updatePartOfObject,
        updateAction: this.updateAction,
        addDocumentToCollection: this.addDocumentToCollection,
        addKey: this.addKey,
        addItemToArray: this.addItemToArray,
        showSubItems: this.showSubItems,
        deleteFieldAction: this.deleteFieldAction,
        doDelete: this.doDelete,
        cancelDelete: this.cancelDelete,
        cancelAddFirstItem: this.cancelAddFirstItem,
        findHeadersBasedOnPath: this.findHeadersBasedOnPath,
        makeCollectionTable: this.makeCollectionTable,
        makeArrayCard: this.makeArrayCard,
        makeTableCardForElementsInArray: this.makeTableCardForElementsInArray,
        makeValueCard: this.makeValueCard,
        generateBreadCrumb: this.generateBreadCrumb,
        generateNotifications: this.generateNotifications,
        refreshDataAndHideNotification: this.refreshDataAndHideNotification

      }} />
    )
  }
}

export default withFirestore
