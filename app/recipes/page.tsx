import Image from "next/image";

const recipes = [
	{
		title: "Protein Pancakes",
		image: "/recipe-pancakes.jpg",
		description: "Fluffy, high-protein pancakes perfect for a post-workout breakfast.",
	},
	{
		title: "Chicken Power Bowl",
		image: "/recipe-chicken-bowl.jpg",
		description: "A balanced bowl with grilled chicken, quinoa, and fresh veggies.",
	},
	{
		title: "Overnight Oats",
		image: "/recipe-oats.jpg",
		description: "Quick, nutritious oats you can prep the night before for busy mornings.",
	},
];

export default function Recipes() {
	return (
		<>
			<section className="w-full flex flex-col items-center justify-center py-16 px-4">
				<h1 className="text-4xl md:text-5xl font-bold text-center mb-10 text-neutral-900 dark:text-neutral-50">Recipes</h1>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full mx-auto">
					{recipes.map((recipe) => (
						<div
							key={recipe.title}
							className="rounded-lg bg-white/80 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col items-center p-6"
						>
							<div className="w-40 h-40 relative mb-4">
								<Image
									src={recipe.image}
									alt={recipe.title}
									fill
									className="object-cover rounded-md border border-neutral-200 dark:border-neutral-700"
								/>
							</div>
							<h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 text-center mb-2">
								{recipe.title}
							</h2>
							<p className="text-neutral-700 dark:text-neutral-300 text-center text-base">
								{recipe.description}
							</p>
						</div>
					))}
				</div>
			</section>
		</>
	);
}
