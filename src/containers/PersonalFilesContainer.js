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
    listDir: PropTypes.func.isRequired,
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
      init: () => dispatch(actionsCreators.socketListDir('/', true)),
      end: () => dispatch(actionsCreators.setPath("/")),
      openFile: (file) => dispatch(actionsCreators.openFile(file)),
      listDir: (route, animate) => dispatch(actionsCreators.socketListDir(route, animate)),
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
