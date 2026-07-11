import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 font-bold text-xl tracking-tight"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
        Z
      </div>

      <span>zPay</span>
    </Link>
  );
}