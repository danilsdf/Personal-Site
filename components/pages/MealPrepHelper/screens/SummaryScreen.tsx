import React from "react";
import mockedIngredients from "../mockedIngredients.json";

interface SummaryScreenProps {
	calorieGoal: number;
	macros: { protein: number; fat: number; carbs: number };
	days: number;
	ingredients: { name: string; unit: string; amount: string }[];
	nutritionSummary: { totalKcal: number; totalProtein: number; totalCarbs: number; totalFat: number };
	totalGoal: { kcal: number; protein: number; fat: number; carbs: number };
	isWithinGoal: (actual: number, goal: number) => boolean;
	onBack: () => void;
	onBackCalories: () => void;
}

const SummaryScreen: React.FC<SummaryScreenProps> = ({
	calorieGoal,
	macros,
	days,
	ingredients,
	nutritionSummary,
	totalGoal,
	isWithinGoal,
	onBack,
    onBackCalories,
}) => {
	function getIngredientNutrition(ing: { name: string; unit: string; amount: string }) {
		const db = (mockedIngredients as any[]).find(i => i.name === ing.name);
		if (!db) return null;
		const conv = db.unitConversions.find((u: any) => u.unit === ing.unit);
		if (!conv) return null;
		const grams = parseFloat(ing.amount) * conv.grams;
		return {
			kcal: grams * db.kcalPer1g,
			protein: grams * db.proteinPer1g,
			carbs: grams * db.carbsPer1g,
			fat: grams * db.fatPer1g,
		};
	}

	return (
		<div className="max-w-xl mx-auto mt-8">
			<h2 className="text-xl font-bold mb-4 text-yellow-600 dark:text-yellow-400">Your Meal Prep Plan</h2>
			<div className="mb-6 p-4 rounded bg-neutral-100 dark:bg-neutral-800 relative">
				<button
					type="button"
					className="absolute top-2 right-2 p-1 rounded hover:bg-yellow-200 dark:hover:bg-yellow-700"
					title="Edit calorie/macro goal"
					onClick={onBackCalories}
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-yellow-600 dark:text-yellow-400">
						<path d="M15.232 5.232a2.5 2.5 0 0 0-3.535 0l-7.071 7.07A2 2 0 0 0 4 15h3.5a.5.5 0 0 0 .5-.5V13a.5.5 0 0 1 .146-.354l7.07-7.07a2.5 2.5 0 0 0 0-3.535zM13.5 3.5a1.5 1.5 0 0 1 2.121 2.121l-1.06 1.06-2.12-2.12 1.06-1.06z" />
						<path d="M2 17.5A.5.5 0 0 1 2.5 17H17a.5.5 0 0 1 0 1H2.5a.5.5 0 0 1-.5-.5z" />
					</svg>
				</button>
				<div className="mb-2 font-semibold">Calorie Goal: <span className="font-mono">{calorieGoal} kcal/day</span></div>
				<div className="mb-2 font-semibold">Macro Split:</div>
				<ul className="mb-2 ml-4 text-sm">
					<li>Protein: {macros.protein}% ({(macros.protein / 100 * calorieGoal / 4).toFixed(0)}g/day)</li>
					<li>Fat: {macros.fat}% ({(macros.fat / 100 * calorieGoal / 9).toFixed(0)}g/day)</li>
					<li>Carbs: {macros.carbs}% ({(macros.carbs / 100 * calorieGoal / 4).toFixed(0)}g/day)</li>
				</ul>
				<div className="mb-2 font-semibold">Days: <span className="font-mono">{days}</span></div>
			</div>
			<div className="mb-6">
				<div className="font-semibold mb-2">Inventory:</div>
				{(() => {
					const [showAll, setShowAll] = React.useState(false);
					const visibleIngredients = showAll ? ingredients : ingredients.slice(0, 3);
					return (
						<>
						<ul className="divide-y divide-neutral-300 dark:divide-neutral-700">
							{ingredients.length === 0 && (
								<li className="py-2 text-sm text-neutral-500">No ingredients added yet.</li>
							)}
							{visibleIngredients.map((ing, idx) => {
								const nut = getIngredientNutrition(ing);
								return (
									<li key={idx} className="py-2 flex flex-col text-sm">
										<div className="flex justify-between items-center">
											<span>{ing.name}</span>
											<span>{ing.amount} {ing.unit}</span>
										</div>
										{nut && (
											<div className="flex flex-wrap gap-4 text-xs text-neutral-500 mt-1 ml-2">
												<span>Kcal: {nut.kcal.toFixed(0)}</span>
												<span>Protein: {nut.protein.toFixed(1)}g</span>
												<span>Fat: {nut.fat.toFixed(1)}g</span>
												<span>Carbs: {nut.carbs.toFixed(1)}g</span>
											</div>
										)}
									</li>
								);
							})}
						</ul>
						{ingredients.length > 3 && (
							<button
								className="mt-2 text-xs text-yellow-600 dark:text-yellow-400 underline"
								onClick={() => setShowAll(v => !v)}
							>
								{showAll ? 'Show less' : `Show all (${ingredients.length})`}
							</button>
						)}
					</>
					);
				})()}
			</div>
			<h3 className="text-lg font-bold mb-2 text-yellow-600 dark:text-yellow-400">Nutrition Summary(for {days} days)</h3>
			<div className="mb-4">
				{(() => {
					const over = (actual: number, goal: number) => actual > goal * 1.01;
					const under = (actual: number, goal: number) => actual < goal * 0.99;
					const getValueColor = (actual: number, goal: number) => over(actual, goal) ? "text-green-600" : "text-white";
					const getGoalColor = (actual: number, goal: number) => over(actual, goal) ? "text-white" : "text-white";
					const renderRow = (label: string, actual: number, goal: number) => (
						<div className="flex justify-between">
							<span>{label}</span>
							<span>
								<span className={getValueColor(actual, goal)}>{actual.toFixed(0)}</span>
								<span className="text-neutral-400"> / </span>
								<span className={getGoalColor(actual, goal)}>{goal.toFixed(0)}</span>
							</span>
						</div>
					);
					return (
						<>
							{renderRow("Total kcal:", nutritionSummary.totalKcal, totalGoal.kcal)}
							{renderRow("Protein (g):", nutritionSummary.totalProtein, totalGoal.protein)}
							{renderRow("Fat (g):", nutritionSummary.totalFat, totalGoal.fat)}
							{renderRow("Carbs (g):", nutritionSummary.totalCarbs, totalGoal.carbs)}
						</>
					);
				})()}
			</div>
			<h3 className="text-lg font-bold mb-2 text-yellow-600 dark:text-yellow-400">Nutrition Summary(per day)</h3>
			<div className="mb-4">
				{(() => {
					const over = (actual: number, goal: number) => actual > goal * 1.01;
					const under = (actual: number, goal: number) => actual < goal * 0.99;
					const getValueColor = (actual: number, goal: number) => over(actual, goal) ? "text-green-600" : "text-white";
					const getGoalColor = (actual: number, goal: number) => over(actual, goal) ? "text-white" : "text-white";
					const renderRow = (label: string, actual: number, goal: number) => (
						<div className="flex justify-between">
							<span>{label}</span>
							<span>
								<span className={getValueColor(actual, goal)}>{actual.toFixed(0)}</span>
								<span className="text-neutral-400"> / </span>
								<span className={getGoalColor(actual, goal)}>{goal.toFixed(0)}</span>
							</span>
						</div>
					);
					return (
						<>
							{renderRow("Total kcal:", nutritionSummary.totalKcal / days, totalGoal.kcal / days)}
							{renderRow("Protein (g):", nutritionSummary.totalProtein / days, totalGoal.protein / days)}
							{renderRow("Fat (g):", nutritionSummary.totalFat / days, totalGoal.fat / days)}
							{renderRow("Carbs (g):", nutritionSummary.totalCarbs / days, totalGoal.carbs / days)}
						</>
					);
				})()}
			</div>
			<div className="mb-4">
				{isWithinGoal(nutritionSummary.totalKcal, totalGoal.kcal) &&
					isWithinGoal(nutritionSummary.totalProtein, totalGoal.protein) &&
					isWithinGoal(nutritionSummary.totalFat, totalGoal.fat) &&
					isWithinGoal(nutritionSummary.totalCarbs, totalGoal.carbs) && (
						<div className="text-green-600 font-semibold">Your plan matches your goal! ✅</div>
				)}
				{(nutritionSummary.totalProtein > totalGoal.protein * 1.05) && (
					<div className="text-yellow-600 mt-2">Protein is over the goal by more than 5%. Consider removing some protein sources.</div>
				)}
				{(nutritionSummary.totalKcal > totalGoal.kcal * 1.05) && (
					<div className="text-yellow-600 mt-2">Calories are over the goal by more than 5%. Consider reducing portions.</div>
				)}
			</div>
			<button
				className="rounded bg-yellow-600 dark:bg-yellow-400 px-6 py-2 text-xs font-semibold text-white dark:text-black hover:bg-yellow-700 dark:hover:bg-yellow-300 justify-center transition mx-auto block"
				onClick={onBack}
			>Back to Inventory</button>
		</div>
	);
};

export default SummaryScreen;
