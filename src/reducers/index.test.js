import allReducers from '.'

describe('Combine Reducers', () => {
  const initialState = {
    filesReducer: [],
    viewSwitcherReducer: false,
    modalReducer: { modalType: null, modalProps: {} },
    breadcrumbReducer: [{ route: '/', libelle: 'Home' }],
  }

  it('should return the initial state', () => {
    const state = allReducers(undefined, {})
    expect(state.filesReducer).toEqual(initialState.filesReducer)
    expect(state.viewSwitcherReducer).toEqual(initialState.viewSwitcherReducer)
    expect(state.modalReducer).toEqual(initialState.modalReducer)
    expect(state.breadcrumbReducer).toEqual(initialState.breadcrumbReducer)
  })
})
