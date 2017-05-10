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
    const path = '/'
    const expectedAction = {
      type: types.SOCKET_LIST_DIR,
      path
    }
    expect(actions.socketListDir(path)).toEqual(expectedAction)
  })
  it('should create an action to create file', () => {
    const path = '/'
    const file = {}
    const expectedAction = {
      type: types.SOCKET_CREATE_FILE,
      path,
      file
    }
    expect(actions.socketCreateFile(path, file)).toEqual(expectedAction)
  })
  it('should create an action to rename file', () => {
    const path = '/'
    const name = 'file.txt'
    const newName = 'rename_file.txt'
    const expectedAction = {
      type: types.SOCKET_RENAME_FILE,
      path,
      name,
      newName
    }
    expect(actions.socketRenameFile(path, name, newName)).toEqual(expectedAction)
  })
  it('should create an action to create directory', () => {
    const path = '/'
    const name = 'directory'
    const expectedAction = {
      type: types.SOCKET_CREATE_DIR,
      path,
      name
    }
    expect(actions.socketCreateDir(path, name)).toEqual(expectedAction)
  })
})

describe('View Actions', () => {
  it('should create an action to switch view', () => {
    const expectedAction = { type: types.SWITCH_VIEW }
    expect(actions.switchView()).toEqual(expectedAction)
  })
})

describe('Path Actions', () => {
  it('should create an action to switch path', () => {
    const path = '/personal-files'
    const expectedAction = {
      type: types.SWITCH_PATH,
      path
    }
    expect(actions.switchPath(path)).toEqual(expectedAction)
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
