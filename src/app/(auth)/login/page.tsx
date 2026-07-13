import { AuthCard } from "@/features/auth/components/AuthCard";
import { GoogleButton } from "@/features/auth/components/GoogleButton";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { AuthDivider } from "@/components/common/AuthDivider";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <AuthCard
        title="Welcome back"
        description="Sign in to continue to zPay."
      >
        <GoogleButton />

        <AuthDivider />

        <LoginForm />
      </AuthCard>
    </main>
  );
}