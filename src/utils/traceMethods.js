import { compound } from './compound'
import { traceFn } from '../components/hoc/traceFn'

export const traceMethodsAndBind = (className, arr, self) => arr.forEach(key => {
  // Bind function to this
    this[key] = compound(traceFn(`${className} :: => ${key}`),
      this[key].bind(self))
})
