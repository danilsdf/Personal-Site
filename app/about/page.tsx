// app/page.tsx
import Image from "next/image";

export default function Home() {
  return (
    <>
      <section className="w-full flex flex-col items-center justify-center py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 text-neutral-900 dark:text-neutral-50">About Me</h1>
        <div className="flex flex-col md:flex-row items-center gap-10 max-w-4xl mx-auto">
          <div className="w-40 h-40 md:w-56 md:h-56 relative mb-6 md:mb-0">
            <Image
              src="/hero-face.png"
              alt="Danil Kravchenko portrait"
              fill
              className="object-cover rounded-full border border-neutral-200 dark:border-neutral-700"
              priority
            />
          </div>
          <div className="flex-1 text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
            <p>
              Hi! I’m Danil Kravchenko, a hybrid athlete and software engineer passionate about pushing boundaries both physically and mentally. My journey blends boxing, running, and strength training with a love for building clean, efficient web systems. Whether I’m in the gym or at the keyboard, I strive for excellence, discipline, and continuous growth.
            </p>
            <p className="mt-4">
              I believe in the power of hybrid performance—balancing endurance, power, and technical skill. In tech, I focus on crafting robust, scalable solutions that make a difference. Let’s connect and create something impactful together!
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
