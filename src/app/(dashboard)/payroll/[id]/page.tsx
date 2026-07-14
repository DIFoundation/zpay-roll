import { notFound } from "next/navigation";

import { PayrollDetailsPage } from "@/features/payroll/components/PayrollDetailsPage";
import { payrollService } from "@/services/payroll/payroll.service";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

// export default async function PayrollDetails({
//   params,
// }: Props) {
//   const { id } = await params;

//   const payroll = await payrollService.getById(id);

//   if (!payroll) {
//     notFound();
//   }

//   return <PayrollDetailsPage
//     control={control}
//     employees={employees}

//     payroll={payroll} 
//   />;
// }


export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <PayrollDetailsPage

      payroll={
        await payrollService.getById(id)
      }
    />
  );
}