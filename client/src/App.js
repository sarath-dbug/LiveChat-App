import { Route, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MainContainer from './components/MainContainer/MainContainer';
import Users from './pages/UsersPage';
import Welcome from './pages/WelcomePage';
import Groups from './pages/GroupsPage';
import CreateGroupPage from './pages/CreateGroupPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';


function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='login' element={<LoginPage />} />
        <Route path='signup' element={<SignupPage />} />
        <Route path='app' element={<MainContainer />}>
          <Route path='welcome' element={<Welcome />} ></Route>
          <Route path='users' element={<Users />} ></Route>
          <Route path='groups' element={<Groups />} ></Route>
          <Route path='create-groups' element={<CreateGroupPage />} ></Route>
          <Route path='chat/:_id' element={<ChatPage />}></Route>
          <Route path='profile' element={<ProfilePage />}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
