import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components';

import Header from './components/Header';
import JokeList from './components/JokeList';
import store from './redux/configureStore';

const MainContainer = styled.main`
  width: 100%;
  max-width: 1000px;
  margin: auto;
  padding: 1rem;
  box-sizing: border-box;
  background: white;
  min-height: calc(100vh - 70px);
`;

const theme = {
  primary: 'seagreen',
  secondary: 'PaleTurquoise'
};

class App extends Component {
  render() {
    return (
      <div>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <div>
              <Header>Hey Chuck!</Header>
              <MainContainer>
                <JokeList />
              </MainContainer>
            </div>
          </ThemeProvider>
        </Provider>
      </div>
    );
  }
}

export default App;
