import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logout } from "../redux/features/auth/authSlice";
import { getUserInfo } from "../redux/authUlits";
import { useGetUserShopsQuery } from "../redux/features/auth/authApi";
import toast from "react-hot-toast";

const Dashboard: React.FC = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = getUserInfo();
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAuthLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isAuthLoading && !user && !token) {
      navigate("/signin");
    }
  }, [isAuthLoading, user, token, navigate]);

  const {
    data: shopsData,
    isLoading: shopsLoading,
    error: shopsError,
  } = useGetUserShopsQuery(user?.id || "", {
    skip: !user?.id,
  });

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
    navigate("/signin");
    setShowLogoutConfirm(false);
    setShowProfileMenu(false);
  };

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Loading Header Skeleton */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse hidden md:block"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Loading Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <h2 className="text-lg font-medium text-gray-600">
                  Loading Dashboard...
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                  Please wait while we load your data
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-600">
            Please sign in to access the dashboard
          </h2>
          <button
            onClick={() => navigate("/signin")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>

            {/* Profile Section */}
            <div className="relative">
              <button
                onClick={handleProfileClick}
                className="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="hidden md:block text-gray-700 font-medium">
                  {user.username}
                </span>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    showProfileMenu ? "rotate-180" : ""
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  <div className="p-4">
                    <div className="border-b pb-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Your Shops
                      </h3>
                    </div>

                    {/* Shop Names List */}
                    <div className="space-y-2 mb-4">
                      {shopsLoading ? (
                        <div className="text-gray-500 text-sm">
                          Loading shops...
                        </div>
                      ) : shopsError ? (
                        <div className="text-red-500 text-sm">
                          Error loading shops
                        </div>
                      ) : shopsData?.data?.shopNames &&
                        shopsData.data.shopNames.length > 0 ? (
                        shopsData.data.shopNames.map((shop: any) => (
                          <div
                            key={shop.id}
                            className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md"
                          >
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-700">
                              {shop.name}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-500 text-sm">
                          No shops registered yet
                        </div>
                      )}
                    </div>

                    {/* Logout Button */}
                    <button
                      onClick={() => setShowLogoutConfirm(true)}
                      className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-600 mb-4">
                Welcome to your Dashboard, {user.username}!
              </h2>
              <p className="text-gray-500 mb-6">
                This is your personal dashboard where you can manage your shops
                and profile.
              </p>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Quick Stats
                </h3>
                <p className="text-gray-600">
                  Total Shops:{" "}
                  <span className="font-semibold">
                    {shopsData?.data?.shopNames?.length || 0}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
                Confirm Logout
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to logout? You will need to sign in
                  again to access your dashboard.
                </p>
              </div>
              <div className="items-center px-4 py-3 space-x-2 flex justify-center">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
