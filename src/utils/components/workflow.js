export const createParam = (
  mapName,
  fn,
  params
) => p => ({
  ...{ ...params, ...p },
  [mapName]: fn(p)
})

export const createParams = (
  mapName,
  itemsMapName,
  fn,
  params
) => p => ({
  ...{ ...params, ...p },
  [mapName]: p[itemsMapName].map(v => fn(v, p))
})

const promiseSerial = funcs =>
  funcs.reduce(
    (promise, func) => promise.then(result => func(result)),
    Promise.resolve([])
  )

export const createWorkflow = (steps, defaultParams) => async (params) => {
  return promiseSerial(
    [{ ...defaultParams, ...params }, ...steps].map(step => p =>
      new Promise(resolve =>
        resolve(typeof step === 'function' ? (step(p) || p) : step)
      )
    )
  )
}

export const composeWorkflow = (...workflows) => createWorkflow([workflows])
