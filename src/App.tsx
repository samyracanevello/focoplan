import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import CalendarView from './pages/Calendar';
import Pomodoro from './pages/Pomodoro';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Onboarding from './pages/Onboarding';
import Stats from './pages/Stats';
import Goals from './pages/Goals';
import Subjects from './pages/Subjects';
import SubjectDetail from './pages/SubjectDetail';
import Flashcards from './pages/Flashcards';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import { useUserStore } from './store/useUserStore';

const OnboardingRoute = ({ children }: { children: JSX.Element }) => {
    const { name, hasSeenOnboarding } = useUserStore();
    if (!name) return <Navigate to="/auth" replace />;
    if (!hasSeenOnboarding) return <Onboarding />;
    return <>{children}</>;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/landing" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />

                <Route path="/" element={<OnboardingRoute><Layout /></OnboardingRoute>}>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="tasks" element={<Tasks />} />
                    <Route path="subjects" element={<Subjects />} />
                    <Route path="subjects/:id" element={<SubjectDetail />} />
                    <Route path="flashcards" element={<Flashcards />} />
                    <Route path="calendar" element={<CalendarView />} />
                    <Route path="pomodoro" element={<Pomodoro />} />
                    <Route path="stats" element={<Stats />} />
                    <Route path="goals" element={<Goals />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="export" element={<Navigate to="/settings" replace />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
