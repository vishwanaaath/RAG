import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import PdfChatLayout from "./components/PdfChatLayout";
import PostLoginCheck from "./components/PostLoginCheck";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/chat" element={<PdfChatLayout />} />
      <Route path="/post-login-check" element={<PostLoginCheck />} />
    </Routes>
  );
}

export default App;
