import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import SignUp from "./containers/SignUp";
import SignIn from "./containers/SignIn";
import Projects from "./containers/Projects";
import ProjectDetail from "./containers/ProjectDetail";
import Profile from "./containers/Profile";
import Task from "./containers/Task";
import Tasks from './containers/Tasks'
import ActivityStream from './containers/ActivityStream'
import { Spin } from "antd";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { RootViewHelper } from "./util/helpers";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/rsuite/dist/styles/rsuite-dark.css";
import "semantic-ui-css/semantic.min.css";
import "../node_modules/antd/dist/antd.css";
import "react-toastify/dist/ReactToastify.css";
import "../node_modules/react-datepicker/dist/react-datepicker.css";

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
          pauseOnFocusLoss={false}
        />
        <Switch>
          <Route exact path="/" component={SignIn} />
          <Route path="/Projects" component={Projects} />
          <Route path="/sign-in" component={SignIn} />
          <Route path="/sign-up" component={SignUp} />
          <Route path="/project/:id" render={(props) => <ProjectDetail {...props} />} />
          <Route path="/task/:id" render={(props) => <Task {...props} />} />
          <Route path="/profile/:id" render={(props) => <Profile {...props} />} />
          <Route path="/MyTasks" component={Tasks} />
          <Route path="/ActivityStream" component={ActivityStream} />
        </Switch>
      </Router>
    </Spin>
  );
}

export default App;
