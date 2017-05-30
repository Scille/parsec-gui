import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as actionsCreators from '../actions/ActionCreators'
import PersonalFiles from '../components/PersonalFiles'

PersonalFiles.propTypes = {
  state: PropTypes.shape({
    files: PropTypes.array.isRequired,
    listView: PropTypes.bool.isRequired,
    breadcrumb: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
  }),
  dispatch: PropTypes.shape({
    init: PropTypes.func.isRequired,
    end: PropTypes.func.isRequired,
    moveTo: PropTypes.func.isRequired,
    moveUp: PropTypes.func.isRequired,
    refresh: PropTypes.func.isRequired,
    createFiles: PropTypes.func.isRequired,
    renameFile: PropTypes.func.isRequired,
    deleteFile: PropTypes.func.isRequired,
    downloadFile: PropTypes.func.isRequired,
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
      listView: state.viewSwitcherReducer,
      breadcrumb: state.breadcrumbReducer,
      loading: state.socketReducer,
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
      refresh: (route) => dispatch(actionsCreators.socketListDir(route)),
      createFiles: (route, files={}) => {
        for(const file of files) {
          dispatch(actionsCreators.socketCreateFile(
            route === '/' ? route.concat(file.name) : route.concat('/', file.name),
            file
          ))
        }
      },
      renameFile: (guid, route, name, newName) => {
        dispatch(actionsCreators.socketRenameFile(guid, route, name, newName))
        dispatch(actionsCreators.hideModal())
      },
      deleteFile: (guid, route, name) => {
        dispatch(actionsCreators.socketDeleteFile(guid, route === '/' ? route.concat(name) : route.concat('/', name)))
        dispatch(actionsCreators.hideModal())
      },
      downloadFile: (id, name) => {
        dispatch(actionsCreators.socketDownloadFile(id, name))
      },
      createDir: (route, name) => {
        dispatch(actionsCreators.socketCreateDir(route, name))
        dispatch(actionsCreators.hideModal())
      },
      removeDir: (guid, route, name) => {
        dispatch(actionsCreators.socketRemoveDir(guid, route === '/' ? route.concat(name) : route.concat('/', name)))
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
