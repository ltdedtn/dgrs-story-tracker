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

function App() {
  return (
    <Router>
      <div className="app-container">
        <UserProvider>
          <Header />
          <div className="content-container">
            <Routes>
              <Route path="/dash" element={<UserDash />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signUp" element={<SignUp />} />
              <Route
                path="/dash/users/:userId/edit"
                element={<EditUserForm />}
              />
              <Route path="/stories" element={<StoryGroupDash />} />
              <Route path="/newStoryGroup" element={<NewStoryGroup />} />
              <Route
                path="/edit-story-group/:storyGroupId"
                element={<EditStoryGroup />}
              />
              <Route path="/stories/new" element={<NewStory />} />
              <Route path="/edit-story/:storyId" element={<EditStory />} />
              <Route path="/storyPart/new" element={<NewStoryPart />} />
              <Route
                path="/edit-story-part/:storyPartId"
                element={<EditStoryPart />}
              />
              <Route path="/characters" element={<CharacterDash />} />
              <Route path="/characters/new" element={<NewCharacter />} />
              <Route
                path="/characters/:characterId/edit"
                element={<EditCharacter />}
              />
              <Route path="/unauthorized" element={<Unauthorized />} />
              {/* Add a route to handle 404 - Not Found */}
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
