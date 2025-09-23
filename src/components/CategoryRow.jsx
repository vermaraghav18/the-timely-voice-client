// src/components/CategoryRow.jsx
export default function CategoryRow({ title, items = [], href = "#" }) {
  return (
    <section className="section">
      <div className="section-head">
        <h2>{title}</h2>
        <a className="chip" href={href} aria-label={`More ${title}`}>More</a>
      </div>

      <div className="cat-grid">
        {items.map((it) => (
          <a key={it.id} href={it.href} className="cat-card card hover-raise">
            <div className="thumb">
              <img src={it.image} alt="" loading="lazy" decoding="async" />
            </div>
            <h3 className="cat-title">{it.title}</h3>
          </a>
        ))}
      </div>
    </section>
  );
}
