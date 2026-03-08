import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="bg-linear-to-r from-blue-600 to-blue-800 shadow-lg">
      <div className="bg-blue-500 px-6 py-4 flex items-center justify-between gap-12 ">
        {/* Logo/Brand */}
        <Link
          to="/dashboard"
          className="text-white text-2xl font-bold hover:text-blue-100 transition shrink-0"
        >
          💰 BudgetHub
        </Link>

        {/* Navigation Links - Center */}
        <div className="flex space-x-12 flex-1 justify-center">
          {isAuthenticated && (
            <>
              <Link
                to="/dashboard"
                className="text-white hover:text-blue-100 font-medium transition text-lg"
              >
                Dashboard
              </Link>
              <Link
                to="/budget"
                className="text-white hover:text-blue-100 font-medium transition text-lg"
              >
                Budgets
              </Link>
              <Link
                to="/expense"
                className="text-white hover:text-blue-100 font-medium transition text-lg"
              >
                Expenses
              </Link>
              <Link
                to="/friends"
                className="text-white hover:text-blue-100 font-medium transition text-lg relative"
              >
                Friends
              </Link>
            </>
          )}
        </div>

        {/* Auth Links - Right */}
        <div className="flex space-x-4 shrink-0">
          {!isAuthenticated && (
            <>
              <Link
                to="/login"
                className="text-white hover:text-blue-100 font-medium transition px-4 py-2 rounded-md"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-blue-600 hover:bg-blue-50 font-medium transition px-4 py-2 rounded-md"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
