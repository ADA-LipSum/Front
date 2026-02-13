import { Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home/Home';
import { Community } from './pages/Community/Contact';
import { Exchange } from './pages/Exchange/Exchange';
import { Event } from './pages/Event/Event';
import { Contact } from './pages/Contact/Contact';

const Router = () => {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/community" element={<Community />} />
      <Route path="/exchange" element={<Exchange />} />
      <Route path="/event" element={<Event />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
};

export default Router;
