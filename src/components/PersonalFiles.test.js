import React from 'react'
import { shallow } from 'enzyme'
import PersonalFiles from './PersonalFiles'

describe('PersonalFiles Component', () => {
  const setup = (loading, listView=true) => {
    const props = {
      state: {
        files: [
          {
            name: "file1.txt",
            path: "/dir/file1.txt",
            size: 1048,
            type: "file",
            created: "2017-01-01T00:00:00+00:00",
            updated: "2017-01-01T00:00:00+00:00",
          },
          {
            name: "file2.txt",
            path: "/dir/file2.txt",
            size: 1048,
            type: "file",
            created: "2017-01-01T00:00:00+00:00",
            updated: "2017-01-01T00:00:00+00:00",
          },
          {
            name: "sub-dir",
            path: "/dir/sub-dir",
            type: "folder",
            children: [],
            created: "2017-01-01T00:00:00+00:00",
            updated: "2017-01-01T00:00:00+00:00"
          }
        ],
        view: { list: listView, loading_animation: true},
        socket: { connected: true, loading },
        breadcrumb: [{ route: '/', libelle: 'Home' }, { route: '/dir', libelle: 'Dir' }]
      },
      dispatch: {
        init: jest.fn(),
        end: jest.fn(),
        moveTo: jest.fn(),
        moveUp: jest.fn(),
        refresh: jest.fn(),
        createFiles: jest.fn(),
        searchFile: jest.fn(),
        renameFile: jest.fn(),
        deleteFile: jest.fn(),
        openFile: jest.fn(),
        createDir: jest.fn(),
        removeDir: jest.fn(),
        switchView: jest.fn(),
        showModal: jest.fn(),
        hideModal: jest.fn()
      }
    }
    const enzymeWrapper = shallow(<PersonalFiles {...props} />)
    return { props, enzymeWrapper }
  }

  describe('should render self and subcomponents', () => {
    it('During loading', () => {
      const { enzymeWrapper } = setup(true)

      const header = enzymeWrapper.find('.header')
      expect(header.find('.title').text()).toBe('Personal Files')
      expect(header.find('.breadcrumb').find('.dropdown-content').text()).toBe('HomeDir')
      expect(header.find('.options').find('.dropdown-content').text()).toBe('Views GridActions Search Refresh New Folder Add Files')

      expect(enzymeWrapper.find('#loader-wrapper').exists()).toBe(true)

      const modalsContainer = enzymeWrapper.find('ModalsContainer')
      expect(modalsContainer.exists()).toBe(false)
    })

    it('After loading, on listView', () => {
      const { enzymeWrapper } = setup(false)

      const header = enzymeWrapper.find('.header')
      expect(header.find('.title').text()).toBe('Personal Files')
      expect(header.find('.breadcrumb').find('.dropdown-content').text()).toBe('HomeDir')
      expect(header.find('.options').find('.dropdown-content').text()).toBe('Views GridActions Search Refresh New Folder Add Files')

      const fileView = enzymeWrapper.find('.file-view')
      expect(fileView.hasClass('list-view')).toBe(true)
      expect(fileView.find('li').length).toBe(3)

      const file = fileView.find('li').at(0)
      expect(file.find('.icon').find('.fa-file-o').exists()).toBe(true)
      expect(file.find('.icon').find('.fa-folder-o').exists()).toBe(false)
      expect(file.find('.title').text()).toBe('file1.txt')
      expect(file.find('.details').text()).toBe('1.0 KB')
      expect(file.find('.fa-info').exists()).toBe(true)
      expect(file.find('.fa-external-link').exists()).toBe(true)
      expect(file.find('.fa-pencil-square-o').exists()).toBe(true)
      expect(file.find('.fa-user-plus').exists()).toBe(true)
      expect(file.find('.fa-trash-o').exists()).toBe(true)

      const dir = fileView.find('li').at(2)
      expect(dir.find('.icon').find('.fa-file-o').exists()).toBe(false)
      expect(dir.find('.icon').find('.fa-folder-o').exists()).toBe(true)
      expect(dir.find('.title').text()).toBe('sub-dir')
      expect(dir.find('.details').text()).toBe('---')
      expect(dir.find('.fa-info').exists()).toBe(true)
      expect(dir.find('.fa-external-link').exists()).toBe(false)
      expect(dir.find('.fa-pencil-square-o').exists()).toBe(true)
      expect(dir.find('.fa-user-plus').exists()).toBe(true)
      expect(dir.find('.fa-trash-o').exists()).toBe(true)

      const modalsContainer = enzymeWrapper.find('ModalsContainer')
      expect(modalsContainer.exists()).toBe(false)
    })

    it('After loading, on gridView', () => {
      const { enzymeWrapper } = setup(false, false)

      const header = enzymeWrapper.find('.header')
      expect(header.find('.title').text()).toBe('Personal Files')
      expect(header.find('.breadcrumb').find('.dropdown-content').text()).toBe('HomeDir')
      expect(header.find('.options').find('.dropdown-content').text()).toBe('Views ListActions Search Refresh New Folder Add Files')

      const fileView = enzymeWrapper.find('.file-view')
      expect(fileView.hasClass('grid-view')).toBe(true)
      expect(fileView.find('li').length).toBe(3)

      const modalsContainer = enzymeWrapper.find('ModalsContainer')
      expect(modalsContainer.exists()).toBe(false)
    })
  })

  describe('should dispatch actions', () => {
    it('breadcrumb Home should call moveUp() when clicked', () => {
      const { enzymeWrapper, props } = setup(false)

      enzymeWrapper.find('.breadcrumb').find('a').first().simulate('click', { preventDefault: () => {} })
      expect(props.dispatch.moveUp.mock.calls.length).toBe(1)
    })
    it('swithView button should call switchView() when clicked', () => {
      const { enzymeWrapper, props } = setup(false)

      enzymeWrapper.find('.fa-th-large').parent().simulate('click', { preventDefault: () => {} })
      expect(props.dispatch.switchView.mock.calls.length).toBe(1)
    })
    it('search button should call searchModal() when clicked', () => {
      const { enzymeWrapper, props } = setup(false)

      enzymeWrapper.find('.fa-search').parent().simulate('click', { preventDefault: () => {} })
      expect(props.dispatch.showModal.mock.calls.length).toBe(1)
    })
    it('refresh button should call refresh() when clicked', () => {
      const { enzymeWrapper, props } = setup(false)

      enzymeWrapper.find('.fa-refresh').parent().simulate('click', { preventDefault: () => {} })
      expect(props.dispatch.refresh.mock.calls.length).toBe(1)
    })
    it('new folder button should call showModal() when clicked', () => {
      const { enzymeWrapper, props } = setup(false)

      enzymeWrapper.find('.fa-folder').parent().simulate('click', { preventDefault: () => {} })
      expect(props.dispatch.showModal.mock.calls.length).toBe(1)
    })
    it('add files button should call createFiles() when clicked', () => {
      const { enzymeWrapper, props } = setup(false)

      enzymeWrapper.find('#file').simulate('change', { target: { files: [] } })
      expect(props.dispatch.createFiles.mock.calls.length).toBe(1)
    })
    it('file elt should not call moveTo() when clicked', () => {
      const { enzymeWrapper, props } = setup(false)

      const file = enzymeWrapper.find('.file-view').find('li').at(0)
      file.find('.title').parent().simulate('click', { preventDefault: () => {} })
      expect(props.dispatch.moveTo.mock.calls.length).toBe(0)
    })
    it('directory elt should call moveTo() when clicked', () => {
      const { enzymeWrapper, props } = setup(false)

      const dir = enzymeWrapper.find('.file-view').find('li').at(2)
      dir.find('.title').parent().simulate('click', { preventDefault: () => {} })
      expect(props.dispatch.moveTo.mock.calls.length).toBe(1)
    })
    it('detail button should call showModal() when clicked', () => {
      const { enzymeWrapper, props } = setup(false)

      const file1 = enzymeWrapper.find('.file-view').find('li').at(0)
      file1.find('.fa-info').parent().simulate('click', { preventDefault: () => {} })
      expect(props.dispatch.showModal.mock.calls.length).toBe(1)
    })
    it('open button should call openFile() when clicked', () => {
      const { enzymeWrapper, props } = setup(false)

      const file1 = enzymeWrapper.find('.file-view').find('li').at(0)
      file1.find('.fa-external-link').parent().simulate('click', { preventDefault: () => {} })
      expect(props.dispatch.openFile.mock.calls.length).toBe(1)
    })
    it('rename button should call showModal() when clicked', () => {
      const { enzymeWrapper, props } = setup(false)

      const file1 = enzymeWrapper.find('.file-view').find('li').at(0)
      file1.find('.fa-pencil-square-o').parent().simulate('click', { preventDefault: () => {} })
      expect(props.dispatch.showModal.mock.calls.length).toBe(1)
    })
    it('delete button should call showModal() when clicked', () => {
      const { enzymeWrapper, props } = setup(false)

      const file1 = enzymeWrapper.find('.file-view').find('li').at(0)
      file1.find('.fa-trash-o').parent().simulate('click', { preventDefault: () => {} })
      expect(props.dispatch.showModal.mock.calls.length).toBe(1)
    })
  })
})
