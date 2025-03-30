import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SignUpButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="py-16 flex flex-col min-h-[90vh] space-y-24">
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center">
        <div className="space-y-6 max-w-2xl">
          <h1 className="text-5xl font-bold tracking-tight leading-tight">
            Your resume, optimized for{" "}
            <span className="text-amber-500">every application</span>
          </h1>

          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Stop sending the same resume everywhere. Our AI tailors your
            experience to match each job description, increasing your interview
            chances by 3x.
          </p>

          <div className="pt-6">
            <SignUpButton mode="modal">
              <button className="inline-flex items-center px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-md transition-all duration-200 group shadow-sm hover:shadow">
                Create your first tailored resume
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </SignUpButton>
            <p className="text-xs mt-3 text-gray-500">
              Takes just 2 minutes • No credit card required
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 border border-yellow-200 rounded-lg bg-yellow-50/50 hover:shadow-md transition-all hover:translate-y-[-2px] duration-200">
          <div className="font-semibold text-lg mb-3">Beat the ATS</div>
          <p className="text-gray-600">
            Our AI identifies and incorporates key terms from job descriptions
            to help your resume pass automated screening systems.
          </p>
        </div>

        <div className="p-8 border border-yellow-200 rounded-lg bg-yellow-50/50 hover:shadow-md transition-all hover:translate-y-[-2px] duration-200">
          <div className="font-semibold text-lg mb-3">
            Save hours of editing
          </div>
          <p className="text-gray-600">
            Generate tailored resumes in seconds instead of spending hours
            manually adjusting for each application.
          </p>
        </div>

        <div className="p-8 border border-yellow-200 rounded-lg bg-yellow-50/50 hover:shadow-md transition-all hover:translate-y-[-2px] duration-200">
          <div className="font-semibold text-lg mb-3">
            Highlight relevant skills
          </div>
          <p className="text-gray-600">
            Automatically emphasize the experiences and skills that matter most
            for each specific position.
          </p>
        </div>

        <div className="p-8 border border-yellow-200 rounded-lg bg-yellow-50/50 hover:shadow-md transition-all hover:translate-y-[-2px] duration-200">
          <div className="font-semibold text-lg mb-3">
            Track your applications
          </div>
          <p className="text-gray-600">
            Keep all your tailored resumes organized in one place for easy
            reference and follow-up.
          </p>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="p-10 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200 max-w-3xl mx-auto shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-amber-200 flex items-center justify-center text-amber-700 font-bold mb-6">
            A
          </div>
          <p className="text-xl font-medium text-gray-800 italic mb-6 leading-relaxed">
            "I applied to 15 internships with the same resume and got zero
            responses. After using ResumeNow to customize for each role, I
            landed 4 interviews in just one week!"
          </p>
          <div className="flex flex-col items-center">
            <p className="font-medium">Alex Chen</p>
            <p className="text-sm text-gray-600">
              Computer Science Student, Stanford
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-6">
          Ready to land more interviews?
        </h2>
        <SignUpButton mode="modal">
          <button className="inline-flex items-center px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-md transition-all duration-200 group shadow-sm hover:shadow">
            Get started now
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </SignUpButton>
      </div>
    </main>
  );
}
