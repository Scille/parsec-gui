import allReducers from '.'

describe('Combine Reducers', () => {
  const initialState = {
    filesReducer: [],
    viewSwitcherReducer: false,
    modalReducer: { modalType: null, modalProps: {} },
    breadcrumbReducer: [{ route: '/', libelle: 'Home' }],
    modalsForm: {
      rename: { name: '' },
      createDir: { name: '' }
    }
  }

  it('should return the initial state', () => {
    const combineReducers = allReducers(undefined, {})
    expect(combineReducers.filesReducer).toEqual(initialState.filesReducer)
    expect(combineReducers.viewSwitcherReducer).toEqual(initialState.viewSwitcherReducer)
    expect(combineReducers.modalReducer).toEqual(initialState.modalReducer)
    expect(combineReducers.breadcrumbReducer).toEqual(initialState.breadcrumbReducer)
    expect(combineReducers.modalsForm.rename).toEqual(initialState.modalsForm.rename)
    expect(combineReducers.modalsForm.createDir).toEqual(initialState.modalsForm.createDir)
  })
})
