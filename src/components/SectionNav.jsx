// src/components/SectionNav.jsx

// A sticky navigation bar of in-page anchor links, so a reviewer can jump
// directly to any section instead of scrolling through the whole page.

const SECTIONS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'takt-time', label: 'Takt Time' },
  { id: 'factory-diagram', label: 'Visual Factory' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'optimization', label: 'Optimize' },
  { id: 'scenarios', label: 'Scenarios' },
  { id: 'simulation', label: 'Simulation' },
  { id: 'cost', label: 'Cost Model' },
  { id: 'line-builder', label: 'Line Builder' },
];

function SectionNav() {
  function handleClick(e, id) {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  return (
    <nav className="section-nav">
      <div className="section-nav__inner">
        {SECTIONS.map((section) => (
<a          
            key={section.id}
            href={`#${section.id}`}
            className="section-nav__link"
            onClick={(e) => handleClick(e, section.id)}
          >
            {section.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

export default SectionNav;
