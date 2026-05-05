import MainFooter from "@/components/footer/MainFooter";
import HomeHeader from "@/components/headers/HomeHeader";

export default function TrainingProgramsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HomeHeader showTraining={false} />
      {children}
      <MainFooter />
    </>
  );
}
