import * as React from 'react'

/**
 * this hoc provides preload functionality,
 * while you process some process, it's display the LoadingComponent
 * and after load result into propNameResultPropertyName to property flow
 * @param {Function} promise the promise what will execute after component will be mounted
 * @param {String} propNameResultPropertyName the name of results data in property flow
 * @param {any} LoadingComponent the react component what will display while promise will execute
 */
export const createPromiseHOC = (
  promise, propNameResultPropertyName, LoadingComponent) =>
  WrappedComponent =>
    class extends React.Component {
      state = {
        result: undefined,
        loading: true,
      }

      componentDidMount = async () => {
        const result = await promise()
        this.setState({result, loading: false})
      }

      render () {
        return this.state.loading ?
          <LoadingComponent/> :
          <WrappedComponent {...{
            ...Object(this.props),
            [propNameResultPropertyName]: this.state.result,
          }} />
      }

    }
