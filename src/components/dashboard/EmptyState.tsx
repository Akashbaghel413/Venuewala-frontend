import { Inbox } from 'lucide-react';

export default function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Inbox className="h-12 w-12 text-gray-200 mb-3" />
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  );
}
