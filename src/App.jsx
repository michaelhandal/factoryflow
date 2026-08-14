// src/App.jsx
import { useState } from 'react';
import './App.css';
import { createDefaultLine } from './data/defaultLine';
import LineBuilder from './components/LineBuilder';
import TaktTimePanel from './components/TaktTimePanel';
import FactoryDiagram from './components/FactoryDiagram';
import Dashboard from './components/Dashboard';
import { calculateRequiredRatePerHour } from './calculations/utilization';

function App() {
  // The production line lives here, at the top of the app, so that later
  // phases (dashboard, visualization, simulation) can all read from and
  // write to this same single source of truth.
  const [line, setLine] = useState(createDefaultLine());

  // Takt-time inputs also live here, since utilization (in LineBuilder and
  // FactoryDiagram) needs the same required-rate value that TaktTimePanel
  // calculates from.
  const [availableHours, setAvailableHours] = useState(8);
  const [customerDemand, setCustomerDemand] = useState(480);

  const requiredRatePerHour = calculateRequiredRatePerHour(customerDemand, availableHours);

  return (
    <>
      <header className="app-header">
        <div className="app-header__brand">
          <span className="app-header__title">FactoryFlow</span>
          <span className="app-header__tagline">Simulate. Analyze. Optimize.</span>
        </div>
      </header>

      <main className="app-main">
        <Dashboard line={line} />
        <TaktTimePanel
          line={line}
          availableHours={availableHours}
          setAvailableHours={setAvailableHours}
          customerDemand={customerDemand}
          setCustomerDemand={setCustomerDemand}
        />
        <FactoryDiagram line={line} requiredRatePerHour={requiredRatePerHour} />
        <LineBuilder
          line={line}
          onLineChange={setLine}
          requiredRatePerHour={requiredRatePerHour}
        />
      </main>

      <footer className="app-footer">
        FactoryFlow — Manufacturing Simulation &amp; Optimization
      </footer>
    </>
  );
}

export default App;