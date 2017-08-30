import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as actionsCreators from '../actions/ActionCreators'
import PersonalFiles from '../components/PersonalFiles'

PersonalFiles.propTypes = {
  state: PropTypes.shape({
    files: PropTypes.array.isRequired,
    view: PropTypes.object.isRequired,
    breadcrumb: PropTypes.array.isRequired,
    socket: PropTypes.object.isRequired,
  }),
  dispatch: PropTypes.shape({
    init: PropTypes.func.isRequired,
    end: PropTypes.func.isRequired,
    moveTo: PropTypes.func.isRequired,
    moveUp: PropTypes.func.isRequired,
    refresh: PropTypes.func.isRequired,
    createFiles: PropTypes.func.isRequired,
    searchFile: PropTypes.func.isRequired,
    renameFile: PropTypes.func.isRequired,
    deleteFile: PropTypes.func.isRequired,
    downloadFile: PropTypes.func.isRequired,
    moveFile: PropTypes.func.isRequired,
    createDir: PropTypes.func.isRequired,
    removeDir: PropTypes.func.isRequired,
    switchView: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired,
    hideModal: PropTypes.func.isRequired,
  }),
}

const mapStateToProps = (state) => {
  return {
    state: {
      files: state.filesReducer,
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
      createFiles: (route, files={}) => {
        for(const file of files) {
          dispatch(actionsCreators.socketCreateFile(
            route === '/' ? route.concat(file.name) : route.concat('/', file.name),
            file
          ))
        }
      },
      searchFile: (name) => {
        dispatch(actionsCreators.removePath(0))
        dispatch(actionsCreators.socketSearchFile(name))
        dispatch(actionsCreators.hideModal())
      },
      renameFile: (file, name) => {
        dispatch(actionsCreators.socketRenameFile(file, name))
        dispatch(actionsCreators.hideModal())
      },
      deleteFile: (file) => {
        dispatch(actionsCreators.socketDeleteFile(file))
        dispatch(actionsCreators.hideModal())
      },
      downloadFile: (file) => dispatch(actionsCreators.socketDownloadFile(file)),
      moveFile: (file, path) => dispatch(actionsCreators.socketMoveFile(file, path)),
      createDir: (route, name) => {
        dispatch(actionsCreators.socketCreateDir(route, name))
        dispatch(actionsCreators.hideModal())
      },
      removeDir: (dir) => {
        dispatch(actionsCreators.socketRemoveDir(dir))
        dispatch(actionsCreators.hideModal())
      },
      switchView: () => dispatch(actionsCreators.switchView()),
      showModal: (modalType, modalProps) => dispatch(actionsCreators.showModal(modalType, modalProps)),
      hideModal: () => dispatch(actionsCreators.hideModal()),
    }
  }
}

const PersonalFilesContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(PersonalFiles))

export default PersonalFilesContainer
