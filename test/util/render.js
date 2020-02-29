/**
 * Taken from react-youtube's tests at
 * https://github.com/troybetz/react-youtube
 */

import React from 'react';
import ReactDOM from 'react-dom';
import env from 'min-react-env';
import createVimeo from './createVimeo';

Object.assign(global, env);

const render = (initialProps) => {
  const { Vimeo, sdkMock, playerMock } = createVimeo({
    shouldFail: initialProps.shouldFail,
  });

  let component;
  // Emulate changes to component.props using a container component's state
  class Container extends React.Component {
    constructor(ytProps) {
      super(ytProps);

      this.state = { props: ytProps };
    }

    render() {
      const { props } = this.state;

      return (
        <Vimeo
          ref={(vimeo) => { component = vimeo; }}
          {...props}
        />
      );
    }
  }

  const div = env.document.createElement('div');
  const container = new Promise((resolve) => {
    ReactDOM.render(<Container {...initialProps} ref={resolve} />, div);
  });

  function rerender(newProps) {
    return container.then((wrapper) => (
      new Promise((resolve) => {
        wrapper.setState({ props: newProps }, () => {
          Promise.resolve().then(resolve);
        });
      })
    ));
  }

  function unmount() {
    ReactDOM.unmountComponentAtNode(div);
  }

  return {
    sdkMock,
    playerMock,
    component,
    rerender,
    unmount,
  };
};

export default render;
