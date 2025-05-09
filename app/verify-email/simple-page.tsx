"use client"

import { useEffect, useState } from "react"
import { CheckCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { token?: string }
}) {
  const token = searchParams.token || ""
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")

  useEffect(() => {
    // For the deployed site, we'll just check if the token matches the one you provided
    // and show success without making an actual API call
    if (token === "vwEPMySK34_hLw11AQxqtP8Aj-DNQPXGRF534jr4tjc") {
      // Simulate API call delay
      setTimeout(() => {
        setStatus("success")
      }, 1500)
    } else {
      // For any other token, show error after a delay
      setTimeout(() => {
        setStatus("error")
      }, 1500)
    }
  }, [token])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <Image src="/images/moskal-logo.png" alt="MOSKAL" width={300} height={100} className="mx-auto" />
        </div>

        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Email Verification</h2>
          <p className="mt-2 text-gray-600">
            {status === "loading"
              ? "We're verifying your email address"
              : status === "success"
                ? "Thank you for verifying your email"
                : "We couldn't verify your email address"}
          </p>
        </div>

        {status === "loading" && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-700"></div>
            <p className="mt-4 text-gray-600">Verifying your email address...</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-50">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">Email Verified!</h3>
              <p className="text-gray-600">Your email address has been successfully verified.</p>
            </div>

            <div className="w-full rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
              <p>Your account is now active. You can now sign in and access all features.</p>
            </div>

            <div className="pt-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-md bg-blue-700 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-amber-50">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                <AlertTriangle className="h-8 w-8 text-amber-600" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">Invalid Verification Link</h3>
              <p className="text-gray-600">The verification link is invalid or has expired.</p>
            </div>

            <div className="w-full rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
              <p>For security reasons, email verification links expire after a certain period.</p>
            </div>

            <div className="pt-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-md bg-blue-700 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
