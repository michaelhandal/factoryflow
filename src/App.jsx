// src/App.jsx
import { useState } from 'react';
import './App.css';
import { createDefaultLine } from './data/defaultLine';
import LineBuilder from './components/LineBuilder';
import TaktTimePanel from './components/TaktTimePanel';

function App() {
  // The production line lives here, at the top of the app, so that later
  // phases (dashboard, visualization, simulation) can all read from and
  // write to this same single source of truth.
  const [line, setLine] = useState(createDefaultLine());

  return (
    <>
      <header className="app-header">
        <div className="app-header__brand">
          <span className="app-header__title">FactoryFlow</span>
          <span className="app-header__tagline">Simulate. Analyze. Optimize.</span>
        </div>
      </header>

      <main className="app-main">
        <TaktTimePanel line={line} />
        <LineBuilder line={line} onLineChange={setLine} />
      </main>

      <footer className="app-footer">
        FactoryFlow — Manufacturing Simulation &amp; Optimization
      </footer>
    </>
  );
}

export default App;