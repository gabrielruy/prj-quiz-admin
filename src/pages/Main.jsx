import React from 'react';

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

import { Layout } from 'antd';

import Header from '../layout/headerComponent/HeaderComponent';
// import Footer from '../layout/footerComponent/FooterComponent';
import Sidebar from '../layout/sidebarComponent/SidebarComponent';

import Home from './home/Home';
import Themes from './themes/Themes';
import Contents from './contents/Contents';
import Levels from './levels/Levels';
import NotFound from './notFound/NotFound';
import SignIn from './signIn/SignIn';

import { isAuthenticated } from '../services/auth';
import '../assets/styles/styles.css';

const { Content } = Layout;

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      (isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
      ))
    }
  />
);

const Main = () => (
  <Router>
    <Switch>
      <Route exact path="/login" component={SignIn} />
      <Route>
        <Layout style={{ minHeight: '100vh' }}>
          <Sidebar />
          <Layout>
            <Header />
            <Content style={{ margin: '16px 16px 0 16px' }}>
              <Switch>
                <PrivateRoute exact path="/" component={Home} />
                <PrivateRoute exact path="/themes" component={Themes} />
                <PrivateRoute exact path="/contents" component={Contents} />
                <PrivateRoute exact path="/levels" component={Levels} />
                <PrivateRoute component={NotFound} />
              </Switch>
            </Content>
            {/* <Footer /> */}
          </Layout>
        </Layout>
      </Route>
    </Switch>
  </Router>
);

export default Main;
