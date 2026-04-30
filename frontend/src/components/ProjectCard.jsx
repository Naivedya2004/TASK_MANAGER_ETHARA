export default function ProjectCard({ project }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition">
      <h2 className="text-lg font-semibold">{project.name}</h2>
    </div>
  );
}