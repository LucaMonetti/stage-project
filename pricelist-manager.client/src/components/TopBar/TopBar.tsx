import { Link, useNavigate } from "react-router";
import { useAuth } from "../Authentication/AuthenticationProvider";
import MenuLink from "./MenuLink";

import { useState, useRef, useEffect } from "react";
import ActionButton from "../Buttons/ActionButton";
import { FaUser } from "react-icons/fa6";

function TopBar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDrop, setShowDrop] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDrop(false);
      }
    };

    if (showDrop) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDrop]);

  return (
    <header className="sticky top-0 left-0 border-b-2 border-gray-800 bg-gray-900 z-50">
      <div className="max-w-8xl px-8 mx-auto flex justify-between items-center h-16">
        <nav>
          <ul className="flex gap-3">
            <MenuLink url="/" title="Home" />
            <MenuLink url="/dashboard" title="Dashboard" />
          </ul>
        </nav>

        {user && (
          <img
            src={user.company.logoUri}
            alt={`Logo dell'azienda ${user.company.name}`}
            className="max-h-5"
            loading="eager"
          />
        )}

        {isAuthenticated ? (
          <div className="flex gap-4 items-center">
            <p>
              Ciao,{" "}
              <Link
                to={`/dashboard/users/${user?.id}`}
                className="text-blue-400 relative after:absolute after:bg-blue-400 after:w-0 after:h-0.5 after:-bottom-1 after:left-0 hover:after:w-full after:transition-all cursor-pointer "
              >
                {user?.username}
              </Link>
            </p>
            <div className="relative group" ref={dropdownRef}>
              <span
                className="block bg-gray-400 border-2 border-gray-300 w-9 aspect-square rounded-full"
                onClick={() => {
                  console.log("Pressed!");
                  setShowDrop(!showDrop);
                }}
              ></span>

              <div
                className={`absolute z-50 p-6 rounded bg-gray-900 border-2 border-gray-700 ${
                  showDrop
                    ? "top-16 right-0"
                    : "top-0 right-0 opacity-0 pointer-events-none"
                }`}
              >
                <ActionButton
                  callback={handleLogout}
                  Icon={FaUser}
                  color="red"
                  text="Logout"
                  className="flex items-center gap-2"
                />
              </div>
            </div>
          </div>
        ) : (
          <ul className="flex gap-3">
            <MenuLink url="/auth/login" title="Login" />
          </ul>
        )}
      </div>
    </header>
  );
}

export default TopBar;
