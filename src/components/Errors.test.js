import React from 'react'
import { shallow, mount, render } from 'enzyme'

import { SocketError, NoMatchError } from './Errors'

describe('Errors Components', () => {
  describe('SocketError', () => {
    it('should render self', () => {
      const enzymeWrapper = shallow(<SocketError />)

      expect(enzymeWrapper.find('Background').exists()).toBe(true)
      expect(enzymeWrapper.find('h1').text()).toBe('ERROR')
      expect(enzymeWrapper.find('h2').text()).toBe('Can not connect to UNIX socket')
      expect(enzymeWrapper.find('p').text()).toBe('Something went wrong, please try again later.')
      expect(enzymeWrapper.find('.main-button').exists()).toBe(true)
    })
  })

  describe('NoMatchError', () => {
    it('should render self', () => {
      const enzymeWrapper = shallow(<NoMatchError />)

      expect(enzymeWrapper.find('Background').exists()).toBe(true)
      expect(enzymeWrapper.find('h1').text()).toBe('404')
      expect(enzymeWrapper.find('h2').text()).toBe('Page not found')
      expect(enzymeWrapper.find('p').text()).toBe('The page you are looking for doesnt exist.')
      expect(enzymeWrapper.find('.third-button').exists()).toBe(true)
      expect(enzymeWrapper.find('.main-button').exists()).toBe(true)
    })
  })
})
