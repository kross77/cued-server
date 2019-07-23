export const removeFromObjectKeys = (obj, keys) => {
  keys.forEach(key => {
    delete obj[key]
  })
  return obj
}

export const updateObject = (obj, update) => obj && Object.entries(obj).reduce(
  (reducedObj, [key, item]) => {
    reducedObj[key] = update[key] || item
    return reducedObj
  },
  obj)

export const reduceObj = (obj, reduceFn, defaultValue = {}) => obj &&
  reduceFn && Object.entries(obj).reduce(
  (reducedObj, [key, item]) =>
    ({ ...reducedObj, [key]: reduceFn(item, key) }),
  defaultValue)

export const objToArr = (
  obj,
  mapFn = ([id, value]) => ({ id, ...value })
) => obj && mapFn && Object.entries(obj).map(mapFn)

export const mapObj = (obj, mapFn) =>
  obj &&
  mapFn &&
  Object.entries(obj)
    .map(([id, value], index, items) => mapFn(id, value, index, items))
