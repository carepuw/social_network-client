import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';

import { Container } from 'semantic-ui-react';
import {
  Home, Register, Login, SinglePost,
} from './pages';
import MenuBar from './components/MenuBar';

import { AuthProvider } from './context/auth';
import AuthRoute from './util/AuthRoute';

import 'semantic-ui-css/semantic.min.css';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <MenuBar />
          <Route exact path="/" component={Home} />
          <AuthRoute exact path="/login" component={Login} />
          <AuthRoute exact path="/register" component={Register} />
          <Route exact path="/posts/:postId" component={SinglePost} />
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
