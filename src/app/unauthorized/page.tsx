"use client";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Unauthorized() {
    const router = useRouter();
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <span className="text-xs font-bold tracking-wider text-red-600 uppercase bg-red-50 px-3 py-1 rounded-full border border-red-200">
          Error 403
        </span>

        <h1 className="text-2xl font-bold text-slate-800 mt-4 mb-2">
          Access Denied
        </h1>

        <p className="text-slate-500 text-sm leading-relaxed mb-8">
          You do not have permission to access this page. Please contact your
          administrator or return to the Home page.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition-all active:scale-95 shadow-md shadow-slate-900/10"
          >
            <Home className="w-4 h-4" />
            Go to Home
          </Link>

          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center
             gap-2 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700
              font-medium text-sm hover:bg-slate-200 transition-all active:scale-95 border border-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
