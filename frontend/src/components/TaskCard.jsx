export default function TaskCard({ task, onStatusChange }) {
  return (
    <div key={t.id} className="bg-gray-800 p-4 rounded">
  <p>{t.title}</p>
  <p className="text-sm text-gray-400 mb-2">{t.status}</p>

  {role === "admin" && (
    <div className="flex gap-2">
      <button
        className="bg-green-600 px-2 py-1 rounded"
        onClick={() => updateStatus(t.id, "completed")}
      >
        Complete
      </button>

      <button
        className="bg-yellow-600 px-2 py-1 rounded"
        onClick={() => updateStatus(t.id, "pending")}
      >
        Pending
      </button>
    </div>
  )}
</div>
  );
}