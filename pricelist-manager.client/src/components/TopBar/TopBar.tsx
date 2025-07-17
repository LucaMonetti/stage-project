import { useNavigate } from "react-router";
import { useAuth } from "../Authentication/AuthenticationProvider";
import MenuLink from "./MenuLink";

function TopBar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

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
              <span
                onClick={handleLogout}
                className="text-blue-400 relative after:absolute after:bg-blue-400 after:w-0 after:h-0.5 after:-bottom-1 after:left-0 hover:after:w-full after:transition-all cursor-pointer "
              >
                {user?.username}
              </span>
            </p>
            <span className="block bg-gray-400 border-2 border-gray-300 w-9 aspect-square rounded-full"></span>
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
