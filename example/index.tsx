import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Arbiter } from '../.';

const App = () => {
  return (
    <div>
      <Arbiter />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
