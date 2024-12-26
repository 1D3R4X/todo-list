import {
  CheckIcon,
  CircleIcon,
  Pencil1Icon,
  TrashIcon,
} from '@radix-ui/react-icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Todo } from '@/app/types/todo';
import { Button } from '@/shared/components/ui/button';
import { useToast } from '@/shared/hooks/use-toast';
import { cn } from '@/shared/lib/utils';

const PRIORITY_COLORS = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800',
};

const PRIORITY_LABELS = {
  high: 'Высокий',
  medium: 'Средний',
  low: 'Низкий',
};

export function TodoItem({
  todo,
  setIsChange,
}: {
  todo: Todo;
  setIsChange: (value: boolean) => void;
}) {
  const [isDone, setIsDone] = useState(todo.isDone);
  const { toast } = useToast();
  const navigate = useNavigate();

  const onChange = async () => {
    setIsDone((prev) => !prev);

    const response = await fetch(`/api/todos/${todo.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...todo, isDone: !isDone }),
    });

    if (response.ok) {
      toast({
        variant: 'success',
        title: 'Задача успешно обновлена',
      });

      setIsChange(true);
    }
  };

  const onDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    const response = await fetch(`/api/todos/${todo.id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      toast({
        variant: 'success',
        title: 'Задача успешно удалена',
      });

      setIsChange(true);
    }
  };

  const onEdit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    navigate(`/edit-todo/${todo.id}`);
  };

  return (
    <div
      className={cn(
        'p-4 mb-3 bg-secondary rounded-lg shadow-sm border border-muted-foreground hover:shadow-md transition-shadow',
        isDone && 'bg-secondary/50'
      )}
      onClick={onChange}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 p-2">
          {isDone ? (
            <CheckIcon className="w-4 h-4 text-green-500" />
          ) : (
            <CircleIcon className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1">
          <h3
            className={cn(
              'text-lg font-medium text-foreground',
              isDone && 'text-muted-foreground line-through'
            )}
          >
            {todo.description}
          </h3>
          <div className="mt-1">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
              ${PRIORITY_COLORS[todo.priority as keyof typeof PRIORITY_COLORS]}`}
            >
              {PRIORITY_LABELS[todo.priority as keyof typeof PRIORITY_LABELS]}
            </span>
          </div>
          <div className="mt-2 text-muted-foreground text-sm">
            {new Date(todo.createdAt).toLocaleDateString()}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onEdit}>
            <Pencil1Icon className="w-4 h-4" />
          </Button>
          <Button variant="destructive" size="icon" onClick={onDelete}>
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
