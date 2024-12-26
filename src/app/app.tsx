import { RouterProvider } from 'react-router-dom';

import { router } from './providers/router';
import { ThemeProvider } from './providers/theme-provider';

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
