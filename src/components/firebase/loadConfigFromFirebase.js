import Config from '../../config/app'
import { initFirebase } from './initFirebase'
import { updateObject } from '../../utils'

/**
 * Loads config from firebase and update existing config
 * @returns {Promise<void>}
 */
export const loadConfigFromFirebase = async () => {
  const snapshot = await initFirebase('config-loader').database().ref(Config.remotePath).once('value')
  return updateObject(Config, snapshot.val())
}

export default loadConfigFromFirebase
