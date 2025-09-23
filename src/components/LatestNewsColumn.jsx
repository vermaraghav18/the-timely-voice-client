import React from "react";

export default function LatestNewsColumn({ title = "Latest News", items = [] }) {
  return (
    <aside className="side-col latestnews">
      <h3 className="side-title">{title}</h3>

      <div className="latest-list">
        {items.map((it, i) => (
          <a className="ln-item" href={it.href} key={i}>
            <span className="ln-bullet" aria-hidden="true">•</span>
            <span className="ln-title">{it.title}</span>
          </a>
        ))}
      </div>
    </aside>
  );
}
