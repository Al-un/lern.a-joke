
import { connect } from 'react-redux';

import { JokeList, requestJokes } from 'shared-components';

const mapStateToProps = state => ({ jokes: state.jokes });

const mapDispatchToProps = dispatch => {
  return {
    load: () => dispatch(requestJokes())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JokeList);
