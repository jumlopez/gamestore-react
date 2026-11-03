import { Outlet } from 'react-router-dom';
import AppNavbar from '../organisms/AppNavbar.jsx';
import AppFooter from '../organisms/AppFooter.jsx';
import ToastHost from '../organisms/ToastHost.jsx';

export default function StoreLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <AppNavbar />
      <main className="flex-grow-1"><Outlet /></main>
      <AppFooter />
      <ToastHost />
    </div>
  );
}
