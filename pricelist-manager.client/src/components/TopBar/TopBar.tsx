import MenuLink from "./MenuLink";

function TopBar() {
  return (
    <header className="px-8 py-4 sticky top-0 left-0 border-b-2 border-gray-800 bg-gray-900">
      <div className="max-w-8xl mx-auto flex justify-between items-center">
        <nav>
          <ul className="flex gap-3">
            <MenuLink url="/" title="Home" />
            <MenuLink url="/admin-dashboard" title="Admin" />
          </ul>
        </nav>

        <div className="flex gap-4 items-center">
          <p>
            Ciao,{" "}
            <span className="text-blue-400 relative after:absolute after:bg-blue-400 after:w-0 after:h-0.5 after:-bottom-1 after:left-0 hover:after:w-full after:transition-all cursor-pointer ">
              Luca Monetti
            </span>
          </p>
          <span className="block bg-gray-400 border-2 border-gray-300 w-9 aspect-square rounded-full"></span>
        </div>
      </div>
    </header>
  );
}

export default TopBar;
