import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PanelsTopLeft,
  Database,
  ChartNoAxesCombined,
  BriefcaseBusiness,
  Settings,
  X
} from "lucide-react";

export default function Sidebar({ close }) {
  const links = [
    { name: "Overview", path: "/", icon: LayoutDashboard },
    { name: "Dashboards", path: "/dashboards", icon: PanelsTopLeft },
    { name: "Datasets", path: "/datasets", icon: Database },
    { name: "Metrics", path: "/metrics", icon: ChartNoAxesCombined },
    { name: "Workspaces", path: "/workspaces", icon: BriefcaseBusiness },
    { name: "Settings", path: "/settings", icon: Settings }
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">D</div>
        <span>DataBoard</span>
        <button className="mobile-close" onClick={close}>
          <X />
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
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
            onClick={close}
          >
            <Icon size={18} />
            <span>{name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="profile-avatar">U</div>
        <div>
          <strong>Your Account</strong>
          <small>Workspace member</small>
        </div>
      </div>
    </aside>
  );
}