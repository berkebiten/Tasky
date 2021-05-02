import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import SignUp from "./containers/SignUp";
import SignIn from "./containers/SignIn";
import Projects from "./containers/Projects";
import ProjectDetail from "./containers/ProjectDetail";
import Profile from "./containers/Profile";
import { Spin } from "antd";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { RootViewHelper } from "./util/helpers";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/rsuite/dist/styles/rsuite-dark.css";
import "semantic-ui-css/semantic.min.css";
import "../node_modules/antd/dist/antd.css";
import "react-toastify/dist/ReactToastify.css";

function App(props) {
  const [loading, setLoading] = useState(false);

  const startLoading = () => {
    setLoading(true);
  };

  const stopLoading = () => {
    setLoading(false);
  };

  useEffect(() => {
    RootViewHelper.setStartLoading(startLoading);
    RootViewHelper.setStopLoading(stopLoading);
  }, []);

  return (
    <Spin spinning={loading} size="large">
      <Router>
        <ToastContainer
          position="bottom-right"
          autoClose={7000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          draggable
          pauseOnHover
        />
        <Switch>
          <Route exact path="/" component={SignIn} />
          <Route path="/projects" component={Projects} />
          <Route path="/sign-in" component={SignIn} />
          <Route path="/sign-up" component={SignUp} />
          <Route path="/project" component={ProjectDetail} />
          <Route path="/profile" component={Profile} />
        </Switch>
      </Router>
    </Spin>
  );
}

export default App;
