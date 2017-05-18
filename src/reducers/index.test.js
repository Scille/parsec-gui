import allReducers from '.'

describe('Combine Reducers', () => {
  const initialState = {
    filesReducer: [],
    viewSwitcherReducer: false,
    modalReducer: { modalType: null, modalProps: {} },
    breadcrumbReducer: [{ route: '/', libelle: 'Home' }],
  }

  it('should return the initial state', () => {
    const combineReducers = allReducers(undefined, {})
    expect(combineReducers.filesReducer).toEqual(initialState.filesReducer)
    expect(combineReducers.viewSwitcherReducer).toEqual(initialState.viewSwitcherReducer)
    expect(combineReducers.modalReducer).toEqual(initialState.modalReducer)
    expect(combineReducers.breadcrumbReducer).toEqual(initialState.breadcrumbReducer)
  })
})
