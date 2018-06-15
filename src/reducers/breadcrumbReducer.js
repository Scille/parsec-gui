import * as types from '../actions/ActionTypes'

const initialState = [{ route: '/', libelle: 'Home' }]

const breadcrumbReducer = (state=initialState, action) => {
  switch(action.type) {
    case types.SET_PATH:
      var route = action.path.split("/")
      route.shift()
      if(route[0] === "")
        route.shift()
      var breadcrump = [{"route": "", "libelle": "Home"}]
      for (var i = 0; i < route.length; i++) {
        breadcrump.push({"route": breadcrump[i].route + "/" + route[i], "libelle": route[i]})
      }
      breadcrump[0].route = "/"
      return breadcrump
    default:
      return state
  }
}

export default breadcrumbReducer
