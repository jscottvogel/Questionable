import './App.css';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventList from '../features/events/EventList';
import NotFound from '../components/NotFound';
import QuestionableMenu from '../components/QuestionableMenu';
import EventDetail from '../features/events/EventDetail';
// Admin routes
import LoginPage from '../pages/LoginPage';
// import AddEvent from '../features/admin/AddEvent';
import AdminUpdateEventDetail from '../components/admin/AdminUpdateEventDetail';
import AdminManageEventQuestions from '../components/admin/AdminManageEventQuestions';
import AdminDashboard from '../pages/AdminDashboard';
import { AuthProvider } from '../AuthContext';
import SignUp from '../pages/SignUp';
import ConfirmSignUp from '../pages/ConfirmSignUp';
import UserProfile from '../pages/UserProfile';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import RouteGuard from '../pages/RouteGuard';
import AdminRouteGuard from '../pages/AdminRouteGuard';
import LogoutPage from '../pages/LogoutPage';
import AdminAddEvent from '../components/admin/AdminAddEvent';


function App() {

  return (
    <AuthProvider>
      <Router>
        <QuestionableMenu variant="light" />
        <Container >
          <Routes>
            <Route path="/" element={ <EventList /> }></Route>
            <Route path="/event/:id" element={ <EventDetail /> }></Route>
            <Route path="/*" element={ <NotFound /> }></Route>

            {/* Auth routes */ }
            <Route path="/signUp" element={ <SignUp /> } />
            <Route path="/confirm-sign-up" element={ <ConfirmSignUp /> } />
            <Route path="/login" element={ <LoginPage /> } />
            <Route path="/logout" element={ <LogoutPage /> } />
            <Route path="/profile" element={ <RouteGuard>
              <UserProfile />
            </RouteGuard> } />
            <Route path="/forgot-password" element={ <ForgotPassword /> } />
            <Route path="/reset-password" element={ <ResetPassword /> } />

            {/* Admin routes */ }
            <Route path="/admin/*" element={ <AdminRouteGuard>
              <AdminDashboard />
            </AdminRouteGuard> } />
            <Route path="/admin/event/:id" element={ <AdminRouteGuard>
              <AdminUpdateEventDetail />
            </AdminRouteGuard> } />
            <Route path="/admin/event/:id/questions" element={ <AdminRouteGuard><AdminManageEventQuestions /></AdminRouteGuard> }></Route>
            <Route path="/admin/event" element={ <AdminRouteGuard><AdminAddEvent /></AdminRouteGuard> }></Route>
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
