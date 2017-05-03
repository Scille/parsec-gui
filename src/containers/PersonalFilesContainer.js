import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actionsCreators from '../actions/actionCreators';
import PersonalFiles from '../components/PersonalFiles';

PersonalFiles.propTypes = {
  state: PropTypes.shape({
    files: PropTypes.array.isRequired,
    listView: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
  }),
  dispatch: PropTypes.shape({
    socketConnect: PropTypes.func.isRequired,
    socketEnd: PropTypes.func.isRequired,
    socketListDir: PropTypes.func.isRequired,
    socketCreateFiles: PropTypes.func.isRequired,
    switchView: PropTypes.func.isRequired,
  }),
};

const mapStateToProps = (state) => {
  return {
    state: {
      files: state.personalFilesReducer,
      listView: state.viewSwitcherReducer,
      path: state.pathReducer,
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: {
      socketConnect: () => {
        dispatch(actionsCreators.socketConnect());
      },
      socketEnd: () => {
        dispatch(actionsCreators.socketEnd());
      },
      socketListDir: (path='') => {
        dispatch(actionsCreators.socketListDir(path));
        dispatch(actionsCreators.switchPath(path));
      },
      socketCreateFiles: (path='', files=[]) => {
        for (let i = 0; i < files.length; i++) {
          const filePath = path.concat('/', files[i].name);
          dispatch(actionsCreators.socketCreateFile(filePath, files[i]));
        };
      },
      switchView: () => {
        dispatch(actionsCreators.switchView());
      },
    }
  }
}

const PersonalFilesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PersonalFiles)

export default PersonalFilesContainer;
