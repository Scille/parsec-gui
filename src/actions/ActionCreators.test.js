require('babel-polyfill')

import { mockSpawn } from 'spawn-mock'
import * as actions from './ActionCreators'
import * as types from './ActionTypes'
import SocketApi from '../api/socketApi'
import NotifyApi from '../api/notifyApi'


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
  const file = {
    name: "file.txt",
    path: "/file.txt",
    size: 244,
    type: "file",
    created: "2017-01-01T00:00:00+00:00",
    updated: "2017-01-01T00:00:00+00:00",
  }

  it('should create an action to add file', () => {
    const expectedAction = {
      type: types.ADD_FILE_SUCCESS,
      file: file
    }
    expect(actions.addFileSuccess(file)).toEqual(expectedAction)
  })
  it('should create an action to remove file', () => {
    const expectedAction = {
      type: types.DELETE_FILE_SUCCESS,
      file: file
    }
    expect(actions.deleteFileSuccess(file)).toEqual(expectedAction)
  })
  it('should create an action to update file', () => {
    const expectedAction = {
      type: types.UPDATE_FILE_SUCCESS,
      updatedFile: file,
      path: file.path,
    }
    expect(actions.updateFileSuccess(file.path, file)).toEqual(expectedAction)
  })
  it('should create an action to get all files', () => {
    const files = [file]
    const expectedAction = {
      type: types.LOAD_FILES_SUCCESS,
      files
    }
    expect(actions.loadFilesSuccess(files)).toEqual(expectedAction)
  })
  it('should create an action to get empty list files', () => {
    const expectedAction = {
      type: types.LOAD_FILES_FAILURE
    }
    expect(actions.loadFilesFailure()).toEqual(expectedAction)
  })
})

describe('History Actions', () => {
  it('should create an action to get history', () => {
    const history = [
      {
        version: 1,
        entries: { added: {}, changed: {}, removed: {} },
        groups: { added: {}, changed: {}, removed: {} },
        dustbin: { added: [], removed: [] },
        versions: { added: {}, changed: {}, removed: {} }
      }
    ]
    const expectedAction = {
      type: types.LOAD_HISTORY_SUCCESS,
      history
    }
    expect(actions.loadHistorySuccess(history)).toEqual(expectedAction)
  })
  it('should create an action to show restore user_manifest success', () => {
    const expectedAction = { type: types.RESTORE_VERSION_SUCCESS }
    expect(actions.restoreVersionSuccess()).toEqual(expectedAction)
  })
})

describe('Socket Actions', () => {
  it('should create an action to create loading spinner', () => {
    const expectedAction = { type: types.SOCKET_WRITE }
    expect(actions.socketWrite()).toEqual(expectedAction)
  })
  it('should create an action to remove loading spinner if write failure', () => {
    const expectedAction = { type: types.SOCKET_WRITE_FAILURE }
    expect(actions.socketWriteFailure()).toEqual(expectedAction)
  })
  it('should create an action to remove connexion spinner if connect success', () => {
    const expectedAction = { type: types.SOCKET_CONNECT_SUCCESS }
    expect(actions.socketConnectSuccess()).toEqual(expectedAction)
  })
  it('should create an action to show connexion spinner if end success', () => {
    const expectedAction = { type: types.SOCKET_END_SUCCESS }
    expect(actions.socketEndSuccess()).toEqual(expectedAction)
  })
})

