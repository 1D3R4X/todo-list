import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Todo } from '@/app/types/todo';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Progress } from '@/shared/components/ui/progress';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/shared/components/ui/select';
import { Skeleton } from '@/shared/components/ui/skeleton';

import { TodoItem } from './todo-item';



const priorities = [
  { value: 'low', label: 'Низкий' },
  { value: 'medium', label: 'Средний' },
  { value: 'high', label: 'Высокий' },
];

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isChange, setIsChange] = useState(true);

  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState<string>('');

  useEffect(() => {
    if (!isChange) return;

    fetch('http://localhost:3001/todos')
      .then((response) => response.json())
      .then((data) => {
        setTodos(data);
        setIsLoading(false);
        setIsChange(false);
      });
  }, [isChange]);

  useEffect(() => {
    setFilteredTodos(
      todos.filter(
        (todo) =>
          todo.description.toLowerCase().includes(search.toLowerCase()) &&
          (priority ? todo.priority === priority : true)
      )
    );
  }, [search, todos, priority]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  const doneTodos = filteredTodos.filter((todo) => todo.isDone).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full flex gap-2">
        <Input
          className="flex-[3]"
          placeholder="Поиск"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="flex-[1]">
            <SelectValue placeholder="Выберите приоритет" />
          </SelectTrigger>
          <SelectContent>
            {priorities.map((priority) => (
              <SelectItem key={priority.value} value={priority.value}>
                {priority.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            setSearch('');
            setPriority('');
          }}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {!!filteredTodos.length && (
        <div className="w-full flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            Выполнено задач {doneTodos} из {filteredTodos.length}
          </p>
          <Progress value={(doneTodos / todos.length) * 100} />
        </div>
      )}

      {filteredTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} setIsChange={setIsChange} />
      ))}

      {!filteredTodos.length && (
        <div className="flex flex-col items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground">
            Задач не найдено
          </span>

          <Button
            variant="outline"
            onClick={() => {
              setSearch('');
              setPriority('');
            }}
          >
            Очистить фильтры
          </Button>
        </div>
      )}
    </div>
  );
}
