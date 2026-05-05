"use client";
import { useState, useEffect } from "react";
import CaloriesScreen from "./screens/CaloriesScreen";
import InventoryScreen from "./screens/InventoryScreen";
import SummaryScreen from "./screens/SummaryScreen";
import { useCurrentUser } from "@/lib/useCurrentUser";

export default function MealPrepHelperPageBody() {
  const { user } = useCurrentUser();
  const [macros, setMacros] = useState({ protein: 35, fat: 30, carbs: 35 });
  const [calorieGoal, setCalorieGoal] = useState(2300);
  const [days, setDays] = useState(5);
  const [step, setStep] = useState<'calories' | 'inventory' | 'summary'>('calories');
  const [ingredients, setIngredients] = useState<{ name: string; amount: string; unit: string }[]>([]);
  const [nutritionSummary, setNutritionSummary] = useState<any>(null);
  const [ingredientDB, setIngredientDB] = useState<any[]>([]);
  const [profileLoading, setProfileLoading] = useState(false);

  const handleLoadFromProfile = async () => {
    setProfileLoading(true);
    try {
      const res = await fetch('/api/auth/profile');
      if (!res.ok) return;
      const data = await res.json();
      if (data.dailyCalories) setCalorieGoal(data.dailyCalories);
      if (data.macroSplit) setMacros(data.macroSplit);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    fetch("/api/ingredients")
      .then((res) => res.json())
      .then((data) => setIngredientDB(Array.isArray(data) ? data : []));
  }, []);

  // Calculate nutrition for all ingredients
  function calculateNutrition() {
    let totalKcal = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;
    for (const ing of ingredients) {
      const db = ingredientDB.find((i: any) => i.name === ing.name);
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

    const ingredientList = ingredients.map((i) => `  • ${i.amount} ${i.unit} ${i.name}`).join('\n');
    fetch('/api/notifications/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `🥗 <b>Meal Prep Helper used</b>\n👤 ${user?.email ?? 'Guest'}\n📅 ${days} days · 🎯 ${calorieGoal} kcal/day\n🥩 P ${macros.protein}% · 🧈 F ${macros.fat}% · 🍚 C ${macros.carbs}%\n🛒 Ingredients:\n${ingredientList}\n🔥 Total: ${Math.round(nutrition.totalKcal)} kcal | P ${Math.round(nutrition.totalProtein)}g | F ${Math.round(nutrition.totalFat)}g | C ${Math.round(nutrition.totalCarbs)}g`,
      }),
    }).catch(() => {});
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
    <div className="sm:mx-auto sm:w-4xl px-4 pt-24 text-neutral-900 dark:text-neutral-100">
      {step === 'calories' && (<section className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Meal Prep Helper
        </h1>
        {user && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={handleLoadFromProfile}
              disabled={profileLoading}
              className="flex items-center gap-1.5 rounded-full border border-[#d2a852] dark:border-[#f0c46a] px-4 py-1.5 text-xs font-semibold text-[#d2a852] dark:text-[#f0c46a] transition hover:bg-[#d2a852] hover:text-black dark:hover:bg-[#f0c46a] dark:hover:text-[#23232a] disabled:opacity-50"
            >
              {profileLoading ? 'Loading…' : 'Use saved data'}
            </button>
          </div>
        )}
      </section>)}
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
          ingredientDB={ingredientDB}
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
          ingredientDB={ingredientDB}
          onBack={() => setStep('inventory')}
          onBackCalories={() => setStep('calories')}
        />
      )}
    </div>
  );
}