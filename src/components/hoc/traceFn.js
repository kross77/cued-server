export const traceFn = (title, mapFn = (v) => v) => (...params) => console.log(
  title, mapFn(params)) || params[0]

export default traceFn
