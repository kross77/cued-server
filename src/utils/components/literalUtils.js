export const separateLiteralToProps = (strings, ...values) => ({ strings, values })

export const combineProps = (...values) => values.reduce((a, b) => ({
  values: a.values.concat(b.values),
  strings: a.strings.concat(b.strings)
}), { strings: [], values: [] })

export const applyProps = (fn, props) => fn(props.strings, ...props.values)
