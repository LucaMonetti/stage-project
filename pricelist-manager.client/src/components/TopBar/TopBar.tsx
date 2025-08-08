import { Link, useNavigate } from "react-router";
import { useAuth } from "../Authentication/AuthenticationProvider";
import MenuLink from "./MenuLink";

import { useState, useRef, useEffect } from "react";
import ActionButton from "../Buttons/ActionButton";
import { FaPencil, FaUser } from "react-icons/fa6";

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
            <MenuLink url="/dashboard" title="Dashboard" />
          </ul>
        </nav>

        {user && (
          <img
            src="/images/PLA-Logo.png"
            alt={`Logo dell'azienda ${user.company.name}`}
            className="max-h-5"
            loading="eager"
          />
        )}

        {isAuthenticated ? (
          <div className="flex gap-4 items-center">
            <div className="relative group" ref={dropdownRef}>
              <p>
                Benvenuto,{" "}
                <span
                  onClick={() => {
                    setShowDrop(!showDrop);
                  }}
                  className="text-blue-400 relative after:absolute after:bg-blue-400 after:w-0 after:h-0.5 after:-bottom-1 after:left-0 hover:after:w-full after:transition-all cursor-pointer "
                >
                  {user?.username}
                </span>
              </p>
              <div
                className={`absolute z-50 p-6 rounded bg-gray-900 border-2 border-gray-700 flex flex-col gap-4 ${
                  showDrop
                    ? "top-16 right-0"
                    : "top-0 right-0 opacity-0 pointer-events-none"
                }`}
              >
                <ActionButton
                  callback={() =>
                    navigate(`/dashboard/edit/users/${user?.id}/password`)
                  }
                  Icon={FaPencil}
                  color="blue"
                  text="Cambio Password"
                />
                <ActionButton
                  callback={handleLogout}
                  Icon={FaUser}
                  color="red"
                  text="Logout"
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
