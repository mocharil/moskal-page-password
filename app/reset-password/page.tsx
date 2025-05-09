import { Suspense } from "react"
import { ResetPasswordForm } from "./reset-password-form"
import Image from "next/image"

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string }
}) {
  const token = searchParams.token || ""

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <Image src="/images/moskal-logo.png" alt="MOSKAL" width={300} height={100} className="mx-auto" />
        </div>

        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Reset Password</h2>
          <p className="mt-2 text-gray-600">Please enter your new password below.</p>
        </div>

        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <ResetPasswordForm token={token} />
        </Suspense>
      </div>
    </div>
  )
}
