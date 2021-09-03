import './App.css';
import NavigationBar from './components/NavigationBar'
import Home from './components/Home'
import Footer from './components/Footer'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import MyCourses from './components/MyCourses';
import Login from "./components/Login";
import Register from "./components/Register";
import AddCourse from './components/AddCourse';
import SwapPreferences from './components/SwapPreferences';
import Faq from './components/Faq';
import Feedback from './components/Feedback';
import iconImage from './images/logo-new2.jpg';
import ResetPassword from './components/ResetPassword';

function App() {
  return (<Router>
    <div className="App">
        <NavigationBar imgUrl={iconImage}/>

          <Switch>
            <Route exact path='/' component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/mycourses" component={MyCourses} />
            <Route path="/addcourse" component={AddCourse} />
            <Route path="/swap-preferences" component={SwapPreferences} />
            <Route path="/faqs" component={Faq} />
            <Route path="/feedback" component={Feedback} />
            <Route path="/reset-password" component={ResetPassword} />
            <Route path='/' component={Home} /> { /* later add page not found */ }
          </Switch>

        <Footer />

    </div></Router>
  );
}


export default App;
