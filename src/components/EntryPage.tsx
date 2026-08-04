"use client";
import { useMemo, useState } from "react";
const benefits = [
  "AI Resume Screening",
  "Adaptive Assessments",
  "AI Technical Interviews",
  "Real-Time HR Interviews",
  "Performance Insights",
  "Personalized Recommendations",
];
export function EntryPage() {
  const [loading, setLoading] = useState(false);
  const status = useMemo(
    () =>
      new URLSearchParams(typeof window !== "undefined" ? window.location.search : "").get("auth"),
    [],
  );
  const onGoogle = () => {
    if (loading) return;
    setLoading(true);
    window.location.assign(`/api/auth/google?redirectTo=${encodeURIComponent("/dashboard")}`);
  };
  return (
    <main className="entry">
      <section className="hero" aria-labelledby="brand-title">
        <p className="eyebrow">AI-Based Placement Trainer</p>
        <h1 id="brand-title" className="brand">
          IntelliHire
        </h1>
        <h2 className="tagline">Train Smart. Perform Better. Get Placed.</h2>
        <p className="subtitle">
          Practice with an AI placement coach that helps candidates sharpen resumes, interviews,
          assessments, and final readiness without compromising account security.
        </p>
        <ul className="benefits" aria-label="Product benefits">
          {benefits.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </section>
      <section className="cardWrap" aria-label="Authentication">
        <div className="authCard">
          <h2>Welcome to IntelliHire</h2>
          <p className="muted">
            Use your verified Google account to sign in or create your IntelliHire account.
          </p>
          {status === "failed" && (
            <div className="msg error" role="alert">
              Google authentication failed. Please retry with a verified Google account.
            </div>
          )}
          {status === "success" && (
            <div className="msg success" role="status">
              Authentication succeeded. Redirecting to your workspace.
            </div>
          )}
          {loading && (
            <div className="msg" role="status" aria-live="polite">
              Redirecting securely to Google…
            </div>
          )}
          <button
            className="googleBtn"
            onClick={onGoogle}
            disabled={loading}
            aria-disabled={loading}
            aria-label="Continue with Google"
          >
            {loading ? (
              <span className="spinner" aria-hidden="true" />
            ) : (
              <span aria-hidden="true">G</span>
            )}
            {loading ? "Redirecting…" : "Continue with Google"}
          </button>
          <p className="muted">
            We never receive your Google password. Sessions use secure HttpOnly cookies and can be
            revoked from any device.
          </p>
          <p className="links">
            <a href="/terms">Terms of Service</a> · <a href="/privacy">Privacy Policy</a>
          </p>
          {status === "failed" && (
            <button
              className="googleBtn"
              onClick={onGoogle}
              disabled={loading}
              aria-disabled={loading}
            >
              Retry Google Sign-In
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
