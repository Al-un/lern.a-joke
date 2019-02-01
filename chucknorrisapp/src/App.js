import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';

import Layout from './components/Layout';
import store from './redux/configureStore';

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
            <Layout />
          </ThemeProvider>
        </Provider>
      </div>
    );
  }
}

export default App;
