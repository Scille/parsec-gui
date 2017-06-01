import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'

import { bytesToSize, dateToUTC } from '../common'
import Modals, {
  RenameModal,
  CreateDirModal,
  RemoveModal,
  RestoreModal,
  DetailsModal
} from './Modals'

describe('Modals components', () => {
  const file = {
    id: 'a5a394e27c184854b22a59b658aae61c',
    name: 'file.txt',
    key: 'lbR/4r6T7bWHbNBjwuJ17Qa4aJjIvvD6x3JkXruN3ug=\n',
    path: '/file.txt',
    size: 5,
    removed_date: 1496319612.273644,
    atime: 1496317138.262896,
    ctime: 1496317138.262896,
    mtime: 1496317138.262896,
    write_trust_seed: '1L6H3PIC5RUY',
    read_trust_seed: 'CHJHVATQJF9V'
  }

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

    it('should render RestoreModal', () => {
      const props = { modalType: 'restoreModal' }
      const enzymeWrapper = shallow(<Modals {...props} />)

      expect(enzymeWrapper.find('RestoreModal').exists()).toBe(true)
    })

    it('should render DetailsModal', () => {
      const props = { modalType: 'detailsModal' }
      const enzymeWrapper = shallow(<Modals {...props} />)

      expect(enzymeWrapper.find('DetailsModal').exists()).toBe(true)
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
        file,
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
        file,
        title: 'REMOVE FILE',
        removeFunc: jest.fn(),
        hideModal: jest.fn()
      }
      const enzymeWrapper = shallow(<RemoveModal {...props} />)
      return { props, enzymeWrapper }
    }

    it('should render self', () => {
      const { enzymeWrapper, props } = setup()

      expect(enzymeWrapper.find('h3').text()).toBe(props.title)
      expect(enzymeWrapper.find('p').text()).toBe(`Are you sure you want to delete ${props.file.name} ?`)
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

  describe('RestoreModal', () => {
    const setup = () => {
      const props = {
        file,
        restoreFile: jest.fn(),
        hideModal: jest.fn()
      }
      const enzymeWrapper = shallow(<RestoreModal {...props} />)
      return { props, enzymeWrapper }
    }

    it('should render self', () => {
      const { enzymeWrapper, props } = setup()

      expect(enzymeWrapper.find('h3').text()).toBe('RESTORE FILE')
      expect(enzymeWrapper.find('p').text()).toBe(`Are you sure you want to restore ${props.file.name} ?`)
      expect(enzymeWrapper.find('.third-button').exists()).toBe(true)
      expect(enzymeWrapper.find('.main-button').exists()).toBe(true)
    })

    it('cancel button should call hideModal() when clicked', () => {
      const { enzymeWrapper, props } = setup()
      const handleCancel = sinon.spy(RestoreModal.prototype, 'handleCancel')

      enzymeWrapper.find('.third-button').simulate('click', { preventDefault: () => {} })
      expect(handleCancel.calledOnce)
      expect(props.hideModal.mock.calls.length).toBe(1)
    })

    it('restore button should call restoreFile() when clicked', () => {
      const { enzymeWrapper, props } = setup()
      const handleRestore = sinon.spy(RestoreModal.prototype, 'handleRestore')

      enzymeWrapper.find('.main-button').simulate('click', { preventDefault: () => {} })
      expect(handleRestore.calledOnce)
      expect(props.restoreFile.mock.calls.length).toBe(1)
    })
  })

  describe('DetailsModal', () => {
    const setup = () => {
      const props = {
        file,
        hideModal: jest.fn()
      }
      const enzymeWrapper = shallow(<DetailsModal {...props} />)
      return { props, enzymeWrapper }
    }

    it('should render self', () => {
      const { enzymeWrapper, props } = setup()

      expect(enzymeWrapper.find('h3').text()).toBe('DETAILS')
      expect(enzymeWrapper.findWhere(n => n.text() === 'Name').find('input').props().value).toBe(props.file.name)
      expect(enzymeWrapper.findWhere(n => n.text() === 'ID').find('input').props().value).toBe(props.file.id)
      expect(enzymeWrapper.findWhere(n => n.text() === 'Key').find('input').props().value).toBe(props.file.key)
      expect(enzymeWrapper.findWhere(n => n.text() === 'Path').find('input').props().value).toBe(props.file.path)
      expect(enzymeWrapper.findWhere(n => n.text() === 'Size').find('input').props().value).toBe(bytesToSize(props.file.size))
      expect(enzymeWrapper.findWhere(n => n.text() === 'Removed Date').find('input').props().value).toBe(dateToUTC(props.file.removed_date))
      expect(enzymeWrapper.findWhere(n => n.text() === 'ATime').find('input').props().value).toBe(dateToUTC(props.file.atime))
      expect(enzymeWrapper.findWhere(n => n.text() === 'MTime').find('input').props().value).toBe(dateToUTC(props.file.mtime))
      expect(enzymeWrapper.findWhere(n => n.text() === 'CTime').find('input').props().value).toBe(dateToUTC(props.file.ctime))
      expect(enzymeWrapper.findWhere(n => n.text() === 'Read Trust Seed').find('input').props().value).toBe(props.file.read_trust_seed)
      expect(enzymeWrapper.findWhere(n => n.text() === 'Write Trust Seed').find('input').props().value).toBe(props.file.write_trust_seed)
      expect(enzymeWrapper.find('.third-button').exists()).toBe(true)
    })

    it('close button should call hideModal() when clicked', () => {
      const { enzymeWrapper, props } = setup()
      const handleClose = sinon.spy(DetailsModal.prototype, 'handleClose')

      enzymeWrapper.find('.third-button').simulate('click', { preventDefault: () => {} })
      expect(handleClose.calledOnce)
      expect(props.hideModal.mock.calls.length).toBe(1)
    })
  })
})
