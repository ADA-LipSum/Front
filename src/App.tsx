import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header/Header';
import Home from './pages/Home/Home';
import Community from './pages/Community/Community';
import Contact from './pages/Contact/Contact';
import Exchange from './pages/Exchange/Exchange';
import Events from './pages/Event/Event';
import Profile from './pages/Profile/Profile';
import Login from './pages/Auth/Login';
import NotFound from './pages/NotFound';
import Blog from './pages/Blog/Blog';
import Form from './pages/Contact/Form';

function App() {
    return (
        <>
            <Header />

            <Routes>
                {/* 헤더 페이지 라우트 */}
                <Route path="/" element={<Home />} />
                <Route path="/community" element={<Community />} />
                <Route path="/exchange" element={<Exchange />} />
                <Route path="/events" element={<Events />} />
                <Route path="/blog" element={<Blog />} />

                <Route path="/contact/form" element={<Form />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/profile" element={<Profile />} />

                {/* 인증 관련 라우트 */}
                <Route path="/login" element={<Login />} />

                {/* 맨 마지막에 배치할 것!! */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}

export default App;
