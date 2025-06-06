"use client";
import React from "react";

function MainComponent() {
  const { data: user, loading } = useUser();
  const [activeTab, setActiveTab] = useState("home");

  const mainFeatures = [
    {
      title: "Virtual Try-On",
      icon: "fa-tshirt",
      description: "Try on outfits virtually",
      path: "/virtual-try-on",
      color: "#FF6B6B",
    },
    {
      title: "Skin Analysis",
      icon: "fa-magnifying-glass",
      description: "Get detailed skin insights",
      path: "/skin-analysis",
      color: "#4ECDC4",
    },
    {
      title: "Fitness Coach",
      icon: "fa-dumbbell",
      description: "Personal workout guidance",
      path: "/personal-fitness-coach",
      color: "#45B7D1",
    },
    {
      title: "Virtual Assistant",
      icon: "fa-robot",
      description: "Get help and recommendations",
      path: "/virtual-assistant",
      color: "#96CEB4",
    },
  ];

  const quickActions = [
    {
      title: "Analyze Fit",
      icon: "fa-ruler",
      path: "/analyze-fit",
      color: "#D4A5A5",
    },
    {
      title: "Profile",
      icon: "fa-user",
      path: "/profile",
      color: "#9B786F",
    },
  ];

  return (
    <div
      className="flex flex-col bg-[#1A1A1A] text-white overflow-hidden"
      style={{
        width: "392.7mm",
        height: "698.1mm",
        maxWidth: "100vw",
        maxHeight: "100vh",
      }}
    >
      {/* Top Bar */}
      <div className="px-6 py-4 bg-black bg-opacity-40 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {loading
                ? "Welcome"
                : user
                ? `Hello, ${user.name || "there"}`
                : "Welcome"}
            </h1>
            <p className="text-gray-400 text-sm">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          {user && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => (window.location.href = "/profile")}
                className="w-10 h-10 rounded-full bg-[#357AFF] flex items-center justify-center"
              >
                <i className="fas fa-user"></i>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-6 py-4">
        {/* Main Features Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Main Features</h2>
          <div className="grid grid-cols-2 gap-4">
            {mainFeatures.map((feature, index) => (
              <a
                key={index}
                href={feature.path}
                className="relative group overflow-hidden rounded-2xl p-4 transition-all duration-300"
                style={{ backgroundColor: `${feature.color}15` }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(45deg, ${feature.color}30, transparent)`,
                  }}
                />
                <div className="relative z-10">
                  <i
                    className={`fas ${feature.icon} text-2xl mb-3`}
                    style={{ color: feature.color }}
                  ></i>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex gap-4">
            {quickActions.map((action, index) => (
              <a
                key={index}
                href={action.path}
                className="flex-1 group rounded-xl p-4 transition-all duration-300"
                style={{ backgroundColor: `${action.color}15` }}
              >
                <i
                  className={`fas ${action.icon} text-xl mb-2`}
                  style={{ color: action.color }}
                ></i>
                <h3 className="font-medium">{action.title}</h3>
              </a>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {user ? (
              <>
                <div className="bg-white bg-opacity-5 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#FF6B6B] bg-opacity-20 flex items-center justify-center">
                      <i className="fas fa-tshirt text-[#FF6B6B]"></i>
                    </div>
                    <div>
                      <h3 className="font-medium">Last Try-On</h3>
                      <p className="text-sm text-gray-400">2 hours ago</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white bg-opacity-5 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#4ECDC4] bg-opacity-20 flex items-center justify-center">
                      <i className="fas fa-magnifying-glass text-[#4ECDC4]"></i>
                    </div>
                    <div>
                      <h3 className="font-medium">Skin Analysis</h3>
                      <p className="text-sm text-gray-400">1 day ago</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-400">Sign in to see your activity</p>
                <div className="mt-4 space-x-4">
                  <a
                    href="/account/signin"
                    className="text-[#357AFF] hover:underline"
                  >
                    Sign In
                  </a>
                  <a
                    href="/account/signup"
                    className="text-[#357AFF] hover:underline"
                  >
                    Sign Up
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-black bg-opacity-40 backdrop-blur-md px-6 py-4">
        <div className="flex justify-around items-center">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center ${
              activeTab === "home" ? "text-[#357AFF]" : "text-gray-400"
            }`}
          >
            <i className="fas fa-home text-xl mb-1"></i>
            <span className="text-xs">Home</span>
          </button>
          <a
            href="/virtual-try-on"
            className="flex flex-col items-center text-gray-400 hover:text-[#357AFF]"
          >
            <i className="fas fa-tshirt text-xl mb-1"></i>
            <span className="text-xs">Try-On</span>
          </a>
          <a
            href="/skin-analysis"
            className="flex flex-col items-center text-gray-400 hover:text-[#357AFF]"
          >
            <i className="fas fa-magnifying-glass text-xl mb-1"></i>
            <span className="text-xs">Analysis</span>
          </a>
          <a
            href="/personal-fitness-coach"
            className="flex flex-col items-center text-gray-400 hover:text-[#357AFF]"
          >
            <i className="fas fa-dumbbell text-xl mb-1"></i>
            <span className="text-xs">Fitness</span>
          </a>
          <a
            href="/profile"
            className="flex flex-col items-center text-gray-400 hover:text-[#357AFF]"
          >
            <i className="fas fa-user text-xl mb-1"></i>
            <span className="text-xs">Profile</span>
          </a>
        </div>
      </nav>

      {/* Mirror Frame Overlay */}
      <div className="pointer-events-none absolute inset-0 border border-white border-opacity-5 rounded-lg"></div>
    </div>
  );
}

export default MainComponent;