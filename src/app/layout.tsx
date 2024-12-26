import { Outlet } from 'react-router-dom';

import { Header } from '@/components/header';
import { Toaster } from '@/shared/components/ui/toaster';

export default function Layout() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      <Toaster />
      <div className="container px-4 py-2 mx-auto">
        <Outlet />
      </div>
    </div>
  );
}
