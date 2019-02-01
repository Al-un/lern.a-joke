import React from 'react';
import propTypes from 'prop-types';
import styled from 'styled-components';
import { media } from '../styles';

const JokeFlex = styled.div`
  padding: 0.5rem;
  width: 25%;
  box-sizing: border-box;

  ${media.tablet`width: 50%;`}
  ${media.mobile`width: 100%;`}
`;

const JokeBox = styled.div`
  border: 1px solid ${props => props.theme.primary};
  border-radius: 4px;
  padding: 1rem;
  transition: background 0.2s, border 0.2s;
  min-height: 180px;

  &:hover {
    background: ${props => props.theme.secondary};
    border-color: teal;
    border-width: 2px;
  }

  ${media.mobile`
    min-height: auto;
  `}
`;

const JokeContent = styled.div``;
const JokeMisc = styled.div`
  color: grey;
`;

export default class Joke extends React.Component {
  render() {
    return (
      <JokeFlex>
        <JokeBox>
          <JokeContent
            dangerouslySetInnerHTML={{ __html: this.props.joke.content }}
          />
          <JokeMisc>{this.props.joke.misc}</JokeMisc>
        </JokeBox>
      </JokeFlex>
    );
  }
}

Joke.propTypes = {
  joke: propTypes.shape({
    id: propTypes.number.isRequired,
    content: propTypes.string.isRequired,
    misc: propTypes.string
  })
};
