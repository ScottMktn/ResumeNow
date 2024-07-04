import ResumeForm from "@/components/homePage/resumeForm";

export default function Home() {
  return (
    <main id="hero" className="py-8 flex flex-col space-y-4 min-h-[90vh]">
      <h1 className="text-2xl font-bold">
        <span className="">
          Apply to jobs <span className="underline text-amber-500">faster</span>{" "}
          and with more{" "}
          <span className="underline text-amber-500">success</span>
        </span>
      </h1>
      <p className="text-md">
        Resumes that are personalized to a specific job application are more
        likely to pass the initial screening. Let AI personalize it for you.
      </p>

      <div className="pt-16">
        <ResumeForm />
      </div>
    </main>
  );
}
