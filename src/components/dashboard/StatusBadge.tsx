type Status = 'confirmed' | 'active' | 'completed' | 'verified' | 'pending' | 'paused' | 'processing' | 'cancelled' | 'suspended' | 'rejected';

const styles: Record<Status, string> = {
  confirmed: 'bg-[#E1F5EE] text-[#0F6E56]',
  active: 'bg-[#E1F5EE] text-[#0F6E56]',
  completed: 'bg-[#E1F5EE] text-[#0F6E56]',
  verified: 'bg-[#E1F5EE] text-[#0F6E56]',
  pending: 'bg-[#FAEEDA] text-[#633806]',
  paused: 'bg-[#FAEEDA] text-[#633806]',
  processing: 'bg-[#FAEEDA] text-[#633806]',
  cancelled: 'bg-[#FCEBEB] text-[#A32D2D]',
  suspended: 'bg-[#FCEBEB] text-[#A32D2D]',
  rejected: 'bg-[#FCEBEB] text-[#A32D2D]',
};

const labels: Record<Status, string> = {
  confirmed: 'Confirmed',
  active: 'Active',
  completed: 'Completed',
  verified: 'Verified',
  pending: 'Pending',
  paused: 'Paused',
  processing: 'Processing',
  cancelled: 'Cancelled',
  suspended: 'Suspended',
  rejected: 'Rejected',
};

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
