import React from 'react';
import * as ReactDOM from 'react-dom';
import { Default as Creator } from '../stories/Creator.stories';

describe('Thing', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Creator />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
