import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PanelsTopLeft,
  Database,
  ChartNoAxesCombined,
  BriefcaseBusiness,
  Settings,
  Search,
  Bell,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { authService } from "../services/api";

export function Sidebar({ close }) {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const userInitials = user?.name
    ? user.name.slice(0, 2).toUpperCase()
    : user?.email
    ? user.email.slice(0, 1).toUpperCase()
    : "U";

  const links = [
    { name: "Overview", path: "/", icon: LayoutDashboard },
    { name: "Dashboards", path: "/dashboards", icon: PanelsTopLeft },
    { name: "Datasets", path: "/datasets", icon: Database },
    { name: "Metrics", path: "/metrics", icon: ChartNoAxesCombined },
    { name: "Workspaces", path: "/workspaces", icon: BriefcaseBusiness },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  function handleLogout() {
    authService.logout();
    navigate("/login");
  }

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">D</div>
        <span>DataBoard</span>
        <button className="mobile-close" onClick={close} aria-label="Close sidebar">
          <X size={18} />
        </button>
      </div>

      <div className="workspace">
        <div className="workspace-avatar">W</div>
        <div>
          <strong>My Workspace</strong>
          <small>Personal workspace</small>
        </div>
      </div>

      <p className="nav-heading">WORKSPACE</p>

      <nav>
        {links.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={close}
          >
            <Icon size={18} />
            <span>{name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="profile-avatar">{userInitials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <strong style={{ display: "block", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
            {user?.name || "Your Account"}
          </strong>
          <small style={{ display: "block", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
            {user?.email || "Workspace member"}
          </small>
        </div>
        <button
          onClick={handleLogout}
          title="Sign out"
          aria-label="Sign out"
          style={{
            background: "transparent",
            border: "none",
            color: "#94a3b8",
            cursor: "pointer",
            padding: "4px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}

export function Header({ onMenu }) {
  const user = authService.getCurrentUser();
  const userInitials = user?.name
    ? user.name.slice(0, 2).toUpperCase()
    : user?.email
    ? user.email.slice(0, 1).toUpperCase()
    : "U";

  return (
    <header className="header">
      <button className="mobile-menu" onClick={onMenu} aria-label="Open menu">
        <Menu size={20} />
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
        <div className="profile-avatar" title={user?.email || "User profile"}>
          {userInitials}
        </div>
      </div>
    </header>
  );
}

export function PageHeading({ title, description, action }) {
  return (
    <div className="page-heading">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Icon size={27} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
