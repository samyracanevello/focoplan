import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import CalendarView from './pages/Calendar';
import Pomodoro from './pages/Pomodoro';
import Landing from './pages/Landing';
import Auth from './pages/Auth';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/landing" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/" element={<Layout />}>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="tasks" element={<Tasks />} />
                    <Route path="calendar" element={<CalendarView />} />
                    <Route path="pomodoro" element={<Pomodoro />} />
                    {/* Mock routes for Sidebar links */}
                    <Route path="stats" element={<div className="p-8"><h1 className="text-3xl font-bold">Stats</h1></div>} />
                    <Route path="goals" element={<div className="p-8"><h1 className="text-3xl font-bold">Metas</h1></div>} />
                    <Route path="export" element={<div className="p-8"><h1 className="text-3xl font-bold">Export</h1></div>} />
                    <Route path="settings" element={<div className="p-8"><h1 className="text-3xl font-bold">Settings</h1></div>} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
