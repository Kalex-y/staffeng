import Link from "next/link";
import { Engineer } from "@/lib/data";

const availabilityColor: Record<Engineer["availability"], string> = {
  "Available now": "bg-green-50 text-green-700",
  "Available in 2–4 weeks": "bg-yellow-50 text-yellow-700",
  "Available in 1–2 months": "bg-orange-50 text-orange-700",
};

export default function EngineerCard({ engineer }: { engineer: Engineer }) {
  return (
    <Link
      href={`/engineers/${engineer.slug}`}
      className="group block bg-white border border-gray-200 rounded-xl p-6 hover:border-indigo-300 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm shrink-0">
          {engineer.avatar}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {engineer.name}
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">{engineer.title}</p>
            </div>
            <span
              className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${availabilityColor[engineer.availability]}`}
            >
              {engineer.availability}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {engineer.skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
            {engineer.skills.length > 3 && (
              <span className="text-xs text-gray-400 px-1 py-1">
                +{engineer.skills.length - 3} more
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
            <span>{engineer.location} · {engineer.timezone}</span>
            <span className="font-medium text-gray-700">{engineer.rate}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
