"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle, Eye, EyeOff, Loader2, LockKeyhole, Clock, XCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [errorType, setErrorType] = useState<"expired_token" | "invalid_token" | "server" | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (success) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            router.push("/login")
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [success, router])

  // Check for empty or invalid token on component mount
  useEffect(() => {
    if (!token) {
      setErrorType("invalid_token")
      setError("Missing reset token. Please request a new password reset link.")
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset states
    setError(null)
    setErrorType(null)

    // Validate passwords
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    if (!token) {
      setErrorType("invalid_token")
      setError("Invalid or missing reset token")
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/v1/auth/reset-password', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          token,
          new_password: password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Check for specific error types
        if (data.detail === "Invalid or expired reset token") {
          setErrorType("expired_token")
          throw new Error("Your password reset link has expired")
        } else {
          setErrorType("server")
          throw new Error(data.detail || "Failed to reset password")
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
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-50">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">Password Reset Successful</h3>
          <p className="text-gray-600">Your password has been reset successfully.</p>
        </div>

        <div className="w-full rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
          <p>
            You will be redirected to the login page in <span className="font-bold">{countdown}</span> seconds.
          </p>
        </div>

        <div className="pt-4">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md bg-blue-700 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go to Login
          </Link>
        </div>

        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <LockKeyhole className="h-4 w-4" />
          <p>Your account is now secured with your new password</p>
        </div>
      </div>
    )
  }

  if (errorType === "expired_token") {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-amber-50">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <Clock className="h-8 w-8 text-amber-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">Link Expired</h3>
          <p className="text-gray-600">Your password reset link has expired</p>
        </div>

        <div className="w-full rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
          <p>
            For security reasons, password reset links expire after a certain period. Please request a new password
            reset link.
          </p>
        </div>

        <div className="pt-4">
          <Link
            href="/forgot-password"
            className="inline-flex items-center justify-center rounded-md bg-blue-700 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Request New Link
          </Link>
        </div>

        <div className="mt-4 text-center text-sm">
          <Link href={process.env.NEXT_PUBLIC_LOGIN_URL || "/login"} className="font-medium text-blue-600 hover:text-blue-500">
            Back to Login
          </Link>
        </div>
      </div>
    )
  }

  if (errorType === "invalid_token") {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-50">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">Invalid Reset Link</h3>
          <p className="text-gray-600">The password reset link is invalid or has been tampered with</p>
        </div>

        <div className="w-full rounded-lg bg-red-50 p-4 text-sm text-red-800">
          <p>
            For security reasons, we cannot process this password reset request. Please request a new password reset
            link.
          </p>
        </div>

        <div className="pt-4">
          <Link
            href="/forgot-password"
            className="inline-flex items-center justify-center rounded-md bg-blue-700 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Request New Link
          </Link>
        </div>

        <div className="mt-4 text-center text-sm">
          <Link href={process.env.NEXT_PUBLIC_LOGIN_URL || "/login"} className="font-medium text-blue-600 hover:text-blue-500">
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
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password <span className="text-blue-600">*</span>
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your new password"
            required
            minLength={8}
            className="w-full border-gray-300 pr-10 focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            type="button"
            className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
            <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
          Confirm Password <span className="text-blue-600">*</span>
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your new password"
            required
            minLength={8}
            className="w-full border-gray-300 pr-10 focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            type="button"
            className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            tabIndex={-1}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
            <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
          </button>
        </div>
      </div>

      <button
        type="submit"
        className={`mt-6 w-full rounded-md border border-transparent py-3 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          loading || !password || !confirmPassword || password !== confirmPassword
            ? "cursor-not-allowed bg-gray-300"
            : "bg-blue-700 hover:bg-blue-800 focus:ring-blue-500"
        }`}
        disabled={loading || !password || !confirmPassword || password !== confirmPassword}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
            Resetting Password...
          </>
        ) : (
          "Reset Password"
        )}
      </button>

      <div className="mt-4 text-center text-sm">
        <Link href={process.env.NEXT_PUBLIC_LOGIN_URL || "/login"} className="font-medium text-blue-600 hover:text-blue-500">
          Back to Login
        </Link>
      </div>
    </form>
  )
}
