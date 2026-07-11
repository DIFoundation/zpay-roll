import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function PageContainer({ children }: Props) {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      {children}
    </div>
  );
}