import { ADMIN_DASHBOARD, HOME } from "../../constants/routes";
import logo from "../../images/logo-full.png";
import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import UserAvatar from "../../views/account/components/UserAvatar";

const AdminNavigation = () => {
  const { isAuthenticating, profile } = useSelector((state) => ({
    isAuthenticating: state.app.isAuthenticating,
    profile: state.profile,
  }));
  const navigate = useNavigate();
  return (
    <nav className="navigation navigation-admin">
      <div
        className="logo"
        style={{ display: "flex", alignItems: "center", flexDirection: "row" }}
      >
        {/* <span> */}
        <Link to={HOME}>
          <img onClick={() => navigate(HOME)} alt="Logo" src={logo} />
        </Link>
        <Link
          style={{ top: "35%", position: "relative", whiteSpace: "nowrap" }}
          to={ADMIN_DASHBOARD}
        >
          <h3 onClick={() => navigate(ADMIN_DASHBOARD)}>Admin</h3>
        </Link>
        {/* </span> */}
      </div>
      <ul className="navigation-menu">
        <li className="navigation-menu-item">
          <UserAvatar isAuthenticating={isAuthenticating} profile={profile} />
        </li>
      </ul>
    </nav>
  );
};

export default AdminNavigation;
