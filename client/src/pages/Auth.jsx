
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Mail, LockKeyhole, UserRound, ArrowRight } from "lucide-react";
import "./Auth.css";

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const isRegister = location.pathname === "/register";
  const isForgot = location.pathname === "/forgot-password";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (isRegister && password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setMessage(
      "Authentication is not connected yet. This page is ready for backend integration."
    );
  }

  return (
    <main className="auth-page">
      <section className="auth-intro">
        <Link to="/login" className="auth-brand">
          <span className="auth-brand-icon"><LayoutDashboard size={22} /></span>
          <span>DataBoard</span>
        </Link>

        <div className="auth-intro-content">
          <span className="auth-eyebrow">DATA WORKSPACE</span>
          <h1>Make better decisions with your data.</h1>
          <p>
            Bring your datasets, dashboards and visual reports together in
            one organized workspace.
          </p>

          <div className="auth-feature">
            <span><LayoutDashboard size={19} /></span>
            <div>
              <strong>Build visual dashboards</strong>
              <small>Turn uploaded data into clear charts and reports.</small>
            </div>
          </div>

          <div className="auth-feature">
            <span><LockKeyhole size={19} /></span>
            <div>
              <strong>Keep your workspace organized</strong>
              <small>Manage your data and reports in one place.</small>
            </div>
          </div>
        </div>

        <p className="auth-copyright">DataBoard · Dynamic Data Dashboard Builder</p>
      </section>

      <section className="auth-form-section">
        <div className="auth-form-container">
          <div className="auth-mobile-brand">
            <span className="auth-brand-icon"><LayoutDashboard size={21} /></span>
            <strong>DataBoard</strong>
          </div>

          <div className="auth-heading">
            <h2>
              {isForgot ? "Reset your password" : isRegister ? "Create your account" : "Welcome back"}
            </h2>
            <p>
              {isForgot
                ? "Enter your email address to begin the password reset process."
                : isRegister
                ? "Enter your details to create your DataBoard account."
                : "Sign in to continue to your workspace."}
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {isRegister && (
              <label>
                Full name
                <span className="auth-input-wrap">
                  <UserRound size={18} />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={event => setName(event.target.value)}
                    required
                  />
                </span>
              </label>
            )}

            <label>
              Email address
              <span className="auth-input-wrap">
                <Mail size={18} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  required
                />
              </span>
            </label>

            {!isForgot && (
              <label>
                Password
                <span className="auth-input-wrap">
                  <LockKeyhole size={18} />
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                    minLength={8}
                    required
                  />
                </span>
              </label>
            )}

            {isRegister && (
              <label>
                Confirm password
                <span className="auth-input-wrap">
                  <LockKeyhole size={18} />
                  <input
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={event => setConfirmPassword(event.target.value)}
                    minLength={8}
                    required
                  />
                </span>
              </label>
            )}

            {!isRegister && !isForgot && (
              <div className="auth-forgot-row">
                <Link to="/forgot-password">Forgot password?</Link>
              </div>
            )}

            {message && <div className="auth-message" role="status">{message}</div>}

            <button type="submit" className="auth-submit">
              {isForgot ? "Continue" : isRegister ? "Create account" : "Sign in"}
              <ArrowRight size={17} />
            </button>
          </form>

          <div className="auth-switch">
            {isForgot ? (
              <Link to="/login"> <ArrowRight className="auth-back-icon" size={15} /> Back to sign in</Link>
            ) : isRegister ? (
              <>Already have an account? <Link to="/login">Sign in</Link></>
            ) : (
              <>Don't have an account? <Link to="/register">Create account</Link></>
            )}
          </div>

          <p className="auth-legal">
            By continuing, you agree to our <Link to="/terms">Terms & Conditions</Link>
            {" "}and <Link to="/privacy">Privacy Policy</Link>.
          </p>
        </div>
      </section>
    </main>
  );
}
