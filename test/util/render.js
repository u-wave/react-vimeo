/**
 * Taken from react-youtube's tests at
 * https://github.com/troybetz/react-youtube
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import env from 'min-react-env';
import createVimeo from './createVimeo';

Object.assign(global, env, {
  navigator: { userAgent: 'min-react-env' },
});

const reactMajor = parseInt((ReactDOM.version || '16').split('.')[0], 10);

function noAct(fn) {
  return fn();
}

async function render(initialProps) {
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
  let root;
  if (reactMajor >= 18) {
    const { createRoot } = await import('react-dom/client');
    root = createRoot(div);
  } else {
    root = {
      render(element) {
        // eslint-disable-next-line react/no-deprecated
        ReactDOM.render(element, div);
      },
      unmount() {
        // eslint-disable-next-line react/no-deprecated
        ReactDOM.unmountComponentAtNode(div);
      },
    };
  }
  const container = await new Promise((resolve) => {
    root.render(<Container {...initialProps} ref={resolve} />);
  });

  function rerender(newProps) {
    return (act || noAct)(async () => {
      container.setState({ props: newProps });
    });
  }

  function unmount() {
    root.unmount();
  }

  return {
    sdkMock,
    playerMock,
    component,
    rerender,
    unmount,
  };
}

export default render;
