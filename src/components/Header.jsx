import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

function Header() {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlHeader = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY > lastScrollY) {
        setShow(false);
      } else {
        setShow(true);
      }
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlHeader);
      return () => window.removeEventListener("scroll", controlHeader);
    }
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 w-full transition-transform duration-300 ease-in-out z-50 ${
        show ? "translate-y-0" : "-translate-y-full"
      } bg-white/70 backdrop-blur-md shadow-md`}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        <h1 className="text-xl font-bold text-orange-500 tracking-wide">Suitmedia</h1>

        <nav className="flex space-x-6 text-sm font-medium tracking-wide">
          {["Work", "About", "Ideas", "Careers", "Contact"].map((item) => (
            <NavLink
              key={item}
              to={`/${item.toLowerCase()}`}
              className={({ isActive }) =>
                isActive
                  ? "text-orange-500 relative after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-orange-500 after:rounded-full"
                  : "text-gray-800 hover:text-orange-500 transition-colors relative after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-orange-500 after:rounded-full hover:after:w-full after:transition-all after:duration-300"
              }
            >
              {item}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
