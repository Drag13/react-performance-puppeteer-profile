import "./App.css";
import { Profiler } from "react";
import logo from "./logo.svg";

function putRenderedMark(id, phase, actualDuration, baseDuration, startTime, commitTime) {
  if (!putRenderedMark._done) {
    putRenderedMark._done = true;
    performance.mark("app-rendered");
  }
}

function App() {
  return (
    <Profiler id="app-rendered" onRender={putRenderedMark}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
            Learn React
          </a>
        </header>
      </div>
    </Profiler>
  );
}

export default App;
