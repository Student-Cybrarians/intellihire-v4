export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "3rem 1.25rem" }}>
      <h1>Privacy Policy</h1>
      <p>
        IntelliHire uses Google OpenID Connect for authentication. The application stores the
        account identity needed to create and manage your IntelliHire profile and sessions.
      </p>
      <p>
        Session records may include device, user-agent, and network metadata for security and
        session management. Passwords are never stored by IntelliHire because password-based login
        is not supported.
      </p>
      <p>
        NVIDIA API credentials are server-side secrets and are never exposed to browser code. AI
        requests should be limited to the data required for the requested IntelliHire feature.
      </p>
      <p>
        This is a project-level privacy notice and should be replaced with institution-approved
        legal text before public commercial launch.
      </p>
      <a href="/">Return to IntelliHire</a>
    </main>
  );
}
