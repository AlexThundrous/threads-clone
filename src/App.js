import React, { Component } from 'react';
import ParticlesBg from 'particles-bg';
import { ChakraProvider, Box, theme } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, useParams} from 'react-router-dom';
import Signin from './components/signin/signin.js';
import Profile from './components/Profile/profile.js';
import Username from './components/Username/username.js';
import Post from './components/Thread/post.js';
import './index.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: {
        googleId: '',
        name: '',
        email: '',
        username: '',
        description: '',
        imageUrl: '',
        joined: '',
        threads: []
      }
    };
  }

  loadUser = (data) => {
    this.setState({
      user: {
        googleId: data.googleId,
        name: data.name,
        email: data.email,
        joined: data.joined,
        username: data.username,
        description: data.description,
        imageUrl: data.profilepic,
        threads: data.threads
      }
    });
  };

  render() {
    const isDarkMode = document.documentElement.classList.contains('dark');
    return (
      <ChakraProvider theme={theme}>
        <Box fontSize="xl">
          <Router>
            <Routes>
              <Route path="/" element={
                <div className="app-container">
                  <ParticlesBg type="lines" bg={false} color="#7C3AED" />
                  <div className="signin-container">
                    <Signin loadUser={this.loadUser} />
                  </div>
                </div>
              } />
              <Route
                path="/home/:googleId"
                element={<Home user={this.state.user} isDarkMode={isDarkMode} loadUser={this.loadUser} />}
              />
            </Routes>
          </Router>
        </Box>
      </ChakraProvider>
    );
  }
}

function Home({ user, isDarkMode, loadUser }) {
  const { googleId } = useParams();

  const stableLoadUser = React.useCallback(data => {
    loadUser(data);
  }, [loadUser]);

  React.useEffect(() => {
    fetch(`http://localhost:3001/user/${googleId}`)
      .then(response => response.json())
      .then(data => {
        stableLoadUser(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [googleId, stableLoadUser]);

  const isUsernameEmpty = user.username === '';

  return (
    <div className="min-h-screen"> {/* Use Tailwind class to set min-height */}
      {isUsernameEmpty ? (
        <Username
          googleId={user.googleId}
          loadUser={loadUser}
        />
      ) : (
        <React.Fragment>
          <Profile
            name={user.name}
            username={user.username}
            imageUrl={user.imageUrl}
            description={user.description}
            id={user.googleId}
            isDarkMode={isDarkMode}
          />
          <Post threads={user.threads} username={user.username} isDarkMode={isDarkMode} id={user.googleId} loadUser={loadUser}/>
        </React.Fragment>
      )}
    </div>
  );
}

export default App;
