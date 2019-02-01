import React from 'react';
import styled from 'styled-components';

import Header from './Header';
import JokeList from './JokeList';

const MainContainer = styled.main`
  width: 100%;
  max-width: 1000px;
  margin: auto;
  padding: 1rem;
  box-sizing: border-box;
  background: white;
  min-height: calc(100vh - 70px);
`;

export default function Layout(_props) {
  return (
    <div>
      <Header>Hey Chuck!</Header>
      <MainContainer>
        <JokeList />
      </MainContainer>
    </div>
  );
}
