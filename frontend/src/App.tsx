import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import "./App.css";
import Login from "./Pages/users/Login";
import SignUp from "./Pages/users/NewUserForm";
import UserDash from "./Pages/users/UserDash";
import EditUserForm from "./Pages/users/EditUserForm";
import StoryGroupDash from "./Pages/storyGroups/StoryGroupDash";
import NewStoryGroup from "./Pages/storyGroups/NewStoryGroup";
import EditStoryGroup from "./Pages/storyGroups/EditStoryGroup";
import CharacterDash from "./Pages/characters/CharacterDash";
import EditCharacter from "./Pages/characters/EditCharacter";
import EditStory from "./Pages/stories/EditStory";
import NewStory from "./Pages/stories/NewStory";
import NewStoryPart from "./Pages/stories/NewStoryPart";
import EditStoryPart from "./Pages/stories/EditStoryPart";
import NewCharacter from "./Pages/characters/NewCharacter";
import Unauthorized from "./Pages/auth/Unauthorized";
import { UserProvider } from "./Pages/users/UserContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <div className="app-container">
        <UserProvider>
          <Header />
          <div className="content-container">
            <Routes>
              {/* Default Route to StoryGroupDash */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <StoryGroupDash />
                  </ProtectedRoute>
                }
              />

              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signUp" element={<SignUp />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Protected Routes */}
              <Route
                path="/dash"
                element={
                  <ProtectedRoute>
                    <UserDash />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dash/users/:userId/edit"
                element={
                  <ProtectedRoute>
                    <EditUserForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/stories"
                element={
                  <ProtectedRoute>
                    <StoryGroupDash />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/newStoryGroup"
                element={
                  <ProtectedRoute>
                    <NewStoryGroup />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-story-group/:storyGroupId"
                element={
                  <ProtectedRoute>
                    <EditStoryGroup />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/stories/new"
                element={
                  <ProtectedRoute>
                    <NewStory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-story/:storyId"
                element={
                  <ProtectedRoute>
                    <EditStory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/storyPart/new"
                element={
                  <ProtectedRoute>
                    <NewStoryPart />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-story-part/:storyPartId"
                element={
                  <ProtectedRoute>
                    <EditStoryPart />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/characters"
                element={
                  <ProtectedRoute>
                    <CharacterDash />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/characters/new"
                element={
                  <ProtectedRoute>
                    <NewCharacter />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/characters/:characterId/edit"
                element={
                  <ProtectedRoute>
                    <EditCharacter />
                  </ProtectedRoute>
                }
              />
              {/* Handle 404 */}
              <Route path="*" element={<Unauthorized />} />
            </Routes>
          </div>
          <Footer />
        </UserProvider>
      </div>
    </Router>
  );
}

export default App;
