import CreateEventForm from "./CreateEventForm";

export default function CreateEventPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold mb-6">Create New Event</h1>
        <CreateEventForm />
      </div>
    </div>
  );
}
