import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as actionsCreators from '../actions/ActionCreators'
import PersonalFiles from '../components/PersonalFiles'

PersonalFiles.propTypes = {
  state: PropTypes.shape({
    files: PropTypes.array.isRequired,
    selection: PropTypes.object.isRequired,
    view: PropTypes.object.isRequired,
    breadcrumb: PropTypes.array.isRequired,
    socket: PropTypes.object.isRequired,
  }),
  dispatch: PropTypes.shape({
    init: PropTypes.func.isRequired,
    end: PropTypes.func.isRequired,
    openFile: PropTypes.func.isRequired,
    moveTo: PropTypes.func.isRequired,
    moveUp: PropTypes.func.isRequired,
    refresh: PropTypes.func.isRequired,
    selectFile: PropTypes.func.isRequired,
    restoring: PropTypes.func.isRequired,
  }),
}

const mapStateToProps = (state) => {
  return {
    state: {
      files: state.filesReducer,
      selection: state.selectionReducer,
      view: state.viewSwitcherReducer,
      breadcrumb: state.breadcrumbReducer,
      socket: state.socketReducer,
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: {
      init: () => dispatch(actionsCreators.socketListDir('/')),
      end: () => dispatch(actionsCreators.removePath(0)),
      openFile: (file) => dispatch(actionsCreators.openFile(file)),
      moveTo: (route, name) => {
        const path = {
          route: route === '/' ? route.concat(name) : route.concat('/', name),
          libelle: name
        }
        dispatch(actionsCreators.socketListDir(path.route))
        dispatch(actionsCreators.addPath(path))
      },
      moveUp: (route, index) => {
        dispatch(actionsCreators.socketListDir(route))
        dispatch(actionsCreators.removePath(index))
      },
      refresh: (route, animate) => dispatch(actionsCreators.socketListDir(route, animate)),
      restoring: (state) => dispatch(actionsCreators.restoring(state)),
      selectFile: (file, state) => dispatch(actionsCreators.selectFile(file, state)),
    }
  }
}

const PersonalFilesContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(PersonalFiles))

export default PersonalFilesContainer
