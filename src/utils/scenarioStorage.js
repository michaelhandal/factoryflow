// src/utils/scenarioStorage.js

// Handles reading/writing saved scenarios to localStorage. A scenario is a
// named snapshot of a production line: { id, name, savedAt, line }.
// Kept isolated in its own file so the storage mechanism (localStorage)
// could be swapped out later without touching any component code.

const STORAGE_KEY = 'factoryflow_scenarios';

/**
 * loadScenarios
 *
 * Reads all saved scenarios from localStorage.
 *
 * @returns {object[]} array of saved scenarios, or [] if none exist or on error
 */
export function loadScenarios() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load scenarios from localStorage:', err);
    return [];
  }
}

/**
 * saveScenario
 *
 * Adds a new named scenario (a snapshot of the given line) to storage.
 *
 * @param {string} name - user-provided scenario name
 * @param {object[]} line - the production line to snapshot
 * @returns {object[]} the updated full list of scenarios
 */
export function saveScenario(name, line) {
  const scenarios = loadScenarios();
  const newScenario = {
    id: `scenario-${Date.now()}`,
    name,
    savedAt: new Date().toISOString(),
    line,
  };
  const updated = [...scenarios, newScenario];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

/**
 * deleteScenario
 *
 * Removes a scenario by id.
 *
 * @param {string} scenarioId
 * @returns {object[]} the updated full list of scenarios
 */
export function deleteScenario(scenarioId) {
  const scenarios = loadScenarios();
  const updated = scenarios.filter((s) => s.id !== scenarioId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}