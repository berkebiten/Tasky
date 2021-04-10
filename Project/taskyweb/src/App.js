import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import SignUp from "./containers/SignUp";
import SignIn from "./containers/SignIn";
import Projects from "./containers/Projects";
import Navbar from "./components/Navbar";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import '../node_modules/rsuite/dist/styles/rsuite-dark.css';


function App() {
  return (
      <Router>
            <Switch>
              <Route exact path="/" component={SignIn} />
              <Route path="/projects" component={Projects} />
              <Route path="/sign-in" component={SignIn} />
              <Route path="/sign-up" component={SignUp} />
            </Switch>
      </Router>
  );
}

export default App;
