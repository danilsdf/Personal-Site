import Image from "next/image";

const programs = [
	{
		title: "Hybrid Strength",
		image: "/program-hybrid.jpg",
	},
	{
		title: "Boxing Basics",
		image: "/program-boxing.jpg",
	},
	{
		title: "Endurance Builder",
		image: "/program-endurance.jpg",
	},
];

export default function Programs() {
	return (
		<>
			<section className="w-full flex flex-col items-center justify-center py-16 px-4">
				<h1 className="text-4xl md:text-5xl font-bold text-center mb-10 text-neutral-900 dark:text-neutral-50">Programs</h1>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full mx-auto">
					{programs.map((program) => (
						<div
							key={program.title}
							className="rounded-lg bg-white/80 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col items-center p-6"
						>
							<div className="w-40 h-40 relative mb-4">
								<Image
									src={program.image}
									alt={program.title}
									fill
									className="object-cover rounded-md border border-neutral-200 dark:border-neutral-700"
								/>
							</div>
							<h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 text-center">
								{program.title}
							</h2>
						</div>
					))}
				</div>
			</section>
		</>
	);
}
