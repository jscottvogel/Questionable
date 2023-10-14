import './App.css';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventList from '../features/events/EventList';
import NotFound from '../components/NotFound';
import QuestionableMenu from '../components/QuestionableMenu';
import EventDetail from '../features/events/EventDetail';

function App() {

  return (
    <Router>
      <QuestionableMenu variant="light" />
      <Container >
        <Routes>
          <Route path="/" element={ <EventList /> }></Route>
          <Route path="/event/:id" element={ <EventDetail /> }></Route>
          <Route path="/*" element={ <NotFound /> }></Route>
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
