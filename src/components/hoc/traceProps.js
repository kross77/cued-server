import { mapProps } from 'recompose'

export const traceProps = (title, mapFn = (v) => v) =>
  mapProps(
    props => console.log(title, mapFn(props)) || props
  )

export default traceProps
