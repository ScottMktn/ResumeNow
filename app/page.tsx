import ResumeForm from "@/components/homePage/resumeForm";

export default function Home() {
  return (
    <main id="hero" className="mt-16 flex flex-col space-y-4">
      <h1 className="text-2xl font-bold leading-relaxed">
        <span className="bg-violet-900 text-white px-2 py-1 -mx-2 -my-1 rounded-lg">
          ResumeNow
        </span>
        <span className="ml-4">- Personalized Resume Generator</span>
      </h1>
      <p className="text-md">
        Resumes that are personalized to a specific job application are{" "}
        <span className="text-violet-700 font-bold">75% more likely</span> to
        pass the initial screening. Let AI personalize it for you.
      </p>
      <div className="pt-16">{/* <ResumeForm /> */}</div>
    </main>
  );
}
