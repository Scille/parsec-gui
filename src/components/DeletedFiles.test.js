import React from 'react'
import { shallow } from 'enzyme'
import DeletedFiles from './DeletedFiles'

describe('DeletedFiles Component', () => {
  const setup = (loading, listView=true) => {
    const props = {
      state: {
        files: [
          {
            name: "file1.txt",
            path: "/file1.txt",
            size: 1048,
            type: "file",
            created: "2017-01-01T00:00:00+00:00",
            updated: "2017-01-01T00:00:00+00:00",
            removed_date: 1496319612.273644
          },
          {
            name: "file2.txt",
            path: "/file2.txt",
            size: 1048,
            type: "file",
            created: "2017-01-01T00:00:00+00:00",
            updated: "2017-01-01T00:00:00+00:00",
            removed_date: 1496319612.273644
          },
        ],
        listView,
        socket: { connected: true, loading }
      },
      dispatch: {
        init: jest.fn(),
        refresh: jest.fn(),
        restoreFile: jest.fn(),
        switchView: jest.fn(),
        showModal: jest.fn(),
        hideModal: jest.fn()
      }
    }
    const enzymeWrapper = shallow(<DeletedFiles {...props} />)
    return { props, enzymeWrapper }
  }

  describe('should render self and subcomponents', () => {
    it('During loading', () => {
      const { enzymeWrapper } = setup(true)

      const header = enzymeWrapper.find('.header')
      expect(header.find('.title').text()).toBe('Deleted Files')
      expect(header.find('.breadcrumb').text()).toBe('Trash')
      expect(header.find('.dropdown-content').text()).toBe('Views GridActions Refresh')

      expect(enzymeWrapper.find('#loader-wrapper').exists()).toBe(true)

      const modalsContainer = enzymeWrapper.find('ModalsContainer')
      expect(modalsContainer.exists()).toBe(false)
    })

    it('After loading, on listView', () => {
      const { enzymeWrapper } = setup(false)

      const header = enzymeWrapper.find('.header')
      expect(header.find('.title').text()).toBe('Deleted Files')
      expect(header.find('.breadcrumb').text()).toBe('Trash')
      expect(header.find('.dropdown-content').text()).toBe('Views GridActions Refresh')

      const fileView = enzymeWrapper.find('.file-view')
      expect(fileView.hasClass('list-view')).toBe(true)
      expect(fileView.find('li').length).toBe(2)

      const modalsContainer = enzymeWrapper.find('ModalsContainer')
      expect(modalsContainer.exists()).toBe(false)
    })

    it('After loading, on gridView', () => {
      const { enzymeWrapper } = setup(false, false)

      const header = enzymeWrapper.find('.header')
      expect(header.find('.title').text()).toBe('Deleted Files')
      expect(header.find('.breadcrumb').text()).toBe('Trash')
      expect(header.find('.dropdown-content').text()).toBe('Views ListActions Refresh')

      const fileView = enzymeWrapper.find('.file-view')
      expect(fileView.hasClass('grid-view')).toBe(true)
      expect(fileView.find('li').length).toBe(2)

      const modalsContainer = enzymeWrapper.find('ModalsContainer')
      expect(modalsContainer.exists()).toBe(false)
    })
  })

  describe('should dispatch actions', () => {
    it('swithView button should call switchView() when clicked', () => {
      const { enzymeWrapper, props } = setup(false)

      enzymeWrapper.find('.fa-th-large').parent().simulate('click', { preventDefault: () => {} })
      expect(props.dispatch.switchView.mock.calls.length).toBe(1)
    })
    it('refresh button should call refresh() when clicked', () => {
      const { enzymeWrapper, props } = setup(false)

      enzymeWrapper.find('.fa-refresh').parent().simulate('click', { preventDefault: () => {} })
      expect(props.dispatch.refresh.mock.calls.length).toBe(1)
    })
    it('detail button should call showModal() when clicked', () => {
      const { enzymeWrapper, props } = setup(false)

      enzymeWrapper.find('.fa-info').first().parent().simulate('click', { preventDefault: () => {} })
      expect(props.dispatch.showModal.mock.calls.length).toBe(1)
    })
    it('restore button should call showModal() when clicked', () => {
      const { enzymeWrapper, props } = setup(false)

      enzymeWrapper.find('.fa-undo').first().parent().simulate('click', { preventDefault: () => {} })
      expect(props.dispatch.showModal.mock.calls.length).toBe(1)
    })
  })
})
