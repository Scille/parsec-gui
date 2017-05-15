import allReducers from '.'

describe('Combine Reducers', () => {
  const initialState = {
    FilesReducer: [],
    viewSwitcherReducer: false,
    modalReducer: { modalType: null, modalProps: {} },
    pathReducer: [{ route: '/', libelle: 'Home' }],
    modalsForm: {
      rename: { name: '' },
      createDir: { name: '' }
    }
  }

  it('should return the initial state', () => {
    const combineReducers = allReducers(undefined, {})
    expect(combineReducers.FilesReducer).toEqual(initialState.FilesReducer)
    expect(combineReducers.viewSwitcherReducer).toEqual(initialState.viewSwitcherReducer)
    expect(combineReducers.modalReducer).toEqual(initialState.modalReducer)
    expect(combineReducers.pathReducer).toEqual(initialState.pathReducer)
    expect(combineReducers.modalsForm.rename).toEqual(initialState.modalsForm.rename)
    expect(combineReducers.modalsForm.createDir).toEqual(initialState.modalsForm.createDir)
  })
})
