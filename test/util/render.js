/**
 * Taken from react-youtube's tests at
 * https://github.com/troybetz/react-youtube
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import env from 'min-react-env';
import createVimeo from './createVimeo';

Object.assign(global, env);

async function render(initialProps) {
  const { Vimeo, sdkMock, playerMock } = createVimeo({
    shouldFail: initialProps.shouldFail,
  });

  let resolveReady;
  const readyPromise = new Promise((resolve) => {
    resolveReady = resolve;
  });
  // Emulate changes to component.props using a container component's state
  class Container extends React.Component {
    constructor(ytProps) {
      super(ytProps);

      this.state = { props: ytProps };
    }

    componentDidMount() {
      // Wait for the initial `setPlayer()` to be rendered.
      setTimeout(() => resolveReady());
    }

    render() {
      const { props } = this.state;

      return (
        <Vimeo {...props} />
      );
    }
  }

  const div = env.document.createElement('div');
  let root;
  if (ReactDOM.version.startsWith('18')) {
    const { createRoot } = await import('react-dom/client');
    root = createRoot(div);
  } else {
    root = {
      render(element) {
        ReactDOM.render(element, div);
      },
      unmount() {
        ReactDOM.unmountComponentAtNode(div);
      },
    };
  }
  const container = new Promise((resolve) => {
    root.render(<Container {...initialProps} ref={resolve} />);
  });
  await readyPromise;

  async function rerender(newProps) {
    const wrapper = await container;
    act(() => {
      wrapper.setState({ props: newProps });
    });
  }

  return {
    sdkMock,
    playerMock,
    rerender,
    unmount() {
      root.unmount();
    },
  };
}

export default render;
