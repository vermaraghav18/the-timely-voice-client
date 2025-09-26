// src/components/StoryList.jsx
import React, { useEffect, useState } from "react";
import SmartLink from "./SmartLink";

export default function StoryList({ title = "", stories = [], delayMs = 0 }) {
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    let intervalId;
    const run = () => {
      setHighlight(true);
      setTimeout(() => setHighlight(false), 1200); // match CSS sweep duration
    };

    // start after delay, then repeat every 2s
    const startTimer = setTimeout(() => {
      run();
      intervalId = setInterval(run, 2000);
    }, delayMs);

    return () => {
      clearTimeout(startTimer);
      if (intervalId) clearInterval(intervalId);
    };
  }, [delayMs]);

  return (
    <section className="side-block">
      <header className="side-header">{title}</header>
      <ul className="side-list">
        {stories.map((s, i) => (
          <li key={i} className="side-item">
            <SmartLink
              to={s.href || "#"}
              className="side-link"
              aria-label={s.title}
              onClick={(e) => {
                if (!s.href || s.href === "#") e.preventDefault();
              }}
            >
              <img
                className="side-thumb"
                src={s.image}
                alt={s.title}
                loading="lazy"
                width="96"
                height="72"
              />
              <span className="side-title">
                <span className={`hl-sweep ${i === 0 && highlight ? "run" : ""}`}>
                  {s.title}
                </span>
              </span>
            </SmartLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
