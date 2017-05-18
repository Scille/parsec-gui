import React from 'react'
import { shallow } from 'enzyme'

import Modals, { RenameModal, CreateDirModal } from './Modals'

describe('Modals components', () => {
  describe('Modals', () => {
    it('should render RenameModal', () => {
      const props = { modalType: 'renameModal' }
      const enzymeWrapper = shallow(<Modals {...props} />)

      expect(enzymeWrapper.find('RenameModal').exists()).toBe(true)
    })

    it('should render CreateDirModal', () => {
      const props = { modalType: 'createDirModal' }
      const enzymeWrapper = shallow(<Modals {...props} />)

      expect(enzymeWrapper.find('CreateDirModal').exists()).toBe(true)
    })

    it('should render nothing', () => {
      const props = { modalType: null }
      const enzymeWrapper = shallow(<Modals {...props} />)

      expect(enzymeWrapper.type()).toBe(null)
    })
  })

  describe('RenameModal', () => {
    const setup = () => {
      const props = {
        renameFile: jest.fn(),
        hideModal: jest.fn()
      }
      const enzymeWrapper = shallow(<RenameModal {...props} />)
      return { props, enzymeWrapper }
    }

    it('should render self', () => {
      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.find('h3').text()).toBe('RENAME FILE')
      expect(enzymeWrapper.find('.third-button').exists()).toBe(true)
      expect(enzymeWrapper.find('.main-button').exists()).toBe(true)
    })

    it('cancel button should call hideModal() when clicked', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.find('.third-button').simulate('click')
      expect(props.hideModal.mock.calls.length).toBe(1)
    })

    it('submit button should call renameFile() when clicked', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.find('.main-button').simulate('submit')
      // TODO
      // expect(props.renameFile.mock.calls.length).toBe(1)
    })
  })

  describe('CreateDirModal', () => {
    const setup = () => {
      const props = {
        createDir: jest.fn(),
        hideModal: jest.fn()
      }
      const enzymeWrapper = shallow(<CreateDirModal {...props} />)
      return { props, enzymeWrapper }
    }

    it('should render self', () => {
      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.find('h3').text()).toBe('CREATE DIRECTORY')
      expect(enzymeWrapper.find('.third-button').exists()).toBe(true)
      expect(enzymeWrapper.find('.main-button').exists()).toBe(true)
    })

    it('cancel button should call hideModal() when clicked', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.find('.third-button').simulate('click')
      expect(props.hideModal.mock.calls.length).toBe(1)
    })

    it('submit button should call createDir() when clicked', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.find('.main-button').simulate('submit')
      // TODO
      // expect(props.createDir.mock.calls.length).toBe(1)
    })
  })
})
