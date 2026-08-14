// src/hooks/useSimulation.js
import { useState, useRef, useEffect, useCallback } from 'react';
import { createSimulationState, stepSimulation, calculateTotalWIP } from '../simulation/simulationEngine';

const TICK_INTERVAL_MS = 200; // how often we advance the simulation, in real time
const BASE_DT_SECONDS = 1; // simulated seconds advanced per tick, at 1x speed
const MAX_HISTORY_POINTS = 200; // caps memory/chart size on long runs

/**
 * useSimulation
 *
 * Wraps the pure simulation engine in a React hook: manages the running
 * interval, exposes Start/Pause/Reset controls and a speed multiplier, and
 * always uses the LATEST line/requiredRatePerHour via refs — so editing the
 * line while the simulation is running doesn't require a restart. Also
 * records a capped history of (time, WIP) points for charting.
 */
export function useSimulation(line, requiredRatePerHour) {
  const [simState, setSimState] = useState(() => createSimulationState(line));
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [wipHistory, setWipHistory] = useState([]);

  const lineRef = useRef(line);
  useEffect(() => { lineRef.current = line; }, [line]);

  const rateRef = useRef(requiredRatePerHour);
  useEffect(() => { rateRef.current = requiredRatePerHour; }, [requiredRatePerHour]);

  const speedRef = useRef(speed);
  useEffect(() => { speedRef.current = speed; }, [speed]);

  useEffect(() => {
    if (!isRunning) return;

    const intervalId = setInterval(() => {
      const dt = BASE_DT_SECONDS * speedRef.current;
      const currentLine = lineRef.current;
      const arrivalIntervalSeconds =
        rateRef.current > 0 ? 3600 / rateRef.current : 0;

      setSimState((prev) => {
        const next = stepSimulation(prev, currentLine, dt, arrivalIntervalSeconds);
        const wip = calculateTotalWIP(next, currentLine);

        setWipHistory((prevHistory) => {
          const updated = [...prevHistory, { time: Math.round(next.simulatedSeconds), wip }];
          return updated.length > MAX_HISTORY_POINTS
            ? updated.slice(updated.length - MAX_HISTORY_POINTS)
            : updated;
        });

        return next;
      });
    }, TICK_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [isRunning]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    setIsRunning(false);
    setSimState(createSimulationState(lineRef.current));
    setWipHistory([]);
  }, []);

  const totalWIP = calculateTotalWIP(simState, line);

  return { simState, isRunning, speed, setSpeed, start, pause, reset, totalWIP, wipHistory };
}