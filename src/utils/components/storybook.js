import React from 'react'
import { storiesOf } from '@storybook/react-native'
import { action } from '@storybook/addon-actions'
import { reduceObj } from './object'

export const createStoriesForComponent = (Component, storyName, defaultProps, points, decorator) => {
  return points.reduce((stories, [name, props = {}]) => {
    const StoryComponent = p => <Component {...{ ...p, ...createActions(defaultProps), ...createActions(props) }} />
    return stories.add(name, () => <StoryComponent />)
  }, decorator ? storiesOf(storyName, module).addDecorator(decorator) : storiesOf(storyName, module))
}

const createActions =
  (props) =>
    reduceObj(props,
      (item, key) => item === '@action' ? action(key) : item
    )
