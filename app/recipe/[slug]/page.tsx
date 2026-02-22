"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { RecipeDetailBody } from "@/components/pages/RecipeDetailBody";

export default function RecipePage() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params.slug === "string" ? params.slug : Array.isArray(params.slug) ? params.slug[0] : "";
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/recipes/${encodeURIComponent(slug)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Recipe not found");
        return res.json();
      })
      .then((data) => {
        setRecipe(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setRecipe(null);
      })
      .finally(() => setLoading(false));
  }, [slug]);
  
  // Custom back handler: go back if possible, else go to /recipes
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/recipes");
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-neutral-400">Loading...</div>;
  }
  if (error || !recipe) {
    return <div className="text-center py-10 text-red-500">Recipe not found.</div>;
  }

  return <RecipeDetailBody recipe={recipe} onBack={handleBack} />;
}
