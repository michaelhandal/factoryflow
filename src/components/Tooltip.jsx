// src/components/Tooltip.jsx

// A small "ⓘ" icon that reveals an explanatory tooltip on hover/focus.
// Used next to industrial-engineering terms throughout the dashboard so a
// reviewer unfamiliar with the jargon can understand it without leaving
// the page.

function Tooltip({ text }) {
  return (
    <span className="tooltip" tabIndex={0}>
      <span className="tooltip__icon">ⓘ</span>
      <span className="tooltip__bubble">{text}</span>
    </span>
  );
}

export default Tooltip;