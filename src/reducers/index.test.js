import allReducers from '.'

describe('Combine Reducers', () => {
  const initialState = {
    breadcrumbReducer: [{ route: '/', libelle: 'Home' }],
    filesReducer: [],
    modalReducer: { modalType: null, modalProps: {} },
    socketReducer: { connected: false, loading: false },
    viewSwitcherReducer: {list: true, loading_animation: true},
  }

  it('should return the initial state', () => {
    const state = allReducers(undefined, {})
    expect(state.breadcrumbReducer).toEqual(initialState.breadcrumbReducer)
    expect(state.filesReducer).toEqual(initialState.filesReducer)
    expect(state.modalReducer).toEqual(initialState.modalReducer)
    expect(state.socketReducer).toEqual(initialState.socketReducer)
    expect(state.viewSwitcherReducer).toEqual(initialState.viewSwitcherReducer)
  })
})
