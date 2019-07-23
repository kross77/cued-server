import * as firebase from 'firebase'
import Config from '../../config/app'

/**
 * this promise loads once the firestore schema from realtime database
 * @type {Promise<any>}
 */
export function initFirebase (applicationName = 'default') {
  return firebase.initializeApp(Config.firebaseConfig, applicationName)
}

export default initFirebase
