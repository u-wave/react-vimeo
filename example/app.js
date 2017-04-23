/* global document */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Vimeo from '../';

const videos = [
  { id: 115783408, name: 'Jambinai - Connection' },
  { id: 162959050, name: 'Jambinai - They Keep Silence' },
  { id: 169408731, name: 'Hoody - Like You' },
];

class App extends React.Component {
  state = {
    video: 0,
    volume: 1,
    paused: false,
  };

  selectVideo(index) {
    this.setState({ video: index });
  }

  handlePause = (event) => {
    this.setState({
      paused: event.target.checked,
    });
  };

  handlePlayerPause = () => {
    this.setState({ paused: true });
  };
  handlePlayerPlay = () => {
    this.setState({ paused: false });
  };

  handleVolume = (event) => {
    this.setState({
      volume: parseFloat(event.target.value),
    });
  };

  render() {
    const video = videos[this.state.video];
    return (
      <div className="row">
        <div className="col s3">
          <h3>Video</h3>
          <div className="collection">
            {videos.map((choice, index) => (
              <a
                href={`#!/video/${index}`}
                className={`collection-item ${video === choice ? 'active' : ''}`}
                onClick={() => this.selectVideo(index)}
              >
                {choice.name}
              </a>
            ))}
          </div>
          <h3>Paused</h3>
          <p>
            <input
              type="checkbox"
              id="paused"
              checked={this.state.paused}
              onChange={this.handlePause}
            />
            <label htmlFor="paused">
              Paused
            </label>
          </p>
          <h3>Volume</h3>
          <input
            type="range"
            value={this.state.volume}
            min={0}
            max={1}
            step={0.01}
            onChange={this.handleVolume}
          />
        </div>
        <div className="col s9 center-align">
          <Vimeo
            video={video.id}
            width={640}
            height={480}
            autoplay
            volume={this.state.volume}
            paused={this.state.paused}
            onPause={this.handlePlayerPause}
            onPlay={this.handlePlayerPlay}
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('example'));
