import { AuthCard } from "@/features/auth/components/AuthCard";
import { GoogleButton } from "@/features/auth/components/GoogleButton";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { AuthDivider } from "@/components/common/AuthDivider";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <AuthCard
        title="Create your account"
        description="Start managing payroll privately with zPay."
      >
        <GoogleButton />

        <AuthDivider />

        <RegisterForm />
      </AuthCard>
    </main>
  );
}