"use client";
import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { RecipeDetailBody } from "@/components/pages/RecipeDetailBody";
import mockedRecipes from "@/mocked/mockedRecipes.json";
import mockedRecipes2 from "@/mocked/mockedRecipes2.json";

const allRecipes = [...mockedRecipes, ...mockedRecipes2];

export default function RecipePage() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params.slug === "string" ? params.slug : Array.isArray(params.slug) ? params.slug[0] : "";

  const recipe = useMemo(
    () => allRecipes.find((r) => r.slug === slug) ?? null,
    [slug]
  );
  
  // Custom back handler: go back if possible, else go to /recipes
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/recipes");
    }
  };

  if (!recipe) {
    return <div className="text-center py-10 text-red-500">Recipe not found.</div>;
  }

  return <RecipeDetailBody recipe={recipe} onBack={handleBack} />;
}
