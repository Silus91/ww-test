/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';

const App = ({ store }) =>
  <Provider store={store}>
    <p
      css={css`
        font-size: 100px;
      `}
    >
      Your app here
    </p>
  </Provider>;

App.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default App;
