import firebase from '../../config/database'
import Config from '../../config/app'

/**
 * this promise loads once the firestore schema from realtime database
 * @type {Promise<any>}
 */
export function getFirestoreSchema () {
  return new Promise(
    (resolve, reject) => {
      firebase.app.database()
        .ref(Config.firestoreConfigPath)
        .once('value').then(
          function (snapshot) {
            let schema = snapshot.val()
            console.log('getFirestoreSchema', { path: Config.firestoreConfigPath, schema })
            resolve(schema)
          }
        )
    }
  )
}

export default getFirestoreSchema
