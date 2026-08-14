// src/components/WipIndicator.jsx

// Renders a station's queued units as small stacked blocks — a direct
// visual read of WIP accumulation, rather than just a number.

const MAX_VISIBLE_BLOCKS = 20;

function classifyQueueSeverity(queueCount) {
  if (queueCount >= 15) return 'severe';
  if (queueCount >= 6) return 'moderate';
  if (queueCount >= 1) return 'light';
  return 'none';
}

function WipIndicator({ queueCount }) {
  const severity = classifyQueueSeverity(queueCount);
  const visibleCount = Math.min(queueCount, MAX_VISIBLE_BLOCKS);
  const overflow = queueCount - MAX_VISIBLE_BLOCKS;

  if (queueCount === 0) {
    return <div className="wip-indicator wip-indicator--empty">No units waiting</div>;
  }

  return (
    <div className={`wip-indicator wip-indicator--${severity}`}>
      <div className="wip-indicator__blocks">
        {Array.from({ length: visibleCount }).map((_, i) => (
          <span className="wip-indicator__block" key={i} />
        ))}
      </div>
      {overflow > 0 && (
        <span className="wip-indicator__overflow">+{overflow} more</span>
      )}
    </div>
  );
}

export default WipIndicator;