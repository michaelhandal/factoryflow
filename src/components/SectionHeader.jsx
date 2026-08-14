// src/components/SectionHeader.jsx

// Consistent title + one-line description used at the top of every major
// panel, so the whole page reads with one visual rhythm instead of each
// section looking like it was designed separately.

function SectionHeader({ title, description }) {
  return (
    <div className="section-header">
      <h2 className="section-header__title">{title}</h2>
      {description && <p className="section-header__description">{description}</p>}
    </div>
  );
}

export default SectionHeader;