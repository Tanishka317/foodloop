import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import AppLayout from './components/layout/AppLayout';

// Public Pages
import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import AboutPage from './pages/about/AboutPage';

// Shared App Pages
import NotificationsPage from './pages/app/NotificationsPage';
import ProfilePage from './pages/app/ProfilePage';
import SettingsPage from './pages/app/SettingsPage';

// NGO Pages
import NgoOverviewPage from './pages/ngo/NgoOverviewPage';
import DiscoverPage from './pages/ngo/DiscoverPage';
import DonationDetailPage from './pages/ngo/DonationDetailPage';
import NgoRequestsPage from './pages/ngo/NgoRequestsPage';
import NgoPickupsPage from './pages/ngo/NgoPickupsPage';
import NgoHistoryPage from './pages/ngo/NgoHistoryPage';
import NgoImpactPage from './pages/ngo/NgoImpactPage';

// Donor Pages
import DonorOverviewPage from './pages/donor/DonorOverviewPage';
import DonationsListPage from './pages/donor/DonationsListPage';
import CreateDonationPage from './pages/donor/CreateDonationPage';
import DonorDonationDetailPage from './pages/donor/DonorDonationDetailPage';
import DonorRequestsPage from './pages/donor/DonorRequestsPage';
import DonorPickupsPage from './pages/donor/DonorPickupsPage';
import DonorHistoryPage from './pages/donor/DonorHistoryPage';
import DonorImpactPage from './pages/donor/DonorImpactPage';

// Volunteer Pages
import VolunteerOverviewPage from './pages/volunteer/VolunteerOverviewPage';
import VolunteerTasksPage from './pages/volunteer/VolunteerTasksPage';
import VolunteerTaskDetailPage from './pages/volunteer/VolunteerTaskDetailPage';
import VolunteerSchedulePage from './pages/volunteer/VolunteerSchedulePage';
import VolunteerHistoryPage from './pages/volunteer/VolunteerHistoryPage';

// Admin Pages
import AdminOverviewPage from './pages/admin/AdminOverviewPage';
import AdminOrganizationsPage from './pages/admin/AdminOrganizationsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminDonationsPage from './pages/admin/AdminDonationsPage';
import AdminRequestsPage from './pages/admin/AdminRequestsPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';

// Helper component to redirect /app to the active role
function RoleRedirect() {
  const { currentRole } = useApp();
  return <Navigate to={`/app/${currentRole || 'ngo'}`} replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Public Pages with PublicLayout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Route>

      {/* Authenticated Workspace with AppLayout */}
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<RoleRedirect />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />

        {/* NGO / Recipient Routes */}
        <Route path="ngo" element={<NgoOverviewPage />} />
        <Route path="ngo/discover" element={<DiscoverPage />} />
        <Route path="ngo/donations/:id" element={<DonationDetailPage />} />
        <Route path="ngo/requests" element={<NgoRequestsPage />} />
        <Route path="ngo/pickups" element={<NgoPickupsPage />} />
        <Route path="ngo/history" element={<NgoHistoryPage />} />
        <Route path="ngo/impact" element={<NgoImpactPage />} />

        {/* Food Donor Routes */}
        <Route path="donor" element={<DonorOverviewPage />} />
        <Route path="donor/donations" element={<DonationsListPage />} />
        <Route path="donor/donations/new" element={<CreateDonationPage />} />
        <Route path="donor/donations/:id" element={<DonorDonationDetailPage />} />
        <Route path="donor/requests" element={<DonorRequestsPage />} />
        <Route path="donor/pickups" element={<DonorPickupsPage />} />
        <Route path="donor/history" element={<DonorHistoryPage />} />
        <Route path="donor/impact" element={<DonorImpactPage />} />

        {/* Volunteer Routes */}
        <Route path="volunteer" element={<VolunteerOverviewPage />} />
        <Route path="volunteer/tasks" element={<VolunteerTasksPage />} />
        <Route path="volunteer/tasks/:id" element={<VolunteerTaskDetailPage />} />
        <Route path="volunteer/schedule" element={<VolunteerSchedulePage />} />
        <Route path="volunteer/history" element={<VolunteerHistoryPage />} />

        {/* Administrator Routes */}
        <Route path="admin" element={<AdminOverviewPage />} />
        <Route path="admin/organizations" element={<AdminOrganizationsPage />} />
        <Route path="admin/users" element={<AdminUsersPage />} />
        <Route path="admin/donations" element={<AdminDonationsPage />} />
        <Route path="admin/requests" element={<AdminRequestsPage />} />
        <Route path="admin/reports" element={<AdminReportsPage />} />
        <Route path="admin/analytics" element={<AdminAnalyticsPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
