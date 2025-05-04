import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function UserDashboard() {
  return (
    <div className="flex bg-light-100 min-h-screen container mt-5">
     <Sidebar/>
     <Outlet/>
    </div>
  );
}