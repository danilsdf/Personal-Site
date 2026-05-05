import { getDb } from "@/lib/mongodb";
import Link from "next/link";

async function getStats() {
  const db = await getDb();
  const [
    totalIngredients,
    activeIngredients,
    totalRecipes,
    publishedRecipes,
    totalPlans,
  ] = await Promise.all([
    db.collection("Ingredients").countDocuments(),
    db.collection("Ingredients").countDocuments({ isActive: true }),
    db.collection("Recipes").countDocuments(),
    db.collection("Recipes").countDocuments({ status: "published" }),
    db.collection("MealPrepPlans").countDocuments(),
  ]);
  return { totalIngredients, activeIngredients, totalRecipes, publishedRecipes, totalPlans };
}

const quickLinks = [
  { href: "/admin/ingredients", label: "Ingredients", description: "Manage ingredient library" },
  { href: "/admin/recipes", label: "Recipes", description: "Create & publish recipes" },
  { href: "/admin/meal-prep-plans", label: "Meal Prep Plans", description: "Weekly meal plan builder" },
];

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards = [
    { label: "Total Ingredients", value: stats.totalIngredients, sub: `${stats.activeIngredients} active`, color: "from-blue-500/20 to-blue-500/5" },
    { label: "Total Recipes", value: stats.totalRecipes, sub: `${stats.publishedRecipes} published`, color: "from-green-500/20 to-green-500/5" },
    { label: "Meal Prep Plans", value: stats.totalPlans, sub: "in database", color: "from-purple-500/20 to-purple-500/5" },
  ];

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Overview</p>
        <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {statCards.map((s) => (
          <div
            key={s.label}
            className={`rounded-2xl border border-white/10 bg-gradient-to-br ${s.color} p-6`}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-3">
              {s.label}
            </p>
            <p className="text-4xl font-extrabold mb-1">{s.value}</p>
            <p className="text-sm text-white/40">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick navigation */}
      <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">
        Quick access
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickLinks.map(({ href, label, description }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 p-6 transition"
          >
            <p className="font-bold text-white mb-1 group-hover:underline underline-offset-4">
              {label} →
            </p>
            <p className="text-sm text-white/40">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
