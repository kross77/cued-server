export const mapWithNewInstance = (arr, fn) => {
  const newArr = []
  arr.forEach((v, i) => {
    newArr.push(fn(v, i, newArr))
  })
  return newArr
}

export const reduceArray = (arr, reduceFn) =>
  arr &&
  reduceFn &&
  arr.reduce(
    (reducedObj, [key, item]) =>
      ({ ...reducedObj, [key]: reduceFn(item, key) }),
    {})

export const limitArrayCount = (arr, num) => arr.filter((v, i) => i < num)
