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

      {/* Features Section - Redesigned */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/50 to-white -z-10 rounded-3xl"></div>
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-yellow-100 hover:shadow-md transition-all hover:translate-y-[-4px] duration-300">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div className="font-bold text-lg mb-3">Beat the ATS</div>
              <p className="text-gray-600">
                Our AI identifies and incorporates key terms from job
                descriptions to help your resume pass automated screening
                systems.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-yellow-100 hover:shadow-md transition-all hover:translate-y-[-4px] duration-300">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="font-bold text-lg mb-3">
                Save hours of editing
              </div>
              <p className="text-gray-600">
                Generate tailored resumes in seconds instead of spending hours
                manually adjusting for each application.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-yellow-100 hover:shadow-md transition-all hover:translate-y-[-4px] duration-300">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div className="font-bold text-lg mb-3">
                Highlight relevant skills
              </div>
              <p className="text-gray-600">
                Automatically emphasize the experiences and skills that matter
                most for each specific position.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-yellow-100 hover:shadow-md transition-all hover:translate-y-[-4px] duration-300">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div className="font-bold text-lg mb-3">
                Track your applications
              </div>
              <p className="text-gray-600">
                Keep all your tailored resumes organized in one place for easy
                reference and follow-up.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial Section - Redesigned */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join thousands of job seekers who have transformed their job search
            with ResumeNow.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-yellow-100">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-amber-200 flex items-center justify-center text-amber-700 font-bold mr-4">
                A
              </div>
              <div>
                <p className="font-medium">Alex Chen</p>
                <p className="text-sm text-gray-600">
                  Computer Science Student, Stanford
                </p>
              </div>
            </div>
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-5 h-5 text-amber-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-800 mb-4">
              "I applied to 15 internships with the same resume and got zero
              responses. After using ResumeNow to customize for each role, I
              landed 4 interviews in just one week!"
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-yellow-100">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-amber-200 flex items-center justify-center text-amber-700 font-bold mr-4">
                J
              </div>
              <div>
                <p className="font-medium">Jessica Williams</p>
                <p className="text-sm text-gray-600">Marketing Professional</p>
              </div>
            </div>
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-5 h-5 text-amber-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-800 mb-4">
              "The ATS optimization feature is a game-changer. I finally started
              getting callbacks after months of silence. Worth every penny!"
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-yellow-100">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-amber-200 flex items-center justify-center text-amber-700 font-bold mr-4">
                M
              </div>
              <div>
                <p className="font-medium">Michael Johnson</p>
                <p className="text-sm text-gray-600">Software Engineer</p>
              </div>
            </div>
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-5 h-5 text-amber-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-800 mb-4">
              "I was skeptical at first, but the results speak for themselves.
              Landed my dream job at a FAANG company after tailoring my resume
              with ResumeNow."
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section - Redesigned */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-50 to-yellow-100 -z-10 rounded-3xl"></div>
        <div className="max-w-6xl mx-auto px-8 py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:max-w-xl">
              <h2 className="text-3xl font-bold mb-4">
                Ready to land more interviews?
              </h2>
              <p className="text-gray-700 mb-6">
                Join thousands of job seekers who have already increased their
                interview chances by 3x with ResumeNow.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <SignUpButton mode="modal">
                  <button className="inline-flex items-center px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-md transition-all duration-200 group shadow-sm hover:shadow">
                    Get started now
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </SignUpButton>
              </div>
              <p className="text-sm mt-4 text-gray-600">
                No credit card required • Free plan available
              </p>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-yellow-200 rounded-full opacity-50"></div>
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-amber-200 rounded-full opacity-50"></div>
                <div className="relative bg-white p-6 rounded-xl shadow-lg border border-yellow-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="w-64 h-64 bg-gray-100 rounded-md flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-24 w-24 text-amber-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
