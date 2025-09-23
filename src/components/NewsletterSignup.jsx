// src/components/NewsletterSignup.jsx
import { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    alert(`Subscribed: ${email}`); // replace with your API later
    setEmail("");
  };

  return (
    <section className="newsletter card">
      <div className="newsletter-inner">
        <div className="nl-copy">
          <h3>Get the Daily Briefing</h3>
          <p>Top stories, analysis, and must-reads — straight to your inbox.</p>
        </div>
        <form className="nl-form" onSubmit={onSubmit}>
          <input
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email address"
          />
          <button type="submit" className="chip" style={{ fontWeight: 700 }}>
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
