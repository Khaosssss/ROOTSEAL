import { Link, useLocation } from "react-router-dom";
import "tailwindcss"

function Navbar() {
  const location = useLocation();

  const links = [
    { path: "/", label: "Home" },
    { path: "/form", label: "Certificate Form" },
    { path: "/generator", label: "Merkle Generator" },
    { path: "/verifier", label: "Verifier" },
    { path: "/interact", label: "Contract" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-extrabold tracking-wide text-blue-400">
          RootSeal
        </h1>

        <div className="flex space-x-4">
          {links.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === path
                  ? "bg-blue-600 text-white shadow-md"
                  : "hover:bg-gray-700 hover:text-blue-300"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
