// src/App.jsx
import { useState } from 'react';
import './App.css';
import { createDefaultLine } from './data/defaultLine';
import LineBuilder from './components/LineBuilder';
import TaktTimePanel from './components/TaktTimePanel';
import FactoryDiagram from './components/FactoryDiagram';
import Dashboard from './components/Dashboard';
import SimulationPanel from './components/SimulationPanel';
import CostPanel from './components/CostPanel';
import OptimizationPanel from './components/OptimizationPanel';
import ScenarioPanel from './components/ScenarioPanel';
import AnalyticsPanel from './components/AnalyticsPanel';
import SectionNav from './components/SectionNav';
import { calculateRequiredRatePerHour } from './calculations/utilization';
import { useSimulation } from './hooks/useSimulation';

function App() {
  const [line, setLine] = useState(createDefaultLine());
  const [availableHours, setAvailableHours] = useState(8);
  const [customerDemand, setCustomerDemand] = useState(480);

  const requiredRatePerHour = calculateRequiredRatePerHour(customerDemand, availableHours);
  const simulation = useSimulation(line, requiredRatePerHour);

  return (
    <>
      <header className="app-header">
        <div className="app-header__brand">
          <span className="app-header__title">Factory Flow</span>
          <span className="app-header__tagline">Simulate. Analyze. Optimize.</span>
        </div>
      </header>

      <SectionNav />

      <main className="app-main">
        <Dashboard line={line} wip={simulation.totalWIP} />
        <TaktTimePanel
          line={line}
          availableHours={availableHours}
          setAvailableHours={setAvailableHours}
          customerDemand={customerDemand}
          setCustomerDemand={setCustomerDemand}
        />
        <FactoryDiagram
          line={line}
          requiredRatePerHour={requiredRatePerHour}
          simState={simulation.simState}
        />
        <AnalyticsPanel
          line={line}
          requiredRatePerHour={requiredRatePerHour}
          wipHistory={simulation.wipHistory}
        />
        <OptimizationPanel line={line} onApply={setLine} />
        <ScenarioPanel line={line} />
        <SimulationPanel
          line={line}
          simState={simulation.simState}
          isRunning={simulation.isRunning}
          speed={simulation.speed}
          setSpeed={simulation.setSpeed}
          start={simulation.start}
          pause={simulation.pause}
          reset={simulation.reset}
          totalWIP={simulation.totalWIP}
        />
        <CostPanel line={line} />
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