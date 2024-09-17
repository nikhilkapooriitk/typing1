import "./SideBar.css";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="project-info">
        <img
          src="/src/assets/logo.jpg"
          alt="Website Icon"
          className="project-icon"
        />
        <h1>Typing Hero</h1>
      </div>
      <hr />
      <nav>
        <ul className="list-group">
          <li>
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li>
            <Link to="/learning" className="nav-link">
              Learning
            </Link>
          </li>
          <li>
            <Link to="/games" className="nav-link">
              Games
            </Link>
          </li>
          <li>
            <Link to="/live-test" className="nav-link">
              Live Test
            </Link>
          </li>
          <li>
            <Link to="/tricky-keys" className="nav-link">
              Tricky Keys
            </Link>
          </li>
        </ul>
      </nav>
      <hr />
      <div className="labels">
        <ul>
          <li>Blog</li>
          <li>Today's Learning</li>
          <li>Contact Us</li>
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
