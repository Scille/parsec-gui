require('babel-polyfill')

import * as actions from './ActionCreators'
import * as types from './ActionTypes'
import SocketApi from '../api/socketApi'

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
      type: types.REMOVE_PATH,
      index
    }
    expect(actions.removePath(index)).toEqual(expectedAction)
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

describe('File Actions', () => {
  it('should create an action to add file', () => {
    const file = {
      id: 'file_id',
      guid: 'file_guid',
      name: 'file.txt',
      size: 0
    }
    const expectedAction = {
      type: types.ADD_FILE_SUCCESS,
      file
    }
    expect(actions.addFileSuccess(file)).toEqual(expectedAction)
  })
  it('should create an action to remove file', () => {
    const file = {
      id: 'file_id',
      guid: 'file_guid',
      name: 'file.txt',
      size: 0
    }
    const expectedAction = {
      type: types.DELETE_FILE_SUCCESS,
      file
    }
    expect(actions.deleteFileSuccess(file)).toEqual(expectedAction)
  })
  it('should create an action to update file', () => {
    const file = {
      id: 'file_id',
      guid: 'file_guid',
      name: 'file.txt',
      size: 0
    }
    const expectedAction = {
      type: types.UPDATE_FILE_SUCCESS,
      file
    }
    expect(actions.updateFileSuccess(file)).toEqual(expectedAction)
  })
  it('should create an action to get all files', () => {
    const files = []
    const expectedAction = {
      type: types.LOAD_FILES_SUCCESS,
      files
    }
    expect(actions.loadFilesSuccess(files)).toEqual(expectedAction)
  })
})

describe('Socket Actions', () => {
  it('should create an action to create loading spinner', () => {
    const expectedAction = { type: types.SOCKET_WRITE }
    expect(actions.socketWrite()).toEqual(expectedAction)
  })
  it('should create an action to remove loading spinner if success', () => {
    const expectedAction = { type: types.SOCKET_WRITE_SUCCESS }
    expect(actions.socketWriteSuccess()).toEqual(expectedAction)
  })
  it('should create an action to remove loading spinner if failure', () => {
    const expectedAction = { type: types.SOCKET_WRITE_FAILURE }
    expect(actions.socketWriteFailure()).toEqual(expectedAction)
  })
})