describe('Socket Commands', () => {
  const file = {
    name: "file.txt",
    path: "/file.txt",
    size: 244,
    type: "file",
    created: "2017-01-01T00:00:00+00:00",
    updated: "2017-01-01T00:00:00+00:00",
  }
  const directory = {
    name: "directory",
    path: "/directory",
    type: "folder",
    children: [],
    created: "2017-01-01T00:00:00+00:00",
    updated: "2017-01-01T00:00:00+00:00"
  }
  const history = [{
    version: 1,
    entries: { added: {}, changed: {}, removed: {} },
    groups: { added: {}, changed: {}, removed: {} },
    dustbin: { added: [], removed: [] },
    versions: { added: {}, changed: {}, removed: {} }
  }]

  it('socket connect successful, creates SOCKET_CONNECT_SUCCESS', () => {
    const expectedActions = [{ type: types.SOCKET_CONNECT_SUCCESS }]
    // mock the SocketApi.write method, so it will just resolve the Promise.
    SocketApi.connect = jest.fn(() => Promise.resolve({ status: 'ok' }))
    // mock the dispatch function from Redux thunk.
    const dispatch = jest.fn()
    return actions.socketConnect()(dispatch).then(() => {
      // SOCKET_CONNECT_SUCCESS
      expect(dispatch.mock.calls[0][0]).toEqual(expectedActions[0])
    })
  })
  it('socket connect failure', () => {
    // mock the SocketApi.write method, so it will just reject the Promise.
    SocketApi.connect = jest.fn(() => Promise.reject({ label: 'label' }))
    // mock the NotifyApi.notify.
    NotifyApi.notify = jest.fn()
    // mock the dispatch function from Redux thunk.
    const dispatch = jest.fn()
    return actions.socketConnect()(dispatch).then(() => {
      // Create notification
      expect(NotifyApi.notify.mock.calls.length).toEqual(1)
    })
  })
  it('socket end', () => {
    // mock the SocketApi.end method.
    SocketApi.end = jest.fn()
    // mock the dispatch function from Redux thunk.
    const dispatch = jest.fn()
    actions.socketEnd()(dispatch)
    expect(SocketApi.end.mock.calls.length).toEqual(1)
  })
  it('list files successful, creates SOCKET_WRITE and LOAD_FILES_SUCCESS', () => {
    const expectedActions = [
      { type: types.DISABLE_LOADING_ANIMATION },
      { type: types.SOCKET_WRITE },
      {
        type: types.LOAD_FILES_SUCCESS,
        files: [file]
      },
      { type: types.ENABLE_LOADING_ANIMATION }
    ]
    // mock the SocketApi.write method, so it will just resolve the Promise.
    SocketApi.write = jest.fn((cmd) => {
      if(cmd==='{"cmd": "stat", "path": "/"}\n')
        return Promise.resolve({
          children: [file],
          type: "folder",
          created: "2017-01-01T00:00:00+00:00",
          updated: "2017-01-01T00:00:00+00:00",
          status: 'ok'
        })
      else
        return Promise.resolve(file)
    })
    // mock the dispatch function from Redux thunk.
    const dispatch = jest.fn()
    return actions.socketListDir('/', false)(dispatch).then(() => {
      // DISABLE_LOADING_ANIMATION
      expect(dispatch.mock.calls[0][0]).toEqual(expectedActions[0])
      // SOCKET_WRITE
      expect(dispatch.mock.calls[1][0]).toEqual(expectedActions[1])
      // LOAD_FILES_SUCCESS
      expect(dispatch.mock.calls[2][0]).toEqual(expectedActions[2])
      // ENABLE_LOADING_ANIMATION
      expect(dispatch.mock.calls[3][0]).toEqual(expectedActions[3])
    })
  })
  it('list files failure (Not a directory), creates SOCKET_WRITE and LOAD_FILES_FAILURE', () => {
    const expectedActions = [
      { type: types.DISABLE_LOADING_ANIMATION },
      { type: types.SOCKET_WRITE },
      { type: types.LOAD_FILES_FAILURE },
      { type: types.ENABLE_LOADING_ANIMATION }
    ]
    // mock the SocketApi.write method, so it will just resolve the Promise.
    SocketApi.write = jest.fn((cmd) => Promise.resolve(file))
    // mock the NotifyApi.notify.
    NotifyApi.notify = jest.fn()
    // mock the dispatch function from Redux thunk.
    const dispatch = jest.fn()
    return actions.socketListDir('/', false)(dispatch).then(() => {
      // DISABLE_LOADING_ANIMATION
      expect(dispatch.mock.calls[0][0]).toEqual(expectedActions[0])
      // SOCKET_WRITE
      expect(dispatch.mock.calls[1][0]).toEqual(expectedActions[1])
      // LOAD_FILES_FAILURE
      expect(dispatch.mock.calls[2][0]).toEqual(expectedActions[2])
      // ENABLE_LOADING_ANIMATION
      expect(dispatch.mock.calls[3][0]).toEqual(expectedActions[3])
      // Create notification
      expect(NotifyApi.notify.mock.calls.length).toEqual(1)
    })
  })
  it('list files failure, creates SOCKET_WRITE and LOAD_FILES_FAILURE', () => {
    const expectedActions = [
      { type: types.DISABLE_LOADING_ANIMATION },
      { type: types.SOCKET_WRITE },
      { type: types.LOAD_FILES_FAILURE },
      { type: types.ENABLE_LOADING_ANIMATION }
    ]
    // mock the SocketApi.write method, so it will just reject the Promise.
    SocketApi.write = jest.fn((cmd) => Promise.reject({ label: 'label' }))
    // mock the NotifyApi.notify.
    NotifyApi.notify = jest.fn()
    // mock the dispatch function from Redux thunk.
    const dispatch = jest.fn()
    return actions.socketListDir('/', false)(dispatch).then(() => {
      // DISABLE_LOADING_ANIMATION
      expect(dispatch.mock.calls[0][0]).toEqual(expectedActions[0])
      // SOCKET_WRITE
      expect(dispatch.mock.calls[1][0]).toEqual(expectedActions[1])
      // LOAD_FILES_FAILURE
      expect(dispatch.mock.calls[2][0]).toEqual(expectedActions[2])
      // ENABLE_LOADING_ANIMATION
      expect(dispatch.mock.calls[3][0]).toEqual(expectedActions[3])
      // Create notification
      expect(NotifyApi.notify.mock.calls.length).toEqual(1)
    })
  })
  it('show dustbin successful, creates SOCKET_WRITE and LOAD_FILES_SUCCESS', () => {
    const removed_date = 1496319612.273644
    const expectedActions = [
      { type: types.SOCKET_WRITE },
      {
        type: types.LOAD_FILES_SUCCESS,
        files: [{
          ...file,
          removed_date
        }]
      }
    ]
    // mock the SocketApi.write method, so it will just resolve the Promise.
    SocketApi.write = jest.fn((cmd) => {
      return Promise.resolve({
        dustbin: [{
          ...file,
          removed_date
        }],
        status: 'ok'
      })
    })
    // mock the dispatch function from Redux thunk.
    const dispatch = jest.fn()
    return actions.socketShowDustbin()(dispatch).then(() => {
      // SOCKET_WRITE
      expect(dispatch.mock.calls[0][0]).toEqual(expectedActions[0])
      // LOAD_FILES_SUCCESS
      expect(dispatch.mock.calls[1][0]).toEqual(expectedActions[1])
    })
  })
  it('show dustbin failure, creates SOCKET_WRITE and LOAD_FILES_FAILURE', () => {
    const expectedActions = [
      { type: types.SOCKET_WRITE },
      { type: types.LOAD_FILES_FAILURE }
    ]
    // mock the SocketApi.write method, so it will just reject the Promise.
    SocketApi.write = jest.fn((cmd) => Promise.reject({ label: 'label' }))
    // mock the NotifyApi.notify.
    NotifyApi.notify = jest.fn()
    // mock the dispatch function from Redux thunk.
    const dispatch = jest.fn()
    return actions.socketShowDustbin()(dispatch).then(() => {
      // SOCKET_WRITE
      expect(dispatch.mock.calls[0][0]).toEqual(expectedActions[0])
      // LOAD_FILES_FAILURE
      expect(dispatch.mock.calls[1][0]).toEqual(expectedActions[1])
      // Create notification
      expect(NotifyApi.notify.mock.calls.length).toEqual(1)
    })
  })
  it('search file successful, creates SOCKET_WRITE and LOAD_FILES_SUCCESS', () => {
    const expectedActions = [
      { type: types.SOCKET_WRITE },
      {
        type: types.LOAD_FILES_SUCCESS,
        files: []
      }
    ]
    // mock the SocketApi.write method, so it will just resolve the Promise.
    SocketApi.write = jest.fn((cmd) => Promise.resolve({ status: 'ok' }))
    // mock the dispatch function from Redux thunk.
    const dispatch = jest.fn()
    return actions.socketSearchFile()(dispatch).then(() => {
      // SOCKET_WRITE
      expect(dispatch.mock.calls[0][0]).toEqual(expectedActions[0])
      // LOAD_FILES_SUCCESS
      expect(dispatch.mock.calls[1][0]).toEqual(expectedActions[1])
    })
  })
  it('search file failure, creates SOCKET_WRITE and LOAD_FILES_FAILURE', () => {
    const expectedActions = [
      { type: types.SOCKET_WRITE },
      { type: types.LOAD_FILES_FAILURE }
    ]
    // mock the SocketApi.write method, so it will just reject the Promise.
    SocketApi.write = jest.fn((cmd) => Promise.reject({ label: 'label' }))
    // mock the NotifyApi.notify.
    NotifyApi.notify = jest.fn()
    // mock the dispatch function from Redux thunk.
    const dispatch = jest.fn()
    return actions.socketSearchFile()(dispatch).then(() => {
      // SOCKET_WRITE
      expect(dispatch.mock.calls[0][0]).toEqual(expectedActions[0])
      // LOAD_FILES_FAILURE
      expect(dispatch.mock.calls[1][0]).toEqual(expectedActions[1])
      // Create notification
      expect(NotifyApi.notify.mock.calls.length).toEqual(1)
    })
  })
  it('create file successful, creates SOCKET_WRITE and ADD_FILE_SUCCESS', () => {
    const fileR = new File(['test'], file.name, { type: 'application/javascript', lastModified: new Date() })
    const expectedActions = [
      { type: types.SOCKET_WRITE },
      {
        type: types.ADD_FILE_SUCCESS,
        file
      }
    ]
    // mock the SocketApi.write method, so it will just resolve the Promise.
    SocketApi.write = jest.fn((cmd) => {
      if(cmd===`{"cmd": "file_create", "path": "${file.path}"}\n`)
        return Promise.resolve({ status: 'ok' })
      else if(cmd===`{"cmd": "file_write", "path": "${file.path}", "content": "dGVzdA=="}\n`)
        return Promise.resolve({ status: 'ok' })
      else
        return Promise.resolve(file)
    })
    // mock the NotifyApi.notify.
    NotifyApi.notify = jest.fn()
    // mock the dispatch function from Redux thunk.
    const dispatch = jest.fn()
    return actions.socketCreateFile(file.path, fileR)(dispatch).then(() => {
      // SOCKET_WRITE
      expect(dispatch.mock.calls[0][0]).toEqual(expectedActions[0])
      // ADD_FILE_SUCCESS
      expect(dispatch.mock.calls[1][0]).toEqual(expectedActions[1])
      // Create notification
      expect(NotifyApi.notify.mock.calls.length).toEqual(1)
    })
  })
  it('create file failure, creates SOCKET_WRITE and SOCKET_WRITE_FAILURE', () => {
    const fileR = new File(['test'], file.name, { type: 'application/javascript', lastModified: new Date() })
    const expectedActions = [
      { type: types.SOCKET_WRITE },
      { type: types.SOCKET_WRITE_FAILURE }
    ]
    // mock the SocketApi.write method, so it will just reject the Promise.
    SocketApi.write = jest.fn((cmd) => Promise.reject({ label: 'label' }))
    // mock the NotifyApi.notify.
    NotifyApi.notify = jest.fn()
    // mock the dispatch function from Redux thunk.
    const dispatch = jest.fn()
    return actions.socketCreateFile(file.path, fileR)(dispatch).then(() => {
      // SOCKET_WRITE
      expect(dispatch.mock.calls[0][0]).toEqual(expectedActions[0])
      // SOCKET_WRITE_FAILURE
      expect(dispatch.mock.calls[1][0]).toEqual(expectedActions[1])
      // Create notification
      expect(NotifyApi.notify.mock.calls.length).toEqual(1)
    })
  })
  it('rename file successful, creates SOCKET_WRITE and UPDATE_FILE_SUCCESS', () => {
    const rename = {
      ...file,
      name: 'rename_file.txt',
      path: '/rename_file.txt'
    }
    const expectedActions = [
      { type: types.SOCKET_WRITE },
      { type: types.UPDATE_FILE_SUCCESS, path: file.path, updatedFile: rename }
    ]
    // mock the SocketApi.write method, so it will just resolve the Promise.
    SocketApi.write = jest.fn((cmd) => Promise.resolve({ status: 'ok' }))
    // mock the NotifyApi.notify.
    NotifyApi.notify = jest.fn()
    // mock the dispatch function from Redux thunk.
    const dispatch = jest.fn()
    return actions.socketRenameFile(file, rename.name)(dispatch).then(() => {
      // SOCKET_WRITE
      expect(dispatch.mock.calls[0][0]).toEqual(expectedActions[0])
      // UPDATE_FILE_SUCCESS
      expect(dispatch.mock.calls[1][0]).toEqual(expectedActions[1])
      // Create notification
      expect(NotifyApi.notify.mock.calls.length).toEqual(1)
    })
  })
  it('rename file failure, creates SOCKET_WRITE and SOCKET_WRITE_FAILURE', () => {
    const rename = {
      ...file,
      name: 'rename_file.txt',
      path: '/rename_file.txt'
    }
    const expectedActions = [
      { type: types.SOCKET_WRITE },
      { type: types.SOCKET_WRITE_FAILURE }
    ]
    // mock the SocketApi.write method, so it will just reject the Promise.
    SocketApi.write = jest.fn((cmd) => Promise.reject({ label: 'label' }))
    // mock the NotifyApi.notify.
    NotifyApi.notify = jest.fn()
    // mock the dispatch function from Redux thunk.
    const dispatch = jest.fn()
    return actions.socketRenameFile(file, rename.name)(dispatch).then(() => {
      // SOCKET_WRITE
      expect(dispatch.mock.calls[0][0]).toEqual(expectedActions[0])
      // SOCKET_WRITE_FAILURE
      expect(dispatch.mock.calls[1][0]).toEqual(expectedActions[1])
      // Create notification
      expect(NotifyApi.notify.mock.calls.length).toEqual(1)
    })
  })
  it('delete file successful, creates SOCKET_WRITE and DELETE_FILE_SUCCESS', () => {
    const expectedActions = [
      { type: types.SOCKET_WRITE },
      { type: types.DELETE_FILE_SUCCESS, file }
    ]
    // mock the SocketApi.write method, so it will just resolve the Promise.
    SocketApi.write = jest.fn((cmd) => Promise.resolve({ status: 'ok' }))
    // mock the NotifyApi.notify.
    NotifyApi.notify = jest.fn()
    // mock the dispatch function from Redux thunk.
    const dispatch = jest.fn()
    return actions.socketDeleteFile(file)(dispatch).then(() => {
      // SOCKET_WRITE
      expect(dispatch.mock.calls[0][0]).toEqual(expectedActions[0])
      // DELETE_FILE_SUCCESS
      expect(dispatch.mock.calls[1][0]).toEqual(expectedActions[1])
      // Create notification
      expect(NotifyApi.notify.mock.calls.length).toEqual(1)
    })
  })
  it('delete file failure, creates SOCKET_WRITE and SOCKET_WRITE_FAILURE', () => {
    const expectedActions = [
      { type: types.SOCKET_WRITE },
      { type: types.SOCKET_WRITE_FAILURE }
    ]
    // mock the SocketApi.write method, so it will just reject the Promise.
    SocketApi.write = jest.fn((cmd) => Promise.reject({ label: 'label' }))
    // mock the NotifyApi.notify.
    NotifyApi.notify = jest.fn()
    // mock the dispatch function from Redux thunk.
    const dispatch = jest.fn()
    return actions.socketDeleteFile(file)(dispatch).then(() => {
      // SOCKET_WRITE
      expect(dispatch.mock.calls[0][0]).toEqual(expectedActions[0])
      // SOCKET_WRITE_FAILURE
      expect(dispatch.mock.calls[1][0]).toEqual(expectedActions[1])
      // Create notification
      expect(NotifyApi.notify.mock.calls.length).toEqual(1)
    })
  })
  it('restore file successful, creates SOCKET_WRITE and DELETE_FILE_SUCCESS', () => {
    const expectedActions = [
      { type: types.SOCKET_WRITE },
      { type: types.DELETE_FILE_SUCCESS, file }
    ]
    // mock the SocketApi.write method, so it will just resolve the Promise.
    SocketApi.write = jest.fn((cmd) => Promise.resolve({ status: 'ok' }))
    // mock the NotifyApi.notify.
    NotifyApi.notify = jest.fn()
    // mock the dispatch function from Redux thunk.
    const dispatch = jest.fn()
    return actions.socketRestoreFile(file)(dispatch).then(() => {
      // SOCKET_WRITE
      expect(dispatch.mock.calls[0][0]).toEqual(expectedActions[0])
      // DELETE_FILE_SUCCESS
      expect(dispatch.mock.calls[1][0]).toEqual(expectedActions[1])
      // Create notification
      expect(NotifyApi.notify.mock.calls.length).toEqual(1)
    })
  })
  it('restore file failure, creates SOCKET_WRITE and SOCKET_WRITE_FAILURE', () => {
    const expectedActions = [
      { type: types.SOCKET_WRITE },
      { type: types.SOCKET_WRITE_FAILURE }
    ]
    // mock the SocketApi.write method, so it will just reject the Promise.
    SocketApi.write = jest.fn((cmd) => Promise.reject({ label: 'label' }))
    // mock the NotifyApi.notify.
    NotifyApi.notify = jest.fn()
    // mock the dispatch function from Redux thunk.
    const dispatch = jest.fn()
    return actions.socketRestoreFile(file)(dispatch).then(() => {
      // SOCKET_WRITE
      expect(dispatch.mock.calls[0][0]).toEqual(expectedActions[0])
      // SOCKET_WRITE_FAILURE
      expect(dispatch.mock.calls[1][0]).toEqual(expectedActions[1])
      // Create notification
      expect(NotifyApi.notify.mock.calls.length).toEqual(1)
    })
  })
  it('open file successful', () => {
    const mocked_spawn = mockSpawn(function (cp: MockChildProcess) {
      cp.emit('close', 0)
      cp.end()
    })
    global.window.require = function () {
      return {
        spawn: mocked_spawn
      }
    }
    const expectedActions = [
      { type: types.OPEN_FILE_SUCCESS, mountpoint: '/file'}
    ]
    // mock the NotifyApi.notify.
    NotifyApi.notify = jest.fn()
    // mock the dispatch function from Redux thunk.
    const dispatch = jest.fn()
    return actions.openFile({mountpoint: '/file'})(dispatch).then(() => {
      expect(dispatch.mock.calls[0][0]).toEqual(expectedActions[0])
      // Doesn't create notification
      expect(NotifyApi.notify.mock.calls.length).toEqual(0)
    })
  })
  it('open file failure, creates Error Notification', () => {
    const mocked_spawn = mockSpawn(function (cp: MockChildProcess) {
      cp.emit('close', 1)
      cp.end()
    })
    global.window.require = function () {
      return {
        spawn: mocked_spawn
      }
    }
    const expectedActions = [
      { type: types.OPEN_FILE_FAILURE, mountpoint: '/unknown'}
    ]
    // mock the NotifyApi.notify.
    NotifyApi.notify = jest.fn()
    // mock the dispatch function from Redux thunk.
    const dispatch = jest.fn()
    return actions.openFile({mountpoint: '/unknown'})(dispatch).catch(() => {
      expect(dispatch.mock.calls[0][0]).toEqual(expectedActions[0])
      // Doesn't create notification
      expect(NotifyApi.notify.mock.calls.length).toEqual(1)
    })
  })
  it('create directory successful, creates SOCKET_WRITE and ADD_FILE_SUCCESS', () => {
    const expectedActions = [
      { type: types.SOCKET_WRITE },
      {
        type: types.ADD_FILE_SUCCESS,
        file: directory
      }
    ]
    // mock the SocketApi.write method, so it will just resolve the Promise.
    SocketApi.write = jest.fn((cmd) => {
      if(cmd===`{"cmd": "folder_create", "path": "${directory.path}"}\n`)
        return Promise.resolve({ status: 'ok' })
      else
        return Promise.resolve(directory)
    })
    // mock the NotifyApi.notify.
    NotifyApi.notify = jest.fn()
    // mock the dispatch function from Redux thunk.
    const dispatch = jest.fn()
    return actions.socketCreateDir('/', directory.name)(dispatch).then(() => {
      // SOCKET_WRITE
      expect(dispatch.mock.calls[0][0]).toEqual(expectedActions[0])
      // ADD_FILE_SUCCESS
      expect(dispatch.mock.calls[1][0]).toEqual(expectedActions[1])
      // Create notification
      expect(NotifyApi.notify.mock.calls.length).toEqual(1)
    })
  })
  it('create directory failure, creates SOCKET_WRITE and SOCKET_WRITE_FAILURE', () => {
    const expectedActions = [
      { type: types.SOCKET_WRITE },
      { type: types.SOCKET_WRITE_FAILURE }
    ]
    // mock the SocketApi.write method, so it will just reject the Promise.
    SocketApi.write = jest.fn((cmd) => Promise.reject({ label: 'label' }))
    // mock the NotifyApi.notify.
    NotifyApi.notify = jest.fn()
    // mock the dispatch function from Redux thunk.
    const dispatch = jest.fn()
    return actions.socketCreateDir('/', directory.name)(dispatch).then(() => {
      // SOCKET_WRITE
      expect(dispatch.mock.calls[0][0]).toEqual(expectedActions[0])
      // SOCKET_WRITE_FAILURE
      expect(dispatch.mock.calls[1][0]).toEqual(expectedActions[1])
      // Create notification
      expect(NotifyApi.notify.mock.calls.length).toEqual(1)
    })
  })
  it('remove directory successful, creates SOCKET_WRITE and DELETE_FILE_SUCCESS', () => {
    const expectedActions = [
      { type: types.SOCKET_WRITE },
      { type: types.DELETE_FILE_SUCCESS, file: directory }
    ]
    // mock the SocketApi.write method, so it will just resolve the Promise.
    SocketApi.write = jest.fn((cmd) => Promise.resolve({ status: 'ok' }))
    // mock the NotifyApi.notify.
    NotifyApi.notify = jest.fn()
    // mock the dispatch function from Redux thunk.
    const dispatch = jest.fn()
    return actions.socketRemoveDir(directory)(dispatch).then(() => {
      // SOCKET_WRITE
      expect(dispatch.mock.calls[0][0]).toEqual(expectedActions[0])
      // DELETE_FILE_SUCCESS
      expect(dispatch.mock.calls[1][0]).toEqual(expectedActions[1])
      // Create notification
      expect(NotifyApi.notify.mock.calls.length).toEqual(1)
    })
  })
  it('remove directory failure, creates SOCKET_WRITE and SOCKET_WRITE_FAILURE', () => {
    const expectedActions = [
      { type: types.SOCKET_WRITE },
      { type: types.SOCKET_WRITE_FAILURE }
    ]
    // mock the SocketApi.write method, so it will just reject the Promise.
    SocketApi.write = jest.fn((cmd) => Promise.reject({ label: 'label' }))
    // mock the NotifyApi.notify.
    NotifyApi.notify = jest.fn()
    // mock the dispatch function from Redux thunk.
    const dispatch = jest.fn()
    return actions.socketRemoveDir(directory)(dispatch).then(() => {
      // SOCKET_WRITE
      expect(dispatch.mock.calls[0][0]).toEqual(expectedActions[0])
      // SOCKET_WRITE_FAILURE
      expect(dispatch.mock.calls[1][0]).toEqual(expectedActions[1])
      // Create notification
      expect(NotifyApi.notify.mock.calls.length).toEqual(1)
    })
  })
  it('history successful, creates SOCKET_WRITE and LOAD_HISTORY_SUCCESS', () => {
    const expectedActions = [
      { type: types.SOCKET_WRITE },
      { type: types.LOAD_HISTORY_SUCCESS, history }
    ]
    // mock the SocketApi.write method, so it will just resolve the Promise.
    SocketApi.write = jest.fn((cmd) => Promise.resolve({ status: 'ok', detailed_history: history }))
    // mock the dispatch function from Redux thunk.
    const dispatch = jest.fn()
    return actions.socketHistory()(dispatch).then(() => {
      // SOCKET_WRITE
      expect(dispatch.mock.calls[0][0]).toEqual(expectedActions[0])
      // LOAD_HISTORY_SUCCESS
      expect(dispatch.mock.calls[1][0]).toEqual(expectedActions[1])
    })
  })
  it('history failure, creates SOCKET_WRITE and SOCKET_WRITE_FAILURE', () => {
    const expectedActions = [
      { type: types.SOCKET_WRITE },
      { type: types.SOCKET_WRITE_FAILURE }
    ]
    // mock the SocketApi.write method, so it will just reject the Promise.
    SocketApi.write = jest.fn((cmd) => Promise.reject({ label: 'label' }))
    // mock the NotifyApi.notify.
    NotifyApi.notify = jest.fn()
    // mock the dispatch function from Redux thunk.
    const dispatch = jest.fn()
    return actions.socketHistory()(dispatch).then(() => {
      // SOCKET_WRITE
      expect(dispatch.mock.calls[0][0]).toEqual(expectedActions[0])
      // SOCKET_WRITE_FAILURE
      expect(dispatch.mock.calls[1][0]).toEqual(expectedActions[1])
      // Create notification
      expect(NotifyApi.notify.mock.calls.length).toEqual(1)
    })
  })
  it('restore successful, creates SOCKET_WRITE and RESTORE_VERSION_SUCCESS', () => {
    const expectedActions = [
      { type: types.SOCKET_WRITE },
      { type: types.RESTORE_VERSION_SUCCESS }
    ]
    // mock the SocketApi.write method, so it will just resolve the Promise.
    SocketApi.write = jest.fn((cmd) => Promise.resolve({ status: 'ok' }))
    // mock the NotifyApi.notify.
    NotifyApi.notify = jest.fn()
    // mock the dispatch function from Redux thunk.
    const dispatch = jest.fn()
    return actions.socketRestoreVersion(1)(dispatch).then(() => {
      // SOCKET_WRITE
      expect(dispatch.mock.calls[0][0]).toEqual(expectedActions[0])
      // RESTORE_VERSION_SUCCESS
      expect(dispatch.mock.calls[1][0]).toEqual(expectedActions[1])
      // Create notification
      expect(NotifyApi.notify.mock.calls.length).toEqual(1)
    })
  })
  it('restore failure, creates SOCKET_WRITE and SOCKET_WRITE_FAILURE', () => {
    const expectedActions = [
      { type: types.SOCKET_WRITE },
      { type: types.SOCKET_WRITE_FAILURE }
    ]
    // mock the SocketApi.write method, so it will just reject the Promise.
    SocketApi.write = jest.fn((cmd) => Promise.reject({ label: 'label' }))
    // mock the NotifyApi.notify.
    NotifyApi.notify = jest.fn()
    // mock the dispatch function from Redux thunk.
    const dispatch = jest.fn()
    return actions.socketRestoreVersion(1)(dispatch).then(() => {
      // SOCKET_WRITE
      expect(dispatch.mock.calls[0][0]).toEqual(expectedActions[0])
      // SOCKET_WRITE_FAILURE
      expect(dispatch.mock.calls[1][0]).toEqual(expectedActions[1])
      // Create notification
      expect(NotifyApi.notify.mock.calls.length).toEqual(1)
    })
  })
})
