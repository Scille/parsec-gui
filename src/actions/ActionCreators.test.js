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
  const fileStat = {
    id: 'a5a394e27c184854b22a59b658aae61c',
    size: 5,
    atime: 1496317138.262896,
    ctime: 1496317138.262896,
    mtime: 1496317138.262896,
    status: 'ok'
  }
  const fileInfo = {
    id: 'a5a394e27c184854b22a59b658aae61c',
    key: 'lbR/4r6T7bWHbNBjwuJ17Qa4aJjIvvD6x3JkXruN3ug=\n',
    write_trust_seed: '1L6H3PIC5RUY',
    read_trust_seed: 'CHJHVATQJF9V'
  }
  const file = {
    ...fileStat,
    ...fileInfo,
    name: 'file.txt',
    path: '/file.txt',
    guid: '337d1aae-8eb4-41b3-8be3-501df75944e3',
  }
  const directory = {
    name: 'directory',
    path: '/directory',
    id: null,
    guid: '337d1aae-8eb4-41b3-8be3-501df75944e4',
  }

  it('list files successful, creates SOCKET_WRITE, LOAD_FILES_SUCCESS and SOCKET_WRITE_SUCCESS', () => {
    const expectedActions = [
      { type: types.SOCKET_WRITE },
      {
        type: types.LOAD_FILES_SUCCESS,
        files: [{
          ...file,
          guid: undefined
        }]
      },
      { type: types.SOCKET_WRITE_SUCCESS }
    ]
    // mock the SocketApi.write method, so it will just resolve the Promise.
    SocketApi.write = jest.fn((cmd) => {
      if(cmd==='{"cmd": "user_manifest_list_dir", "path": "/"}\n')
        return Promise.resolve({
          children: {
            [file.name]: fileInfo
          },
          current: {
            id: null,
            read_trust_seed: null,
            write_trust_seed: null,
            key: null
          },
          status: 'ok'
        })
      else
        return Promise.resolve(fileStat)
    })
    // mock the dispatch and getState functions from Redux thunk.
    const dispatch = jest.fn()
    const getState = jest.fn(() => [file])
    return actions.socketListDir('/')(dispatch, getState).then(() => {
      // SOCKET_WRITE
      expect(dispatch.mock.calls[0][0]).toEqual(expectedActions[0])
      // LOAD_FILES_SUCCESS
      delete dispatch.mock.calls[1][0].files[0].guid
      expect(dispatch.mock.calls[1][0]).toEqual(expectedActions[1])
      // SOCKET_WRITE_SUCCESS
      expect(dispatch.mock.calls[2][0]).toEqual(expectedActions[2])
    })
  })
  it('show dustbin successful, creates SOCKET_WRITE, LOAD_FILES_SUCCESS and SOCKET_WRITE_SUCCESS', () => {
    const removed_date = 1496319612.273644
    const expectedActions = [
      { type: types.SOCKET_WRITE },
      {
        type: types.LOAD_FILES_SUCCESS,
        files: [{
          ...fileInfo,
          path: file.path,
          name: file.name,
          removed_date
        }]
      },
      { type: types.SOCKET_WRITE_SUCCESS }
    ]
    // mock the SocketApi.write method, so it will just resolve the Promise.
    SocketApi.write = jest.fn((cmd) => {
      return Promise.resolve({
        dustbin: [{
          ...fileInfo,
          path: file.path,
          removed_date
        }],
        status: 'ok'
      })
    })
    // mock the dispatch and getState functions from Redux thunk.
    const dispatch = jest.fn()
    const getState = jest.fn(() => [file])
    return actions.socketShowDustbin()(dispatch, getState).then(() => {
      // SOCKET_WRITE
      expect(dispatch.mock.calls[0][0]).toEqual(expectedActions[0])
      // LOAD_FILES_SUCCESS
      delete dispatch.mock.calls[1][0].files[0].guid
      expect(dispatch.mock.calls[1][0]).toEqual(expectedActions[1])
      // SOCKET_WRITE_SUCCESS
      expect(dispatch.mock.calls[2][0]).toEqual(expectedActions[2])
    })
  })
  it('create file successful, creates SOCKET_WRITE, ADD_FILE_SUCCESS and SOCKET_WRITE_SUCCESS', () => {
    const fileR = new File(["test"], file.name, { type: "application/javascript", lastModified: new Date() })
    const expectedActions = [
      { type: types.SOCKET_WRITE },
      {
        type: types.ADD_FILE_SUCCESS,
        file: {
          ...file,
          guid: undefined
        }
      },
      { type: types.SOCKET_WRITE_SUCCESS }
    ]
    // mock the SocketApi.write method, so it will just resolve the Promise.
    SocketApi.write = jest.fn((cmd) => {
      if(cmd===`{"cmd": "user_manifest_create_file", "path": "${file.path}", "content": "dGVzdA=="}\n`)
        return Promise.resolve({
          ...fileInfo,
          status: 'ok'
        })
      else
        return Promise.resolve(fileStat)
    })
    // mock the dispatch and getState functions from Redux thunk.
    const dispatch = jest.fn()
    const getState = jest.fn(() => [file])
    return actions.socketCreateFile(file.path, fileR)(dispatch, getState).then(() => {
      // SOCKET_WRITE
      expect(dispatch.mock.calls[0][0]).toEqual(expectedActions[0])
      // ADD_FILE_SUCCESS
      delete dispatch.mock.calls[1][0].file.guid
      expect(dispatch.mock.calls[1][0]).toEqual(expectedActions[1])
      // SOCKET_WRITE_SUCCESS
      expect(dispatch.mock.calls[2][0]).toEqual(expectedActions[2])
    })
  })
  it('rename file successful, creates SOCKET_WRITE, UPDATE_FILE_SUCCESS and SOCKET_WRITE_SUCCESS', () => {
    const rename = {
      ...file,
      name: 'rename_file.txt',
      path: '/rename_file.txt'
    }
    const expectedActions = [
      { type: types.SOCKET_WRITE },
      { type: types.UPDATE_FILE_SUCCESS, file: rename },
      { type: types.SOCKET_WRITE_SUCCESS }
    ]
    // mock the SocketApi.write method, so it will just resolve the Promise.
    SocketApi.write = jest.fn((cmd) => {
      return Promise.resolve({ status: 'ok' })
    })
    // mock the dispatch and getState functions from Redux thunk.
    const dispatch = jest.fn()
    const getState = jest.fn(() => [file])
    return actions.socketRenameFile(file, rename.name)(dispatch, getState).then(() => {
      // SOCKET_WRITE
      expect(dispatch.mock.calls[0][0]).toEqual(expectedActions[0])
      // UPDATE_FILE_SUCCESS
      expect(dispatch.mock.calls[1][0]).toEqual(expectedActions[1])
      // SOCKET_WRITE_SUCCESS
      expect(dispatch.mock.calls[2][0]).toEqual(expectedActions[2])
    })
  })
  it('delete file successful, creates SOCKET_WRITE, DELETE_FILE_SUCCESS and SOCKET_WRITE_SUCCESS', () => {
    const expectedActions = [
      { type: types.SOCKET_WRITE },
      { type: types.DELETE_FILE_SUCCESS, file },
      { type: types.SOCKET_WRITE_SUCCESS }
    ]
    // mock the SocketApi.write method, so it will just resolve the Promise.
    SocketApi.write = jest.fn((cmd) => {
      return Promise.resolve({ status: 'ok' })
    })
    // mock the dispatch and getState functions from Redux thunk.
    const dispatch = jest.fn()
    const getState = jest.fn(() => files)
    return actions.socketDeleteFile(file)(dispatch, getState).then(() => {
      // SOCKET_WRITE
      expect(dispatch.mock.calls[0][0]).toEqual(expectedActions[0])
      // DELETE_FILE_SUCCESS
      expect(dispatch.mock.calls[1][0]).toEqual(expectedActions[1])
      // SOCKET_WRITE_SUCCESS
      expect(dispatch.mock.calls[2][0]).toEqual(expectedActions[2])
    })
  })
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
  it('create directory successful, creates SOCKET_WRITE, ADD_FILE_SUCCESS and SOCKET_WRITE_SUCCESS', () => {
    const expectedActions = [
      { type: types.SOCKET_WRITE },
      {
        type: types.ADD_FILE_SUCCESS,
        file: {
          ...directory,
          guid: undefined
        }
      },
      { type: types.SOCKET_WRITE_SUCCESS }
    ]
    // mock the SocketApi.write method, so it will just resolve the Promise.
    SocketApi.write = jest.fn((cmd) => {
      return Promise.resolve({ status: 'ok' })
    })
    // mock the dispatch and getState functions from Redux thunk.
    const dispatch = jest.fn()
    const getState = jest.fn(() => [directory])
    return actions.socketCreateDir('/', directory.name)(dispatch, getState).then(() => {
      // SOCKET_WRITE
      expect(dispatch.mock.calls[0][0]).toEqual(expectedActions[0])
      // ADD_FILE_SUCCESS
      delete dispatch.mock.calls[1][0].file.guid
      expect(dispatch.mock.calls[1][0]).toEqual(expectedActions[1])
      // SOCKET_WRITE_SUCCESS
      expect(dispatch.mock.calls[2][0]).toEqual(expectedActions[2])
    })
  })
  it('remove directory successful, creates SOCKET_WRITE, DELETE_FILE_SUCCESS and SOCKET_WRITE_SUCCESS', () => {
    const expectedActions = [
      { type: types.SOCKET_WRITE },
      { type: types.DELETE_FILE_SUCCESS, file: directory },
      { type: types.SOCKET_WRITE_SUCCESS }
    ]
    // mock the SocketApi.write method, so it will just resolve the Promise.
    SocketApi.write = jest.fn((cmd) => {
      return Promise.resolve({ status: 'ok' })
    })
    // mock the dispatch and getState functions from Redux thunk.
    const dispatch = jest.fn()
    const getState = jest.fn(() => [directory])
    return actions.socketRemoveDir(directory)(dispatch, getState).then(() => {
      // SOCKET_WRITE
      expect(dispatch.mock.calls[0][0]).toEqual(expectedActions[0])
      // DELETE_FILE_SUCCESS
      expect(dispatch.mock.calls[1][0]).toEqual(expectedActions[1])
      // SOCKET_WRITE_SUCCESS
      expect(dispatch.mock.calls[2][0]).toEqual(expectedActions[2])
    })
  })
})
