import { useState, useRef } from "react";
import Link from "next/link";

const NavItem = ({ link }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    // Herhangi bir timeout varsa temizle
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    // 300ms gecikme ile kapat
    timeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 300);
  };

  return (
    <li
      className="relative z-50"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {link.subLinks ? (
        <div className="cursor-pointer hover:text-orange-500 transition-colors duration-300">
          {link.name}
        </div>
      ) : (
        <Link href={link.url}>
          <span className="hover:text-orange-500 transition-colors duration-300">
            {link.name}
          </span>
        </Link>
      )}

      {link.subLinks && dropdownOpen && (
        <ul className="absolute left-0 mt-2 w-40 bg-white text-black shadow-md rounded-lg">
          {link.subLinks.map((subLink) => (
            <li key={subLink.name}>
              <Link
                href={subLink.url}
                className="block px-4 py-2 hover:bg-gray-200 rounded-lg"
              >
                {subLink.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default NavItem;
