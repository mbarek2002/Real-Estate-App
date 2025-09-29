import React from "react";
import { NavLink } from "react-router-dom";
import { MdMap } from "react-icons/md";

const Navbar = ({ containerStyles }) => {
  const navItems = [
    {
      to: "/explore",
      label: "Explore Properties",
      icon: MdMap,
      color: "from-pink-500 to-pink-600",
    },
  ];

  return (
    <div>
      <nav className={`${containerStyles} items-center`}>
        {navItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <NavLink
              key={index}
              to={item.to}
              className={({ isActive }) =>
                `inline-flex items-center justify-center gap-x-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 hover:scale-105 group ${
                  isActive
                    ? `text-white bg-gradient-to-r ${
                        item.color
                      } shadow-lg shadow-${item.color.split("-")[1]}-500/25`
                    : "text-gray-700 hover:text-primary-600 hover:bg-primary-50/80"
                }`
              }
            >
              <div
                className={`w-5 h-5 flex items-center justify-center ${
                  "isActive"
                    ? "text-white"
                    : "text-gray-600 group-hover:text-primary-600"
                }`}
              >
                <IconComponent className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default Navbar;
