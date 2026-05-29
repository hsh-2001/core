import { NavLink } from "react-router-dom";

function TemplesSubMenu() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `inline-flex h-9 items-center rounded-md px-3 text-sm font-semibold transition ${
      isActive ? "bg-indigo-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
    }`;

  return (
    <nav className="flex flex-wrap gap-2 border border-gray-200 bg-gray-100 p-2">
      <NavLink to="/admin/temples" end className={linkClass}>
        Temple List
      </NavLink>
      <NavLink to="/admin/temples/create" className={linkClass}>
        Create Temple
      </NavLink>
    </nav>
  );
}

export default TemplesSubMenu;
