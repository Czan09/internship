import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-white shadow px-6 py-3">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <Link
            to="/dashboard"
            className="text-gray-700 hover:text-blue-500 font-medium"
          >
            Dashboard
          </Link>
          {isAuthenticated && (
            <>
              <Link
                to="/budget"
                className="text-gray-700 hover:text-blue-500 font-medium"
              >
                Budgets
              </Link>
              <Link
                to="/expense"
                className="text-gray-700 hover:text-blue-500 font-medium"
              >
                Expenses
              </Link>
            </>
          )}
        </div>

        <div className="flex space-x-4">
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="text-red-500 hover:text-red-700 font-medium"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-500 font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-gray-700 hover:text-blue-500 font-medium"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
