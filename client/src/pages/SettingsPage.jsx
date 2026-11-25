
import React, { useState } from "react";
import { Link } from "react-router-dom";

import PageHeading from "../components/layout/PageHeading";
import "./Settings.css";

export default function SettingsPage() {
  const defaultSettings = {
    displayName: "",
    email: "",
    language: "English",
    dateFormat: "DD/MM/YYYY",
    rowsPerPage: "10",
    compactTables: false
  };

  const [settings, setSettings] = useState(() => {
    try {
      return {
        ...defaultSettings,
        ...JSON.parse(localStorage.getItem("databoard_app_settings") || "{}")
      };
    } catch {
      return defaultSettings;
    }
  });

  const [saveMessage, setSaveMessage] = useState("");

  function updateSetting(field, value) {
    setSettings(previous => ({
      ...previous,
      [field]: value
    }));
    setSaveMessage("");
  }

  function saveSettings(event) {
    event.preventDefault();

    try {
      localStorage.setItem(
        "databoard_app_settings",
        JSON.stringify(settings)
      );
      setSaveMessage("Settings saved successfully.");
    } catch (error) {
      console.error("Unable to save settings", error);
      setSaveMessage("Unable to save settings in this browser.");
    }
  }

  function resetSettings() {
    if (!window.confirm("Reset all application settings to their defaults?")) {
      return;
    }

    setSettings(defaultSettings);

    try {
      localStorage.removeItem("databoard_app_settings");
      setSaveMessage("Settings have been reset.");
    } catch (error) {
      console.error("Unable to reset settings", error);
      setSaveMessage("Unable to reset settings.");
    }
  }

  return (
    <div className="app-settings-page">
      <PageHeading
        title="Settings"
        description="Manage your profile information and application preferences."
      />

      <form onSubmit={saveSettings}>
        <section className="app-settings-card">
          <div className="app-settings-heading">
            <h3>Profile information</h3>
            <p>Manage the profile details displayed in this application.</p>
          </div>

          <div className="app-settings-grid">
            <label className="app-settings-field">
              Display name
              <input
                type="text"
                value={settings.displayName}
                onChange={event =>
                  updateSetting("displayName", event.target.value)
                }
                placeholder="Enter your display name"
                maxLength={60}
              />
            </label>

            <label className="app-settings-field">
              Email address
              <input
                type="email"
                value={settings.email}
                onChange={event =>
                  updateSetting("email", event.target.value)
                }
                placeholder="Enter your email address"
              />
            </label>
          </div>

          <p className="app-settings-note">
            These details are stored only in this browser. They do not update
            your account or backend profile.
          </p>
        </section>

        <section className="app-settings-card">
          <div className="app-settings-heading">
            <h3>Application preferences</h3>
            <p>Choose your preferred language and date format.</p>
          </div>

          <div className="app-settings-grid">
            <label className="app-settings-field">
              Language
              <select
                value={settings.language}
                onChange={event =>
                  updateSetting("language", event.target.value)
                }
              >
                <option value="English">English</option>
              </select>
            </label>

            <label className="app-settings-field">
              Date format
              <select
                value={settings.dateFormat}
                onChange={event =>
                  updateSetting("dateFormat", event.target.value)
                }
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </label>
          </div>
        </section>

        <section className="app-settings-card">
          <div className="app-settings-heading">
            <h3>Display preferences</h3>
            <p>Set your preferred table display options.</p>
          </div>

          <div className="app-settings-grid">
            <label className="app-settings-field">
              Rows per page
              <select
                value={settings.rowsPerPage}
                onChange={event =>
                  updateSetting("rowsPerPage", event.target.value)
                }
              >
                <option value="10">10 rows</option>
                <option value="25">25 rows</option>
                <option value="50">50 rows</option>
                <option value="100">100 rows</option>
              </select>
            </label>

            <label className="app-settings-checkbox">
              <input
                type="checkbox"
                checked={settings.compactTables}
                onChange={event =>
                  updateSetting("compactTables", event.target.checked)
                }
              />
              <span>
                <strong>Compact table preference</strong>
                <small>Save a preference for more compact data tables.</small>
              </span>
            </label>
          </div>
        </section>

        <section className="app-settings-card">
          <div className="app-settings-heading">
            <h3>Legal information</h3>
            <p>Review the application's policies and terms.</p>
          </div>

          <div className="app-settings-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms &amp; Conditions</Link>
          </div>
        </section>

        <div className="app-settings-footer">
          <div>
            {saveMessage && (
              <span className="app-settings-message" role="status">
                {saveMessage}
              </span>
            )}
          </div>

          <div className="app-settings-actions">
            <button
              type="button"
              className="app-settings-reset"
              onClick={resetSettings}
            >
              Reset settings
            </button>

            <button type="submit" className="primary-button">
              Save settings
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
