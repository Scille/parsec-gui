import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as actionsCreators from '../actions/ActionCreators'
import Tools from '../components/Tools'

Tools.propTypes = {
  state: PropTypes.shape({
    socket: PropTypes.object.isRequired,
  }),
  dispatch: PropTypes.shape({
    init: PropTypes.func.isRequired,
    createFiles: PropTypes.func.isRequired,
    searchFile: PropTypes.func.isRequired,
    renameFile: PropTypes.func.isRequired,
    cutFiles: PropTypes.func.isRequired,
    moveFile: PropTypes.func.isRequired,
    deleteFile: PropTypes.func.isRequired,
    createDir: PropTypes.func.isRequired,
    refresh: PropTypes.func.isRequired,
    switchView: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired,
    hideModal: PropTypes.func.isRequired,
    restore: PropTypes.func.isRequired,
  }),
}

const mapStateToProps = (state) => {
  return {
    state: {
      breadcrumb: state.breadcrumbReducer,
      selection: state.selectionReducer,
      socket: state.socketReducer,
      view: state.viewSwitcherReducer,
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: {
      init: () => {},
      logged: () => dispatch(actionsCreators.socketLogged()),
      createFiles: (route, files={}) => {
        for(const file of files) {
          dispatch(actionsCreators.socketCreateFile(
            route === '/' ? route.concat(file.name) : route.concat('/', file.name),
            file
          ))
        }
      },
      searchFile: (name) => {
        dispatch(actionsCreators.setPath("/"))
        dispatch(actionsCreators.socketSearchFile(name))
        dispatch(actionsCreators.hideModal())
      },
      renameFile: (file, name) => {
        dispatch(actionsCreators.socketRenameFile(file, name))
        dispatch(actionsCreators.hideModal())
      },
      cutFiles: (files) => dispatch(actionsCreators.cutFiles(files)),
      moveFile: (file, path) => dispatch(actionsCreators.socketMoveFile(file, path)),
      deleteFile: (file) => {
        dispatch(actionsCreators.socketDeleteFile(file))
        dispatch(actionsCreators.hideModal())
      },
      // openFile: (file) => dispatch(actionsCreators.openFile(file)),
      createDir: (route, name) => {
        dispatch(actionsCreators.socketCreateDir(route, name))
        dispatch(actionsCreators.hideModal())
      },
      sharePath: (path, recipient) => {
        dispatch(actionsCreators.socketSharePath(path, recipient))
        dispatch(actionsCreators.hideModal())
      },
      refresh: (route, animate) => dispatch(actionsCreators.socketListDir(route, animate)),
      restore: (state) => dispatch(actionsCreators.restore(state)),
      switchView: () => dispatch(actionsCreators.switchView()),
      showModal: (modalType, modalProps) => dispatch(actionsCreators.showModal(modalType, modalProps)),
      hideModal: () => dispatch(actionsCreators.hideModal()),
    }
  }
}

const ToolsContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Tools))

export default ToolsContainer
