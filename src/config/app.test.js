import Config, { getConfigBYEnv } from './app'
import devConfig from './configs/config.dev.json'
import defaultConfig from './configs/config.default.json'
import { updateObject } from '../utils'

describe('Config', () => {
  it('get\'s right config by environment', () => {
    expect(getConfigBYEnv(undefined)).toEqual(devConfig)
    expect(getConfigBYEnv('dev')).toEqual(devConfig)
    expect(getConfigBYEnv('default')).toEqual(defaultConfig)
  })

  it('updates config', () => {
    updateObject(Config, { firebaseConfig: 'test' })
    expect(Config.firebaseConfig).toBe('test')
    console.log({ Config })
    expect(Config.remoteSetup).toBe(true)
  })
})
