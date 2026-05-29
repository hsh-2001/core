import { Link } from "react-router-dom";

function MainHeader() {
  return (
    <div className="w-full sticky top-0 z-50">
      <nav className="w-full h-16 bg-gray-800 text-white flex items-center justify-center">
        <Link to="/admin" className="px-4 py-2">
          Admin
        </Link>
        <Link to="/admin/geography" className="px-4 py-2">
          Geography
        </Link>
      </nav>
    </div>
  );
}

export default MainHeader;
