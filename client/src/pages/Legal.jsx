import React from "react";
import { PageHeading } from "../components/Navigation";

export default function LegalPage({ privacy }) {
  return (
    <>
      <PageHeading
        title={privacy ? "Privacy Policy" : "Terms & Conditions"}
        description="Draft project policy information."
      />
      <div className="settings-card legal-card">
        <h2>{privacy ? "Privacy Policy" : "Terms of Use"}</h2>
        <p>
          {privacy
            ? "The deployed application should explain what user information and uploaded data it collects, how that data is used, stored, protected and deleted."
            : "Users should only upload data they are authorized to use. The final terms should explain account responsibilities, acceptable use and service limitations."}
        </p>
        <div className="notice">
          Draft text only. Review and finalize this policy before public release.
        </div>
      </div>
    </>
  );
}
