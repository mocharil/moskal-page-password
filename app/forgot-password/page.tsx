import { ForgotPasswordForm } from "./forgot-password-form"
import Image from "next/image"

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <Image src="/images/moskal-logo.png" alt="MOSKAL" width={300} height={100} className="mx-auto" />
        </div>

        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Forgot Password</h2>
          <p className="mt-2 text-gray-600">Please enter your email to receive a password reset link.</p>
        </div>

        <ForgotPasswordForm />
      </div>
    </div>
  )
}
