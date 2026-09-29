import { NavLink } from "react-router-dom";

const Navbar = () => {
  const getLinkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-blue-100 text-blue-700"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo / App Name */}
        <NavLink
          to="/dashboard"
          className="text-xl font-bold text-gray-800"
        >
          Maintenance Tracker
        </NavLink>

        {/* Navigation */}
        <div className="flex items-center gap-2">
          <NavLink to="/dashboard" className={getLinkClass}>
            Dashboard
          </NavLink>

          <NavLink to="/requests" className={getLinkClass}>
            Requests
          </NavLink>

          <NavLink
            to="/requests/new"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            + New Request
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;