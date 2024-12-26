import { ArrowLeftIcon } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';
import { useToast } from '@/shared/hooks/use-toast';

const priorities = [
  { value: 'low', label: 'Низкий' },
  { value: 'medium', label: 'Средний' },
  { value: 'high', label: 'Высокий' },
];

export function CreateTodo() {
  const { toast } = useToast();
  const [priority, setPriority] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const navigate = useNavigate();

  const onChangeDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const onChangePriority = (value: string) => {
    setPriority(value);
  };

  const handleCreateTodo = async () => {
    const newTodo = {
      id: Date.now(),
      description,
      priority,
      isDone: false,
      createdAt: new Date(),
    };

    const response = await fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTodo),
    });

    if (response.ok) {
      toast({
        variant: 'success',
        title: 'Задача успешно создана',
        description: 'Задача успешно создана',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Ошибка при создании задачи',
        description: 'Ошибка при создании задачи',
      });
    }

    setDescription('');
    setPriority('');

    navigate('/');
  };

  return (
    <div className="container">
      <Link to="/" className="flex items-center gap-2 mb-4">
        <Button variant="outline" className="flex items-center gap-2">
          <ArrowLeftIcon className="w-4 h-4" />
          Назад
        </Button>
      </Link>

      <h2 className="text-2xl font-bold">Создать задачу</h2>

      <div className="flex flex-col gap-2 mt-6">
        <Label className="text-lg">Описание задачи</Label>
        <Textarea value={description} onChange={onChangeDescription} />
      </div>

      <div className="flex flex-col gap-2 mt-6">
        <Label className="text-lg">Выберите категорию</Label>

        <Select value={priority} onValueChange={onChangePriority}>
          <SelectTrigger>
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
      </div>

      <Button
        className="mt-6"
        onClick={handleCreateTodo}
        disabled={!description || !priority}
      >
        Создать задачу
      </Button>
    </div>
  );
}
