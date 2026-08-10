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

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.35 12.27c0-.72-.06-1.42-.18-2.09H12v3.96h5.23a4.48 4.48 0 0 1-1.94 2.94v2.44h3.14c1.84-1.69 2.92-4.18 2.92-7.25Z"
      />
      <path
        fill="#34A853"
        d="M12 21.8c2.63 0 4.84-.87 6.45-2.36l-3.14-2.44c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.28v2.52A9.74 9.74 0 0 0 12 21.8Z"
      />
      <path
        fill="#FBBC05"
        d="M6.53 13.89A5.86 5.86 0 0 1 6.22 12c0-.66.11-1.3.31-1.89V7.59H3.28A9.74 9.74 0 0 0 2.25 12c0 1.58.38 3.08 1.03 4.41l3.25-2.52Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.08c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.16 14.63 2.2 12 2.2a9.74 9.74 0 0 0-8.72 5.39l3.25 2.52C7.3 7.8 9.46 6.08 12 6.08Z"
      />
    </svg>
  );
}

export function EntryPage() {
  const [loading, setLoading] = useState(false);
  const params = useMemo(
    () => new URLSearchParams(typeof window !== "undefined" ? window.location.search : ""),
    [],
  );
  const status = params.get("auth");
  const redirectTo = params.get("redirectTo") ?? "/dashboard";

  const onGoogle = () => {
    if (loading) return;
    setLoading(true);
    window.location.assign(`/api/auth/google?redirectTo=${encodeURIComponent(redirectTo)}`);
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
          Practice with an AI placement coach that helps candidates sharpen resumes, assessments,
          interviews, communication, and final readiness.
        </p>
        <ul className="benefits" aria-label="IntelliHire features">
          {benefits.map((benefit) => (
            <li key={benefit}>{benefit}</li>
          ))}
        </ul>
      </section>

      <section className="cardWrap" aria-label="Authentication">
        <div className="authCard">
          <p className="eyebrow">Secure entry</p>
          <h2>Welcome to IntelliHire</h2>
          <p className="muted">
            Sign in or create your account with your verified Google account. No IntelliHire
            password is required.
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
            {loading ? <span className="spinner" aria-hidden="true" /> : <GoogleIcon />}
            {loading ? "Redirecting…" : "Continue with Google"}
          </button>

          <p className="muted">
            Google handles your password. IntelliHire stores only the account identity and secure
            server-side session needed for your workspace.
          </p>

          <p className="links">
            <a href="/terms">Terms of Service</a> · <a href="/privacy">Privacy Policy</a>
          </p>
        </div>
      </section>
    </main>
  );
}
