import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Creator } from '../.';

const App = () => {
  return (
    <div>
      <Creator />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