describe('Socket Commands', () => {
  it('list files successful, creates SOCKET_WRITE, LOAD_FILES_SUCCESS and SOCKET_WRITE_SUCCESS', () => {
    const file = {
      id: 'file_id',
      name: 'file.txt',
      size: 0
    }
    const size = 10
    const files = Object.assign({}, { 'file.txt': file })
    const expectedActions = [
      { type: types.SOCKET_WRITE },
      { type: types.LOAD_FILES_SUCCESS },
      { type: types.SOCKET_WRITE_SUCCESS }
    ]
    // mock the SocketApi.write method, so it will just resolve the Promise.
    SocketApi.write = jest.fn((cmd) => {
      if(cmd==='{"cmd": "user_manifest_list_dir", "path": "/"}\n')
        return Promise.resolve({ status: 'ok', children: files })
      else
        return Promise.resolve({ status: 'ok', size })
    })
    // mock the dispatch and getState functions from Redux thunk.
    const dispatch = jest.fn()
    const getState = jest.fn(() => [file])
    return actions.socketListDir('/')(dispatch, getState).then(() => {
      // SOCKET_WRITE
      expect(dispatch.mock.calls[0][0]).toEqual(expectedActions[0])
      // LOAD_FILES_SUCCESS
      expect(dispatch.mock.calls[1][0].type).toEqual(expectedActions[1].type)
      expect(dispatch.mock.calls[1][0].files[0].id).toEqual(file.id)
      expect(dispatch.mock.calls[1][0].files[0].name).toEqual(file.name)
      expect(dispatch.mock.calls[1][0].files[0].size).toEqual(size)
      // SOCKET_WRITE_SUCCESS
      expect(dispatch.mock.calls[2][0]).toEqual(expectedActions[2])
    })
  })

  it('show dustbin successful, creates SOCKET_WRITE, LOAD_FILES_SUCCESS and SOCKET_WRITE_SUCCESS', () => {
    const files = [{
      id: 'file_id',
      name: 'file.txt',
      path: '/file.txt'
    }]
    const expectedActions = [
      { type: types.SOCKET_WRITE },
      { type: types.LOAD_FILES_SUCCESS },
      { type: types.SOCKET_WRITE_SUCCESS }
    ]
    // mock the SocketApi.write method, so it will just resolve the Promise.
    SocketApi.write = jest.fn((cmd) => {
      return Promise.resolve({ status: 'ok', dustbin: files })
    })
    // mock the dispatch and getState functions from Redux thunk.
    const dispatch = jest.fn()
    const getState = jest.fn(() => files)
    return actions.socketShowDustbin()(dispatch, getState).then(() => {
      // SOCKET_WRITE
      expect(dispatch.mock.calls[0][0]).toEqual(expectedActions[0])
      // LOAD_FILES_SUCCESS
      expect(dispatch.mock.calls[1][0].type).toEqual(expectedActions[1].type)
      expect(dispatch.mock.calls[1][0].files[0].id).toEqual(files[0].id)
      expect(dispatch.mock.calls[1][0].files[0].name).toEqual(files[0].name)
      // SOCKET_WRITE_SUCCESS
      expect(dispatch.mock.calls[2][0]).toEqual(expectedActions[2])
    })
  })

  // it('should create an action to create file', () => {
  //   const route = '/file.txt'
  //   const file = {}
  //   const expectedAction = {
  //     type: types.SOCKET_CREATE_FILE,
  //     route,
  //     file
  //   }
  //   expect(actions.socketCreateFile(route, file)).toEqual(expectedAction)
  // })
  // it('should create an action to rename file', () => {
  //   const actualRoute = '/file.txt'
  //   const newRoute = '/rename_file.txt'
  //   const expectedAction = {
  //     type: types.SOCKET_RENAME_FILE,
  //     actualRoute,
  //     newRoute
  //   }
  //   expect(actions.socketRenameFile(actualRoute, newRoute)).toEqual(expectedAction)
  // })
  // it('should create an action to delete file', () => {
  //   const route = '/file.txt'
  //   const expectedAction = {
  //     type: types.SOCKET_DELETE_FILE,
  //     route
  //   }
  //   expect(actions.socketDeleteFile(route)).toEqual(expectedAction)
  // })
  // it('should create an action to restore file', () => {
  //   const id = 'file_id'
  //   const route = './file.txt'
  //   const expectedAction = {
  //     type: types.SOCKET_RESTORE_FILE,
  //     id,
  //     route
  //   }
  //   expect(actions.socketRestoreFile(id, route)).toEqual(expectedAction)
  // })
  // it('should create an action to download file', () => {
  //   const id = 'file_id'
  //   const name = 'file.txt'
  //   const expectedAction = {
  //     type: types.SOCKET_DOWNLOAD_FILE,
  //     id,
  //     name
  //   }
  //   expect(actions.socketDownloadFile(id, name)).toEqual(expectedAction)
  // })
  // it('should create an action to create directory', () => {
  //   const route = '/directory'
  //   const expectedAction = {
  //     type: types.SOCKET_CREATE_DIR,
  //     route
  //   }
  //   expect(actions.socketCreateDir(route)).toEqual(expectedAction)
  // })
  // it('should create an action to remove directory', () => {
  //   const route = '/directory'
  //   const expectedAction = {
  //     type: types.SOCKET_REMOVE_DIR,
  //     route
  //   }
  //   expect(actions.socketRemoveDir(route)).toEqual(expectedAction)
  // })
})
