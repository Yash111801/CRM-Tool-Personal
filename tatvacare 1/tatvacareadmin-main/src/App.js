import { Switch, Route, Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Tables from "./pages/Tables";
import SignIn from "./pages/SignIn";
import Main from "./components/layout/Main";
import User from "./pages/Users/User";
import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import Company from "./pages/Company/company";
import Division from "./pages/Division/division";
import Study from "./pages/Study/study";
import Profile1 from "./pages/Profile/profile";
import Investigator from "./pages/Investigate/invastigate";
import ViewInvestigator from "./pages/Investigate/viewInvestigator/viewInvestigator";
import Reports from "./pages/Reports";
import { useAuth } from "./context/AuthContext";
import ViewMilestoneInvestigator from "./pages/Investigate/viewMilestoneInvestigator/viewMilestoneInvestigator";

function App() {
  const { isAuthorized } = useAuth();
  const role = JSON.parse(localStorage.getItem("Role"));

  return (
    <div className="App">
      <ToastContainer theme="colored" />
      <Switch>
        {!isAuthorized ? (
          <>
            <Route exact path="/sign-in" component={SignIn} />
            <Redirect to="/sign-in" />
          </>
        ) : (
          <>
            <Main>
              {role === "ADMIN" ? (
                // If ADMIN => show all routes
                <>
                  <Route exact path="/" component={User} />
                  <Route exact path="/dashboard" component={Home} />
                  <Route exact path="/tables" component={Tables} />
                  <Route exact path="/user" component={User} />
                  <Route path="/company" component={Company} />
                  <Route path="/division" component={Division} />
                  <Route path="/study" component={Study} />
                  <Route path="/profile1" component={Profile1} />
                  <Route path="/investigator" component={Investigator} />
                  <Route path="/reports" component={Reports} />
                  <Route
                    path="/investigator-view"
                    component={ViewInvestigator}
                  />
                  <Route
                    path="/investigator-milestone-view"
                    component={ViewMilestoneInvestigator}
                  />
                </>
              ) : (
                <>
                  <Route path="/dashboard" component={Home} />
                  <Route path="/investigator" component={Investigator} />
                  <Route
                    path="/investigator-view"
                    component={ViewInvestigator}
                  />
                  <Redirect to="/dashboard" />{" "}
                  <Route path="/profile1" component={Profile1} />
                </>
              )}
            </Main>
          </>
        )}
      </Switch>
    </div>
  );
}

export default App;
