"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2, Mail, XCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [errorType, setErrorType] = useState<"user_not_found" | "server" | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset states
    setError(null)
    setErrorType(null)

    if (!email) {
      setError("Email is required")
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/v1/auth/forgot-password', {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Check for specific error types
        if (data.detail === "User not found") {
          setErrorType("user_not_found")
          throw new Error("We couldn't find an account with that email address")
        } else {
          setErrorType("server")
          throw new Error(data.detail || "Failed to send reset link")
        }
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-50">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">Check Your Email</h3>
          <p className="text-gray-600">We've sent a password reset link to</p>
          <p className="font-medium text-gray-900">{email}</p>
        </div>

        <div className="w-full rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
          <p>
            If an account exists with this email, you'll receive a password reset link shortly. Please check your inbox
            and spam folder.
          </p>
        </div>

        <div className="pt-4">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md bg-blue-700 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Back to Login
          </Link>
        </div>

        <p className="text-sm text-gray-500">
          Didn't receive the email? Check your spam folder or{" "}
          <button onClick={() => setSuccess(false)} className="font-medium text-blue-600 hover:text-blue-500">
            try another email
          </button>
        </p>
      </div>
    )
  }

  if (errorType === "user_not_found") {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-50">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">Account Not Found</h3>
          <p className="text-gray-600">We couldn't find an account with</p>
          <p className="font-medium text-gray-900">{email}</p>
        </div>

        <div className="w-full rounded-lg bg-red-50 p-4 text-sm text-red-800">
          <p>
            Please check if you've entered the correct email address or{" "}
            <Link href="/signup" className="font-medium underline">
              create a new account
            </Link>
            .
          </p>
        </div>

        <div className="pt-4 space-x-4">
          <button
            onClick={() => {
              setErrorType(null)
              setError(null)
            }}
            className="inline-flex items-center justify-center rounded-md bg-blue-700 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Try Again
          </button>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Back to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && errorType === "server" && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email <span className="text-blue-600">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email business email"
          required
          className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className={`mt-6 w-full rounded-md border border-transparent py-3 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          loading || !email ? "cursor-not-allowed bg-gray-300" : "bg-blue-700 hover:bg-blue-800 focus:ring-blue-500"
        }`}
        disabled={loading || !email}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
            Sending Reset Link...
          </>
        ) : (
          "Send Reset Link"
        )}
      </button>

      <div className="mt-4 text-center text-sm">
        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
          Back to Login
        </Link>
      </div>
    </form>
  )
}
