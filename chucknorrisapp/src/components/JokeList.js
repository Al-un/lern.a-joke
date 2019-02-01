import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';

import Joke from './Joke';
import { requestJokes } from '../redux/joke.ducks';

const Reloader = styled.button`
  border: 1px solid ${props => props.theme.primary};
  border-radius: 4px;
  color: ${props => props.theme.primary};
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  display: block;
  margin: auto;

  transition: background 0.6s;

  &:hover {
    background: ${props => props.theme.primary};
    color: white;
  }
`;

const JokeListContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
`;

/**
 * Jokes list pure components
 */
export class PureJokeList extends React.Component {
  componentDidMount() {
    this.props.load();
  }

  render() {
    return (
      <div>
        <Reloader type="button" onClick={() => this.props.load()}>
          Reload
        </Reloader>
        {this.props.jokes ? (
          <JokeListContainer>
            {this.props.jokes.map(joke => (
              <Joke joke={joke} key={joke.id} />
            ))}
          </JokeListContainer>
        ) : (
          'loading...'
        )}
      </div>
    );
  }
}

PureJokeList.propTypes = {
  jokes: propTypes.array,
  load: propTypes.func.isRequired
};

const mapStateToProps = state => ({ jokes: state.jokes });

const mapDispatchToProps = dispatch => {
  return {
    load: () => dispatch(requestJokes())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PureJokeList);

// JokeList.defaultProps = {
//   jokes: [
//     {
//       id: 1,
//       content: 'this is some joke',
//       misc: 'these are misc info'
//     },
//     {
//       id: 2,
//       content: 'this is some joke2',
//       misc: 'these are misc info2'
//     },
//     {
//       id: 3,
//       content: 'this is some joke3',
//       misc: 'these are misc info3F'
//     }
//   ]
// };
