import { updateObject } from './object'

describe('Test object utilities', () => {
  it('udpateObject: Object updates is updates', () => {
    const config = {
      option1: '1',
      option2: '1',
      option3: '1'
    }

    const config2 = updateObject(config, { option2: 'test' })

    expect(config2).toEqual({ ...config, option2: 'test' })
    expect(config).toEqual({ ...config, option2: 'test' })
  })
})
