import { notFound } from "next/navigation";

import { PayrollDetailsPage } from "@/features/payroll/components/PayrollDetailsPage";
import { payrollService } from "@/services/payroll/payroll.service";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function PayrollDetails({
  params,
}: Props) {
  const { id } = await params;

  const payroll = await payrollService.getById(id);

  if (!payroll) {
    notFound();
  }

  return <PayrollDetailsPage payroll={payroll} />;
}