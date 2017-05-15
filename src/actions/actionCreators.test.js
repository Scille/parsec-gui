import * as actions from './actionCreators'
import * as types from './actionTypes'

describe('Socket Actions', () => {
  it('should create an action to connect', () => {
    const expectedAction = { type: types.SOCKET_CONNECT }
    expect(actions.socketConnect()).toEqual(expectedAction)
  })
  it('should create an action to end', () => {
    const expectedAction = { type: types.SOCKET_END }
    expect(actions.socketEnd()).toEqual(expectedAction)
  })
  it('should create an action to list files', () => {
    const route = '/'
    const expectedAction = {
      type: types.SOCKET_LIST_DIR,
      route
    }
    expect(actions.socketListDir(route)).toEqual(expectedAction)
  })
  it('should create an action to create file', () => {
    const route = '/file.txt'
    const file = {}
    const expectedAction = {
      type: types.SOCKET_CREATE_FILE,
      route,
      file
    }
    expect(actions.socketCreateFile(route, file)).toEqual(expectedAction)
  })
  it('should create an action to rename file', () => {
    const actualRoute = '/file.txt'
    const newRoute = '/rename_file.txt'
    const expectedAction = {
      type: types.SOCKET_RENAME_FILE,
      actualRoute,
      newRoute
    }
    expect(actions.socketRenameFile(actualRoute, newRoute)).toEqual(expectedAction)
  })
  it('should create an action to create directory', () => {
    const route = '/directory'
    const expectedAction = {
      type: types.SOCKET_CREATE_DIR,
      route
    }
    expect(actions.socketCreateDir(route)).toEqual(expectedAction)
  })
})

describe('View Actions', () => {
  it('should create an action to switch view', () => {
    const expectedAction = { type: types.SWITCH_VIEW }
    expect(actions.switchView()).toEqual(expectedAction)
  })
})

describe('Path Actions', () => {
  it('should create an action to add path', () => {
    const path = { route: '/dir', libelle: 'dir' }
    const expectedAction = {
      type: types.ADD_PATH,
      path
    }
    expect(actions.addPath(path)).toEqual(expectedAction)
  })
  it('should create an action to slice path', () => {
    const index = 0
    const expectedAction = {
      type: types.SLICE_PATH,
      index
    }
    expect(actions.slicePath(index)).toEqual(expectedAction)
  })
})

describe('File Actions', () => {
  it('should create an action to remove file', () => {
    const id = 'file_id'
    const expectedAction = {
      type: types.REMOVE_FILE,
      id
    }
    expect(actions.removeFile(id)).toEqual(expectedAction)
  })
  it('should create an action to update file', () => {
    const id = 'file_id'
    const file = {
      id: 'file_id',
      name: 'file.txt',
      size: 0
    }
    const expectedAction = {
      type: types.UPDATE_FILE,
      id,
      file
    }
    expect(actions.updateFile(id, file)).toEqual(expectedAction)
  })
  it('should create an action to get all files', () => {
    const files = []
    const expectedAction = {
      type: types.REFRESH_FILES,
      files
    }
    expect(actions.refreshFiles(files)).toEqual(expectedAction)
  })
})

describe('Modal Actions', () => {
  it('should create an action to show modal', () => {
    const modalType = 'modal_type'
    const modalProps = {}
    const expectedAction = {
      type: types.SHOW_MODAL,
      modalType,
      modalProps
    }
    expect(actions.showModal(modalType, modalProps)).toEqual(expectedAction)
  })
  it('should create an action to hide modal', () => {
    const expectedAction = {
      type: types.HIDE_MODAL
    }
    expect(actions.hideModal()).toEqual(expectedAction)
  })
})
