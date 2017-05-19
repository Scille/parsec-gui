import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'

import Modals, { RenameModal, CreateDirModal, RemoveModal } from './Modals'

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

    it('should render RemoveModal', () => {
      const props = { modalType: 'removeModal' }
      const enzymeWrapper = shallow(<Modals {...props} />)

      expect(enzymeWrapper.find('RemoveModal').exists()).toBe(true)
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
      const handleCancel = sinon.spy(RenameModal.prototype, 'handleCancel')

      enzymeWrapper.find('.third-button').simulate('click', { preventDefault: () => {} })
      expect(handleCancel.calledOnce)
      expect(props.hideModal.mock.calls.length).toBe(1)
    })

    it('submit button should call renameFile() when clicked', () => {
      const { enzymeWrapper, props } = setup()
      const handleSubmit = sinon.spy(RenameModal.prototype, 'handleSubmit')

      enzymeWrapper.find('form').simulate('submit', { preventDefault: () => {} })
      expect(handleSubmit.calledOnce)
      expect(props.renameFile.mock.calls.length).toBe(1)
    })

    it('input change should call handleChange() when clicked', () => {
      const { enzymeWrapper, props } = setup()
      const handleChange = sinon.spy(RenameModal.prototype, 'handleChange')

      enzymeWrapper.find('input').simulate('change', {
        preventDefault: () => {},
        target: { value: 'rename_file.txt' }
      })
      expect(handleChange.calledOnce)
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
      const handleCancel = sinon.spy(CreateDirModal.prototype, 'handleCancel')

      enzymeWrapper.find('.third-button').simulate('click', { preventDefault: () => {} })
      expect(handleCancel.calledOnce)
      expect(props.hideModal.mock.calls.length).toBe(1)
    })

    it('submit button should call createDir() when clicked', () => {
      const { enzymeWrapper, props } = setup()
      const handleSubmit = sinon.spy(CreateDirModal.prototype, 'handleSubmit')

      enzymeWrapper.find('form').simulate('submit', { preventDefault: () => {} })
      expect(handleSubmit.calledOnce)
      expect(props.createDir.mock.calls.length).toBe(1)
    })

    it('input change should call handleChange() when clicked', () => {
      const { enzymeWrapper, props } = setup()
      const handleChange = sinon.spy(CreateDirModal.prototype, 'handleChange')

      enzymeWrapper.find('input').simulate('change', {
        preventDefault: () => {},
        target: { value: 'directory' }
      })
      expect(handleChange.calledOnce)
    })
  })

  describe('RemoveModal', () => {
    const setup = () => {
      const props = {
        title: "REMOVE FILE",
        name: "file.txt",
        removeFunc: jest.fn(),
        hideModal: jest.fn()
      }
      const enzymeWrapper = shallow(<RemoveModal {...props} />)
      return { props, enzymeWrapper }
    }

    it('should render self', () => {
      const { enzymeWrapper, props } = setup()

      expect(enzymeWrapper.find('h3').text()).toBe(props.title)
      expect(enzymeWrapper.find('p').text()).toBe(`Are you sure you want to delete ${props.name} ?`)
      expect(enzymeWrapper.find('.third-button').exists()).toBe(true)
      expect(enzymeWrapper.find('.main-button').exists()).toBe(true)
    })

    it('cancel button should call hideModal() when clicked', () => {
      const { enzymeWrapper, props } = setup()
      const handleCancel = sinon.spy(RemoveModal.prototype, 'handleCancel')

      enzymeWrapper.find('.third-button').simulate('click', { preventDefault: () => {} })
      expect(handleCancel.calledOnce)
      expect(props.hideModal.mock.calls.length).toBe(1)
    })

    it('delete button should call removeFunc() when clicked', () => {
      const { enzymeWrapper, props } = setup()
      const handleDelete = sinon.spy(RemoveModal.prototype, 'handleDelete')

      enzymeWrapper.find('.main-button').simulate('click', { preventDefault: () => {} })
      expect(handleDelete.calledOnce)
      expect(props.removeFunc.mock.calls.length).toBe(1)
    })
  })
})
