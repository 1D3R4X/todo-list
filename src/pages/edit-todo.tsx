import { Label } from '@radix-ui/react-label';
import { ArrowLeftIcon } from 'lucide-react';
import { useState } from 'react';
import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/shared/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';
import { useToast } from '@/shared/hooks/use-toast';


const priorities = [
  { value: 'low', label: 'Низкий' },
  { value: 'medium', label: 'Средний' },
  { value: 'high', label: 'Высокий' },
];

export function EditTodo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [priority, setPriority] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    fetch(`/api/todos/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setPriority(data.priority);
        setDescription(data.description);
      });
  }, [id]);

  const onChangeDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const onChangePriority = (value: string) => {
    setPriority(value);
  };

  const handleEditTodo = async () => {
    const response = await fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ description, priority }),
    });

    if (response.ok) {
      navigate('/');
      toast({
        variant: 'success',
        title: 'Задача изменена',
        description: 'Задача успешно изменена',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось изменить задачу',
      });
    }
  };

  return (
    <div className="container">
      <Link to="/" className="flex items-center gap-2 mb-4">
        <Button variant="outline" className="flex items-center gap-2">
          <ArrowLeftIcon className="w-4 h-4" />
          Назад
        </Button>
      </Link>

      <h2 className="text-2xl font-bold">
        Создать задачу <span className="text-muted-foreground">#{id}</span>
      </h2>

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
        onClick={handleEditTodo}
        disabled={!description || !priority}
      >
        Изменить задачу
      </Button>
    </div>
  );
}
