import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import "./App.css";
import Login from "./Pages/users/Login";
import SignUp from "./Pages/users/NewUserForm";
import UserDash from "./Pages/users/UserDash";
import EditUserForm from "./Pages/users/EditUserForm";
import StoryDash from "./Pages/stories/StoryDash";
import CharacterDash from "./Pages/characters/CharacterDash";
import EditCharacter from "./Pages/characters/EditCharacter";
import EditStory from "./Pages/stories/EditStory";
import NewStory from "./Pages/stories/NewStory";
import NewStoryPart from "./Pages/stories/NewStoryPart";
import NewCharacter from "./Pages/characters/NewCharacter";
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
              <Route path="/stories" element={<StoryDash />} />
              <Route path="/stories/new" element={<NewStory />} />
              <Route path="/stories/:storyId/edit" element={<EditStory />} />
              <Route path="/storyPart/new" element={<NewStoryPart />} />
              <Route path="/characters" element={<CharacterDash />} />
              <Route path="/characters/new" element={<NewCharacter />} />
              <Route
                path="/characters/:characterId/edit"
                element={<EditCharacter />}
              />
            </Routes>
          </div>
          <Footer />
        </UserProvider>
      </div>
    </Router>
  );
}

export default App;
