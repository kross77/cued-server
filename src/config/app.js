import devConfig from './configs/config.dev.json'
import defaultConfig from './configs/config.default.json'

const env = process.env.ENV || 'dev'

export const getConfigBYEnv = (env) => ({
  'dev': devConfig,
  'default': defaultConfig
})[env]

// get config via env variable
const config = getConfigBYEnv('default')
console.log('loaded config', {config, env, envVars: process.env})

export default config
