import { RecipeDetailBody } from "@/components/pages/RecipeDetailBody";

export default function HighProteinChickenRicePage() {
  return (
    <RecipeDetailBody
      backHref="/recipes"
      title="High-Protein Chicken & Rice Meal Prep"
      date="Jun 9, 2024"
      macros={{
        calories: 500,
        protein: 48,
        carbs: 54,
        fat: 16,
      }}
      ingredients={[
        "2 boneless, skinless chicken breasts",
        "1 cup jasmine rice",
        "2 cups broccoli florets",
        "1 tbsp olive oil",
        "Salt and pepper to taste",
      ]}
      steps={[
        "Preheat oven to 425°F (218°C).",
        "Season chicken with salt, pepper, and 1/2 tbsp olive oil. Bake for 18–20 minutes, or until cooked through.",
        "Cook jasmine rice according to package instructions.",
        "Toss broccoli with remaining olive oil, salt, and pepper. Roast for 14 minutes.",
        "Slice chicken and assemble meal prep boxes with rice and broccoli. Enjoy throughout the week.",
      ]}
    />
  );
}
