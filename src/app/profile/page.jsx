"use client";
import React from "react";

function MainComponent() {
  const { data: user, loading, refetch } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    skinType: "normal",
    preferences: {
      notifications: true,
      darkMode: false,
      emailUpdates: true,
    },
  });

  // Fetch user profile and preferences
  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/user-profile", {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }
      const data = await response.json();
      if (data.profile) {
        setFormData((prev) => ({
          ...prev,
          ...data.profile,
          name: user?.name || "",
          email: user?.email || "",
        }));
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile");
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const activityHistory = [
    { type: "Skin Analysis", date: "2025-03-20", status: "Completed" },
    { type: "Virtual Try-On", date: "2025-03-19", status: "Completed" },
    { type: "Product Match", date: "2025-03-18", status: "Completed" },
  ];

  const savedItems = [
    { name: "Foundation Match Results", date: "2025-03-20" },
    { name: "Skincare Routine", date: "2025-03-19" },
    { name: "Makeup Look", date: "2025-03-18" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch("/api/update-preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          preferences: {
            skinType: formData.skinType,
            notifications: formData.preferences.notifications,
            darkMode: formData.preferences.darkMode,
            emailUpdates: formData.preferences.emailUpdates,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update preferences");
      }

      setIsEditing(false);
      await fetchUserProfile(); // Refresh profile data
    } catch (err) {
      setError("Failed to update profile");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-xl text-gray-600 mb-4">
          Please sign in to view your profile
        </div>
        <a
          href="/account/signin"
          className="bg-[#357AFF] text-white px-6 py-2 rounded-lg"
        >
          Sign In
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-lg mx-auto p-4">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-[#357AFF]"
            >
              <i className={`fas ${isEditing ? "fa-times" : "fa-edit"}`}></i>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  disabled={!isEditing}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  disabled={!isEditing}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skin Type
                </label>
                <select
                  name="skinType"
                  disabled={!isEditing}
                  value={formData.skinType}
                  onChange={(e) =>
                    setFormData({ ...formData, skinType: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg bg-gray-50"
                >
                  <option value="normal">Normal</option>
                  <option value="dry">Dry</option>
                  <option value="oily">Oily</option>
                  <option value="combination">Combination</option>
                </select>
              </div>
              {isEditing && (
                <button
                  type="submit"
                  className="w-full bg-[#357AFF] text-white py-2 rounded-lg"
                >
                  Save Changes
                </button>
              )}
              {error && <div className="text-red-500 text-sm">{error}</div>}
            </div>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Activity History
          </h2>
          <div className="space-y-3">
            {activityHistory.map((activity, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-800">
                    {activity.type}
                  </div>
                  <div className="text-sm text-gray-600">{activity.date}</div>
                </div>
                <span className="text-green-500 text-sm">
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Saved Items
          </h2>
          <div className="space-y-3">
            {savedItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="font-medium text-gray-800">{item.name}</div>
                <div className="text-sm text-gray-600">{item.date}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Preferences
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Push Notifications</span>
              <button
                onClick={() =>
                  setFormData({
                    ...formData,
                    preferences: {
                      ...formData.preferences,
                      notifications: !formData.preferences.notifications,
                    },
                  })
                }
                className={`w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                  formData.preferences.notifications
                    ? "bg-[#357AFF]"
                    : "bg-gray-200"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${
                    formData.preferences.notifications
                      ? "translate-x-7"
                      : "translate-x-1"
                  }`}
                ></div>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Email Updates</span>
              <button
                onClick={() =>
                  setFormData({
                    ...formData,
                    preferences: {
                      ...formData.preferences,
                      emailUpdates: !formData.preferences.emailUpdates,
                    },
                  })
                }
                className={`w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                  formData.preferences.emailUpdates
                    ? "bg-[#357AFF]"
                    : "bg-gray-200"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${
                    formData.preferences.emailUpdates
                      ? "translate-x-7"
                      : "translate-x-1"
                  }`}
                ></div>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Account</h2>
          <div className="space-y-4">
            <button className="w-full text-left text-gray-700 flex items-center">
              <i className="fas fa-shield-alt mr-2"></i>
              Privacy Settings
            </button>
            <button className="w-full text-left text-gray-700 flex items-center">
              <i className="fas fa-question-circle mr-2"></i>
              Help & Support
            </button>
            <button className="w-full text-left text-gray-700 flex items-center">
              <i className="fas fa-info-circle mr-2"></i>
              About App
            </button>
            <a
              href="/account/logout"
              className="w-full text-left text-red-500 flex items-center"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>
              Sign Out
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;