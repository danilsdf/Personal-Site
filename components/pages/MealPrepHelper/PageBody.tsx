"use client";
import { useState } from "react";
import CaloriesScreen from "./screens/CaloriesScreen";
import InventoryScreen from "./screens/InventoryScreen";
import SummaryScreen from "./screens/SummaryScreen";
import mockedIngredients from "./mockedIngredients.json";

export default function MealPrepHelperPageBody() {
  const [macros, setMacros] = useState({ protein: 35, fat: 30, carbs: 35 });
  const [calorieGoal, setCalorieGoal] = useState(2300);
  const [days, setDays] = useState(5);
  const [step, setStep] = useState<'calories' | 'inventory' | 'summary'>('calories');
  const [ingredients, setIngredients] = useState<{ name: string; amount: string; unit: string }[]>([
    {name: 'Chicken breast', unit: 'kg', amount: '1.1'}, {name: 'Chicken thighs', unit: 'kg', amount: '0.5'}, {name: 'Shrimps', unit: 'g', amount: '680'}, {name: 'Beef', unit: 'kg', amount: '0.82'}, {name: 'Buckwheat', unit: 'g', amount: '400'}, {name: 'Sweet potato', unit: 'kg', amount: '1.7'}, {name: 'Whey protein', unit: 'scoop', amount: '5'}, {name: 'Oatmeal', unit: 'g', amount: '400'}, {name: 'Protein yogurt', unit: 'g', amount: '40'}, {name: 'Frozen berries', unit: 'g', amount: '500'}, {name: 'Mushrooms', unit: 'g', amount: '720'}, {name: 'Bell pepper', unit: 'g', amount: '720'}, {name: 'Olive oil', unit: 'tbsp', amount: '5'}, {name: 'Avocado', unit: 'g', amount: '400'}, {name: 'Soy sauce', unit: 'tbsp', amount: '25'}
  ]);
  const [nutritionSummary, setNutritionSummary] = useState<any>(null);

  // Calculate nutrition for all ingredients
  function calculateNutrition() {
    let totalKcal = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;
    for (const ing of ingredients) {
      const db = mockedIngredients.find((i: any) => i.name === ing.name);
      if (!db) continue;
      const conv = db.unitConversions.find((u: any) => u.unit === ing.unit);
      if (!conv) continue;
      const grams = parseFloat(ing.amount) * conv.grams;
      totalKcal += grams * db.kcalPer1g;
      totalProtein += grams * db.proteinPer1g;
      totalCarbs += grams * db.carbsPer1g;
      totalFat += grams * db.fatPer1g;
    }
    return { totalKcal, totalProtein, totalCarbs, totalFat };
  }

  const handleContinueCalories = () => {
    const data = { calorieGoal, macros, days };
    localStorage.setItem('mealPrepSettings', JSON.stringify(data));
    setStep('inventory');
  };

  const handleContinueInventory = () => {
    localStorage.setItem('mealPrepIngredients', JSON.stringify(ingredients));
    // Calculate nutrition and show summary
    const nutrition = calculateNutrition();
    setNutritionSummary(nutrition);
    setStep('summary');
  };

  // Calculate daily goals
  const dailyProtein = (macros.protein / 100) * calorieGoal / 4;
  const dailyFat = (macros.fat / 100) * calorieGoal / 9;
  const dailyCarbs = (macros.carbs / 100) * calorieGoal / 4;
  const totalGoal = {
    kcal: calorieGoal * days,
    protein: dailyProtein * days,
    fat: dailyFat * days,
    carbs: dailyCarbs * days,
  };

  // Helper: check if within 5% of goal
  function isWithinGoal(actual: number, goal: number) {
    return actual >= goal * 0.95 && actual <= goal * 1.05;
  }

  return (
    <div className="sm:mx-auto max-w-4xl px-4 pb-24 pt-12 text-neutral-900 dark:text-neutral-100">
      <section className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-yellow-600 dark:text-yellow-400">
          Meal Prep Helper
        </h1>
      </section>
      {step === 'calories' && (
        <CaloriesScreen
          calorieGoal={calorieGoal}
          setCalorieGoal={setCalorieGoal}
          macros={macros}
          setMacros={setMacros}
          days={days}
          setDays={setDays}
          onContinue={handleContinueCalories}
        />
      )}
      {step === 'inventory' && (
        <InventoryScreen
          ingredients={ingredients}
          setIngredients={setIngredients}
          onContinue={handleContinueInventory}
        />
      )}
      {step === 'summary' && nutritionSummary && (
        <SummaryScreen
          calorieGoal={calorieGoal}
          macros={macros}
          days={days}
          ingredients={ingredients}
          nutritionSummary={nutritionSummary}
          totalGoal={totalGoal}
          isWithinGoal={isWithinGoal}
          onBack={() => setStep('inventory')}
          onBackCalories={() => setStep('calories')}
        />
      )}
    </div>
  );
}