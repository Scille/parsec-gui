import allReducer from '.'

describe('combine Reducer', () => {
  const initialState = {
    personalFilesReducer: [],
    viewSwitcherReducer: false,
    modalReducer: { modalType: null, modalProps: {} },
    pathReducer: '',
    modalsForm: {
      rename: { name: '' },
      createDir: { name: '' }
    }
  }

  it('should return the initial state', () => {
    const combineReducers = allReducer(undefined, {})
    expect(combineReducers.personalFilesReducer).toEqual(initialState.personalFilesReducer)
    expect(combineReducers.viewSwitcherReducer).toEqual(initialState.viewSwitcherReducer)
    expect(combineReducers.modalReducer).toEqual(initialState.modalReducer)
    expect(combineReducers.pathReducer).toEqual(initialState.pathReducer)
    expect(combineReducers.modalsForm.rename).toEqual(initialState.modalsForm.rename)
    expect(combineReducers.modalsForm.createDir).toEqual(initialState.modalsForm.createDir)
  })
})
