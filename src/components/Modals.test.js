import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'

import { bytesToSize, dateToUTC } from '../common'
import Modals, {
  RenameModal,
  CreateDirModal,
  SearchModal,
  RemoveModal,
  RestoreModal,
  DetailsModal,
  RestoreVersionModal
} from './Modals'

describe('Modals components', () => {
  const file = {
    name: "file.txt",
    path: "/dir/file.txt",
    size: 1048,
    type: "file",
    created: "2017-01-01T00:00:00+00:00",
    updated: "2017-01-01T00:00:00+00:00",
    removed_date: 1496319612.273644
  }
  const directory = {
    name: "sub-dir",
    path: "/dir/sub-dir",
    type: "folder",
    children: ['file1.txt', 'file2.txt'],
    created: "2017-01-01T00:00:00+00:00",
    updated: "2017-01-01T00:00:00+00:00"
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

    it('should render SearchModal', () => {
      const props = { modalType: 'searchModal' }
      const enzymeWrapper = shallow(<Modals {...props} />)

      expect(enzymeWrapper.find('SearchModal').exists()).toBe(true)
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

    it('should render RestoreVersionModal', () => {
      const props = { modalType: 'restoreVersionModal' }
      const enzymeWrapper = shallow(<Modals {...props} />)

      expect(enzymeWrapper.find('RestoreVersionModal').exists()).toBe(true)
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

    it('input focus should call handleFocus() when clicked', () => {
      const { enzymeWrapper, props } = setup()
      const handleFocus = sinon.spy(RenameModal.prototype, 'handleFocus')
      const target = {
        value: 'rename_file.txt',
        setSelectionRange: jest.fn()
      }

      enzymeWrapper.find('input').simulate('focus', {
        preventDefault: () => {},
        target
      })
      expect(handleFocus.calledOnce)
      expect(target.setSelectionRange.mock.calls.length).toEqual(1)
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

    it('input focus should call handleFocus() when clicked', () => {
      const { enzymeWrapper, props } = setup()
      const handleFocus = sinon.spy(CreateDirModal.prototype, 'handleFocus')
      const target = { select: jest.fn() }

      enzymeWrapper.find('input').simulate('focus', {
        preventDefault: () => {},
        target
      })
      expect(handleFocus.calledOnce)
      expect(target.select.mock.calls.length).toEqual(1)
    })
  })

  describe('SearchModal', () => {
    const setup = () => {
      const props = {
        searchFile: jest.fn(),
        hideModal: jest.fn()
      }
      const enzymeWrapper = shallow(<SearchModal {...props} />)
      return { props, enzymeWrapper }
    }

    it('should render self', () => {
      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.find('h3').text()).toBe('SEARCH FILE')
      expect(enzymeWrapper.find('.third-button').exists()).toBe(true)
      expect(enzymeWrapper.find('.main-button').exists()).toBe(true)
    })

    it('cancel button should call hideModal() when clicked', () => {
      const { enzymeWrapper, props } = setup()
      const handleCancel = sinon.spy(SearchModal.prototype, 'handleCancel')

      enzymeWrapper.find('.third-button').simulate('click', { preventDefault: () => {} })
      expect(handleCancel.calledOnce)
      expect(props.hideModal.mock.calls.length).toBe(1)
    })

    it('submit button should call search() when clicked', () => {
      const { enzymeWrapper, props } = setup()
      const handleSubmit = sinon.spy(SearchModal.prototype, 'handleSubmit')

      enzymeWrapper.find('input').simulate('change', {
        preventDefault: () => {},
        target: { value: 'search_file.txt', name: 'name' }
      })
      enzymeWrapper.find('form').simulate('submit', { preventDefault: () => {} })
      expect(handleSubmit.calledOnce)
      expect(props.searchFile.mock.calls.length).toBe(1)
    })

    it('input change should call handleChange() when clicked', () => {
      const { enzymeWrapper, props } = setup()
      const handleChange = sinon.spy(SearchModal.prototype, 'handleChange')

      enzymeWrapper.find('input').simulate('change', {
        preventDefault: () => {},
        target: { value: 'search_file.txt' }
      })
      expect(handleChange.calledOnce)
    })

    it('input focus should call handleFocus() when clicked', () => {
      const { enzymeWrapper, props } = setup()
      const handleFocus = sinon.spy(SearchModal.prototype, 'handleFocus')
      const target = { select: jest.fn() }

      enzymeWrapper.find('input').simulate('focus', {
        preventDefault: () => {},
        target
      })
      expect(handleFocus.calledOnce)
      expect(target.select.mock.calls.length).toEqual(1)
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
    const setup = (propsFile=file) => {
      const props = {
        file: propsFile,
        hideModal: jest.fn()
      }
      const enzymeWrapper = shallow(<DetailsModal {...props} />)
      return { props, enzymeWrapper }
    }

    it('should render self (propsFile as file)', () => {
      const { enzymeWrapper, props } = setup()

      expect(enzymeWrapper.find('h3').text()).toBe('DETAILS')
      expect(enzymeWrapper.findWhere(n => n.text() === 'Name').find('input').props().value).toBe(props.file.name)
      expect(enzymeWrapper.findWhere(n => n.text() === 'Path').find('input').props().value).toBe(props.file.path)
      expect(enzymeWrapper.findWhere(n => n.text() === 'Type').find('input').props().value).toBe(props.file.type)
      expect(enzymeWrapper.findWhere(n => n.text() === 'Size').find('input').props().value).toBe(bytesToSize(props.file.size))
      expect(enzymeWrapper.findWhere(n => n.text() === 'Created').find('input').props().value).toBe(dateToUTC(props.file.created))
      expect(enzymeWrapper.findWhere(n => n.text() === 'Updated').find('input').props().value).toBe(dateToUTC(props.file.updated))
      expect(enzymeWrapper.findWhere(n => n.text() === 'Removed').find('input').props().value).toBe(dateToUTC(props.file.removed_date))
      expect(enzymeWrapper.find('.third-button').exists()).toBe(true)
    })

    it('should render self (propsFile as folder)', () => {
      const { enzymeWrapper, props } = setup(directory)
      expect(enzymeWrapper.find('h3').text()).toBe('DETAILS')
      expect(enzymeWrapper.findWhere(n => n.text() === 'Name').find('input').props().value).toBe(props.file.name)
      expect(enzymeWrapper.findWhere(n => n.text() === 'Path').find('input').props().value).toBe(props.file.path)
      expect(enzymeWrapper.findWhere(n => n.text() === 'Type').find('input').props().value).toBe(props.file.type)
      expect(enzymeWrapper.findWhere(n => n.text() === 'List directory contents').find('textarea').props().value).toBe(props.file.children)
      expect(enzymeWrapper.findWhere(n => n.text() === 'Created').find('input').props().value).toBe(dateToUTC(props.file.created))
      expect(enzymeWrapper.findWhere(n => n.text() === 'Updated').find('input').props().value).toBe(dateToUTC(props.file.updated))
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

  describe('RestoreVersionModal', () => {
    const setup = () => {
      const props = {
        version: 1,
        restoreVersion: jest.fn(),
        hideModal: jest.fn()
      }
      const enzymeWrapper = shallow(<RestoreVersionModal {...props} />)
      return { props, enzymeWrapper }
    }

    it('should render self', () => {
      const { enzymeWrapper, props } = setup()

      expect(enzymeWrapper.find('h3').text()).toBe('RESTORE VERSION')
      expect(enzymeWrapper.find('p').text()).toBe(`Are you sure you want to restore this version (V.${props.version}) ?`)
      expect(enzymeWrapper.find('.third-button').exists()).toBe(true)
      expect(enzymeWrapper.find('.main-button').exists()).toBe(true)
    })

    it('cancel button should call hideModal() when clicked', () => {
      const { enzymeWrapper, props } = setup()
      const handleCancel = sinon.spy(RestoreVersionModal.prototype, 'handleCancel')

      enzymeWrapper.find('.third-button').simulate('click', { preventDefault: () => {} })
      expect(handleCancel.calledOnce)
      expect(props.hideModal.mock.calls.length).toBe(1)
    })

    it('restore button should call restoreVersion() when clicked', () => {
      const { enzymeWrapper, props } = setup()
      const handleRestore = sinon.spy(RestoreVersionModal.prototype, 'handleRestore')

      enzymeWrapper.find('.main-button').simulate('click', { preventDefault: () => {} })
      expect(handleRestore.calledOnce)
      expect(props.restoreVersion.mock.calls.length).toBe(1)
    })
  })
})
