import { mapProps } from 'recompose'
import { defineNewProps, defineNewPropsIn } from './defineNewProps'

export const log = (m = 'log => ') => mapProps(props => /* console.log(m, props) || */ props)

export const defineProp = (propName, fn) => mapProps(props => ({ ...props, [propName]: fn(props) }))

export const defineProps = (propsToDefine) =>
  mapProps(props => ({ ...props, ...propsToDefine.reduce((all, p) => ({ ...all, ...extract({ ...props, ...all }, p) }), {}) }))

const extract = (props, v) => Array.isArray(v) ? mapFn(props, v) : mapFn2(v)

const mapFn = (props, [propName, fn]) => ({ [propName]: fn(props) })
const mapFn2 = (v) => ({ ...v })

export const attachTo = (propName, propsDefiner) => mapProps(defineNewPropsIn(propName, propsDefiner))
export const attach = (propsDefiner) => mapProps(defineNewProps(propsDefiner))
