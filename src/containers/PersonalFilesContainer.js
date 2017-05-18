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
      modal: state.modalReducer,
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: {
      init: () => dispatch(actionsCreators.socketConnect()),
      end: () => {
        dispatch(actionsCreators.socketEnd())
        dispatch(actionsCreators.removePath(0))
      },
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
      createFiles: (route, files=[], result) => {
        for(const file of files) {
          dispatch(actionsCreators.socketCreateFile(
            route === '/' ? route.concat(file.name) : route.concat('/', file.name),
            file
          ))
        }
        dispatch(actionsCreators.socketListDir(route))
      },
      renameFile: (route, name, newName) => {
        const actualRoute = route === '/' ? route.concat(name) : route.concat('/', name)
        const newRoute = route === '/' ? route.concat(newName) : route.concat('/', newName)
        dispatch(actionsCreators.socketRenameFile(actualRoute, newRoute))
        dispatch(actionsCreators.socketListDir(route))
        dispatch(actionsCreators.hideModal())
      },
      deleteFile: (route, name) => {
        dispatch(actionsCreators.socketDeleteFile(route === '/' ? route.concat(name) : route.concat('/', name)))
        dispatch(actionsCreators.socketListDir(route))
      },
      createDir: (route, name) => {
        dispatch(actionsCreators.socketCreateDir(route === '/' ? route.concat(name) : route.concat('/', name)))
        dispatch(actionsCreators.socketListDir(route))
        dispatch(actionsCreators.hideModal())
      },
      removeDir: (route, name) => {
        dispatch(actionsCreators.socketRemoveDir(route === '/' ? route.concat(name) : route.concat('/', name)))
        dispatch(actionsCreators.socketListDir(route))
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
