import { TodoList } from '@/components/todo-list';

export function TodosPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold mb-4">Список задач</h1>
      <TodoList />
    </div>
  );
}
