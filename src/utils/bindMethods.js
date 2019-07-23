import { compound } from './compound'
import { traceFn } from '../components/hoc/traceFn'

export const bindMethods = (className, arr, self) => arr.forEach(key => {
      this[key].bind(self)
})
