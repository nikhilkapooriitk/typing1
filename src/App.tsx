import { useState, forwardRef, useRef, ForwardedRef } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TimerButton from "./components/TimerButton";
import TypingTestDynamic from "./components/TypingTestDynamic";
import Sidebar from "./components/SideBar";
import Header from "./components/Header";
import GameWindow from "./components/GameWindow";
import "./App.css";
import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";
import Footer from "./components/Footer";

function App() {
  const [isTimerRunning, setIsTimerRunning] = useState(0);
  const startAndStopTimer = () => {
    if (isTimerRunning === 0) {
      setIsTimerRunning(1);
    } else {
      setIsTimerRunning(0);
    }
  };

  return (
    <MantineProvider>
      <Router>
        <div className="app">
          <Sidebar />
          <div className="main-content">
            <Header />
            <Routes>
              <Route path="/" element={<TypingTestDynamic />} />
              <Route path="/learning" element={<div>Learning Section</div>} />
              <Route path="/games" element={<GameWindow />} />
              <Route path="/live-test" element={<div>Live Test Section</div>} />
              <Route
                path="/tricky-keys"
                element={<div>Tricky Keys Section</div>}
              />
            </Routes>
          </div>
        </div>
        <Footer />
      </Router>
    </MantineProvider>
  );
}

export default App;
