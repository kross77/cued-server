const getProp = (name, props) => name === '' ? props : ({ [name]: props })

export const defineNewPropsIn =
  (parentName = '', propsDefiner) => (props = {}) =>
    propsDefiner.reduce((results, [name, fn]) => ({
      ...results,
      [parentName]: { ...results[parentName], ...getProp(name, fn({ ...results, ...results[parentName] })) }
    }), props)

export const defineNewProps =
  (propsDefiner) => props =>
    propsDefiner.reduce((results, [name, fn]) => ({
      ...results,
      ...getProp(name, fn(results))
    }), props)
