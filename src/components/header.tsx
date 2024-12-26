import { MoonIcon, PlusIcon, SunIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useTheme } from '@/app/providers/theme-provider';
import { Button } from '@/shared/components/ui/button';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="bg-secondary px-4 py-8 ">
      <div className="container flex justify-between items-center mx-auto">
        <Link to="/" className="text-2xl font-bold">
          Задачи
        </Link>

        <div className="flex items-center gap-2">
          <Link to="/create-todo">
            <Button variant="outline" className="flex items-center gap-2">
              <PlusIcon className="w-4 h-4" />
              Добавить задачу
            </Button>
          </Link>

          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? (
              <SunIcon className="w-4 h-4" />
            ) : (
              <MoonIcon className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
