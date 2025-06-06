"use client";
import React from "react";

function MainComponent() {
  const { data: user, loading: userLoading } = useUser();
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preferences, setPreferences] = useState({
    difficultyPreference: "beginner",
    preferredDurationMinutes: 30,
    preferredCategories: [],
    equipmentAvailable: [],
    healthConditions: [],
    workoutFrequency: 3,
    preferredMuscleGroups: [],
    notificationPreferences: {
      reminders: true,
      progressUpdates: true,
    },
  });

  const fetchExercises = useCallback(async () => {
    try {
      const response = await fetch("/api/exercises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          difficulty: preferences.difficultyPreference,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch exercises");
      }

      const data = await response.json();
      setExercises(data.exercises || []);
    } catch (err) {
      setError("Failed to load exercises");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [preferences.difficultyPreference]);

  const savePreferences = async () => {
    try {
      const response = await fetch("/api/coach-preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error("Failed to save preferences");
      }
    } catch (err) {
      setError("Failed to save preferences");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-t-[#357AFF] border-gray-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Exercise Library */}
          <div className="md:w-1/2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Exercise Library
              </h2>

              {isLoading ? (
                <div className="grid grid-cols-2 gap-4">
                  {[...Array.from({ length: 6 })].map((_, i) => (
                    <div
                      key={i}
                      className="bg-gray-100 rounded-lg h-48 animate-pulse"
                    ></div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-red-500 text-center py-4">{error}</div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {exercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      onClick={() => setSelectedExercise(exercise)}
                      className="bg-white border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <div className="aspect-video bg-gray-100 rounded-lg mb-3">
                        <></>
                      </div>
                      <h3 className="font-semibold text-gray-800">
                        {exercise.name}
                      </h3>
                      <div className="flex items-center mt-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            exercise.difficulty === "beginner"
                              ? "bg-green-100 text-green-700"
                              : exercise.difficulty === "intermediate"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {exercise.difficulty}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Active Exercise and Settings */}
          <div className="md:w-1/2">
            {/* Active Exercise View */}
            {selectedExercise && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  {selectedExercise.name}
                </h2>
                <div className="aspect-video bg-gray-100 rounded-lg mb-6">
                  <></>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Instructions
                    </h3>
                    <p className="text-gray-600">
                      {selectedExercise.instructions}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Posture Guidelines
                    </h3>
                    <p className="text-gray-600">
                      {selectedExercise.postureGuidelines}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Coach Settings */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Coach Settings
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  savePreferences();
                }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    name="difficultyPreference"
                    value={preferences.difficultyPreference}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        difficultyPreference: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Workout Duration (minutes)
                  </label>
                  <input
                    type="number"
                    name="preferredDurationMinutes"
                    value={preferences.preferredDurationMinutes}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        preferredDurationMinutes: parseInt(e.target.value),
                      })
                    }
                    className="w-full p-2 border rounded-lg"
                    min="5"
                    max="120"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Workout Frequency (per week)
                  </label>
                  <input
                    type="number"
                    name="workoutFrequency"
                    value={preferences.workoutFrequency}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        workoutFrequency: parseInt(e.target.value),
                      })
                    }
                    className="w-full p-2 border rounded-lg"
                    min="1"
                    max="7"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Health Conditions
                  </label>
                  <input
                    type="text"
                    name="healthConditions"
                    placeholder="Enter any health conditions"
                    className="w-full p-2 border rounded-lg"
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        healthConditions: e.target.value.split(","),
                      })
                    }
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#357AFF] text-white py-2 rounded-lg hover:bg-[#2563EB] transition-colors"
                >
                  Save Preferences
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;