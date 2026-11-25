import React from "react";
import { Menu, Search, Bell } from "lucide-react";

export default function Header({ onMenu }) {
  return (
    <header className="header">
      <button className="mobile-menu" onClick={onMenu}>
        <Menu />
      </button>

      <div className="breadcrumb">
        Workspace <span>/</span> Dashboard
      </div>

      <div className="header-actions">
        <label className="search-box">
          <Search size={17} />
          <input placeholder="Search..." />
        </label>

        <button className="notification-button" aria-label="Notifications">
          <Bell size={19} />
        </button>

        <div className="profile-avatar">U</div>
      </div>
    </header>
  );
}