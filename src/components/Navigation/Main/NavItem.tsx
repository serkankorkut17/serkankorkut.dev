import { useState, useRef } from "react";
import Link from "next/link";
import { HiChevronDown } from "react-icons/hi2";

interface NavItemProps {
  link: {
    name: string;
    url: string;
    subLinks?: { name: string; url: string }[];
  };
}

const NavItem = ({ link }: NavItemProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);


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
        <>
          <div className="cursor-pointer hover:text-orange-500 transition-colors duration-300 flex items-center space-x-1">
            <span>{link.name}</span>
            <HiChevronDown 
              className={`w-4 h-4 transform transition-transform duration-200 ${
                dropdownOpen ? 'rotate-180' : ''
              }`} 
            />
          </div>
          {dropdownOpen && (
            <ul className="absolute left-0 mt-2 w-40 bg-white text-black shadow-lg rounded-lg z-[9999] border border-gray-200">
              {link.subLinks.map((subLink) => (
                <li key={subLink.name}>
                  <Link
                    href={subLink.url}
                    className="block px-4 py-2 hover:bg-orange-50 hover:text-orange-500 rounded-lg transition-colors duration-300"
                  >
                    {subLink.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <Link href={link.url}>
          <span className="hover:text-orange-500 transition-colors duration-300 cursor-pointer">
            {link.name}
          </span>
        </Link>
      )}
    </li>
  );
};

export default NavItem;
