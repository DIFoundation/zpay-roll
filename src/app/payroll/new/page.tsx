"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useForm, useFieldArray, Controller, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { toast } from "sonner";
import {
  Upload,
  Plus,
  Trash2,
  FileSpreadsheet,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { createBatch } from "@/lib/api";

// ─── Types ─────────────────────────────────────────────────────────────────

type Recipient = {
  name: string;
  address: string;
  amount: string;
  memo: string;
};

const recipientSchema = z.object({
  name: z.string().optional(),
  address: z.string().min(1, "Address is required").regex(/^[zt]/, "Must be a valid Zcash address"),
  amount: z.string().min(1, "Amount is required").refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Must be > 0"),
  memo: z.string().optional(),
});

const formSchema = z.object({
  name: z.string().min(1, "Batch name is required"),
  senderAddress: z.string().min(1, "Sender address is required").regex(/^[zt]/, "Must be a valid Zcash address"),
  memo: z.string().optional(),
  recipients: z.array(recipientSchema).min(1, "At least one recipient is required"),
});

type FormValues = z.infer<typeof formSchema>;

// ─── File Upload Zone ───────────────────────────────────────────────────────

function DropZone({ onData }: { onData: (rows: Recipient[]) => void }) {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    (file: File) => {
      setFileName(file.name);
      const ext = file.name.split(".").pop()?.toLowerCase();

      if (ext === "csv") {
        Papa.parse<Record<string, string>>(file, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const rows = result.data.map((row) => ({
              name: row["name"] ?? row["Name"] ?? "",
              address: row["address"] ?? row["Address"] ?? row["wallet"] ?? "",
              amount: row["amount"] ?? row["Amount"] ?? row["zec"] ?? row["ZEC"] ?? "",
              memo: row["memo"] ?? row["Memo"] ?? row["note"] ?? "",
            }));
            onData(rows);
            toast.success(`Imported ${rows.length} recipients from CSV`);
          },
          error: () => toast.error("Failed to parse CSV"),
        });
      } else if (ext === "xlsx" || ext === "xls") {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = e.target?.result;
            const wb = XLSX.read(data, { type: "array" });
            const ws = wb.Sheets[wb.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: "" });
            const rows = json.map((row) => ({
              name: String(row["name"] ?? row["Name"] ?? ""),
              address: String(row["address"] ?? row["Address"] ?? row["wallet"] ?? ""),
              amount: String(row["amount"] ?? row["Amount"] ?? row["zec"] ?? row["ZEC"] ?? ""),
              memo: String(row["memo"] ?? row["Memo"] ?? row["note"] ?? ""),
            }));
            onData(rows);
            toast.success(`Imported ${rows.length} recipients from Excel`);
          } catch {
            toast.error("Failed to parse Excel file");
          }
        };
        reader.readAsArrayBuffer(file as Blob);
      } else {
        toast.error("Please upload a CSV or Excel (.xlsx) file");
      }
    },
    [onData]
  );

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) processFile(file);
      }}
      className={cn(
        "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors duration-200",
        dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) processFile(file);
        }}
      />
      <FileSpreadsheet className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
      {fileName ? (
        <div className="space-y-1">
          <p className="text-sm font-medium text-primary">{fileName}</p>
          <p className="text-xs text-muted-foreground">Click to replace</p>
        </div>
      ) : (
        <div className="space-y-1">
          <p className="text-sm font-medium">Drop CSV or Excel file here</p>
          <p className="text-xs text-muted-foreground">or click to browse · Supports .csv and .xlsx</p>
          <p className="text-xs text-muted-foreground mt-2">Columns: name, address, amount, memo</p>
        </div>
      )}
    </div>
  );
}

// ─── Recipient Row ──────────────────────────────────────────────────────────

function RecipientRow({
  index,
  onRemove,
  control,
  errors,
  showMemo,
  onToggleMemo,
}: {
  index: number;
  onRemove: () => void;
  control: Control<FormValues>;
  errors: Partial<Record<keyof Recipient, { message?: string }>>;
  showMemo: boolean;
  onToggleMemo: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.2 }}
      className="grid gap-2 p-3 rounded-lg bg-muted/30 border border-border"
    >
      <div className="grid grid-cols-[1fr_2fr_1fr_auto] gap-2 items-start">
        {/* Name */}
        <div>
          <Controller
            control={control}
            name={`recipients.${index}.name`}
            render={({ field }) => (
              <Input {...field} placeholder="Name (optional)" className="h-8 text-sm" />
            )}
          />
        </div>

        {/* Address */}
        <div>
          <Controller
            control={control}
            name={`recipients.${index}.address`}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Zcash address (z... or t...)"
                className={cn("h-8 text-sm font-mono", errors.address && "border-destructive")}
              />
            )}
          />
          {errors.address && (
            <p className="text-xs text-destructive mt-0.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.address.message}
            </p>
          )}
        </div>

        {/* Amount */}
        <div>
          <Controller
            control={control}
            name={`recipients.${index}.amount`}
            render={({ field }) => (
              <div className="relative">
                <Input
                  {...field}
                  placeholder="0.0000"
                  className={cn("h-8 text-sm font-mono pr-10", errors.amount && "border-destructive")}
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">ZEC</span>
              </div>
            )}
          />
          {errors.amount && (
            <p className="text-xs text-destructive mt-0.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.amount.message}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-1 pt-0.5">
          <button
            type="button"
            onClick={onToggleMemo}
            className="text-muted-foreground hover:text-foreground p-1 rounded"
            title="Toggle memo"
          >
            {showMemo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="text-muted-foreground hover:text-destructive p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showMemo && (
        <Controller
          control={control}
          name={`recipients.${index}.memo`}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Memo (optional, shielded transactions only)"
              className="h-8 text-sm"
            />
          )}
        />
      )}
    </motion.div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function NewPayroll() {
  const router = useRouter();
  const [memoOpen, setMemoOpen] = useState<Record<number, boolean>>({});

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      senderAddress: "",
      memo: "",
      recipients: [{ name: "", address: "", amount: "", memo: "" }],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({ control, name: "recipients" });

  const recipients = watch("recipients");
  const totalZec = recipients.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);

  const handleFileData = (rows: Recipient[]) => {
    replace(rows.map((r) => ({ name: r.name, address: r.address, amount: r.amount, memo: r.memo })));
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const batchId = await createBatch({
        name: values.name,
        sender_address: values.senderAddress,
        memo: values.memo,
        recipients: values.recipients.map((r) => ({
          name: r.name ?? undefined,
          address: r.address,
          amount: parseFloat(r.amount),
          memo: r.memo ?? undefined,
        })),
      });
      toast.success("Payroll batch created!");
      router.push(`/payroll/${batchId}`);
    } catch {
      toast.error("Failed to create payroll batch");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className="text-2xl font-bold">New Payroll Batch</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Upload a spreadsheet or add recipients manually to create a Zcash payroll batch.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Batch Details */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">Batch Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Batch Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. July 2025 Payroll"
                  {...register("name")}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="senderAddress">Sender Zcash Address</Label>
                <Input
                  id="senderAddress"
                  placeholder="z... or t..."
                  className={cn("font-mono text-sm", errors.senderAddress ? "border-destructive" : "")}
                  {...register("senderAddress")}
                />
                {errors.senderAddress && (
                  <p className="text-xs text-destructive">{errors.senderAddress.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="memo">Batch Memo (optional)</Label>
              <Input id="memo" placeholder="e.g. Monthly payroll" {...register("memo")} />
            </div>
          </CardContent>
        </Card>

        {/* File Upload */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Upload className="w-4 h-4" /> Import from File
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DropZone onData={handleFileData} />
          </CardContent>
        </Card>

        {/* Recipients Table */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Recipients{" "}
                <Badge variant="secondary" className="ml-2">
                  {fields.length}
                </Badge>
              </CardTitle>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Total:</span>
                <span className="font-mono font-bold text-primary">{totalZec.toFixed(4)} ZEC</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {/* Column Headers */}
            <div className="grid grid-cols-[1fr_2fr_1fr_auto] gap-2 px-1">
              {["Name", "Address", "Amount", ""].map((h) => (
                <div key={h} className="text-xs font-medium text-muted-foreground">{h}</div>
              ))}
            </div>

            <AnimatePresence>
              {fields.map((field, i) => (
                <RecipientRow
                  key={field.id}
                  index={i}
                  onRemove={() => remove(i)}
                  control={control}
                  errors={(errors.recipients?.[i] as Partial<Record<keyof Recipient, { message?: string }>>) ?? {}}
                  showMemo={!!memoOpen[i]}
                  onToggleMemo={() => setMemoOpen((prev) => ({ ...prev, [i]: !prev[i] }))}
                />
              ))}
            </AnimatePresence>

            {errors.recipients && typeof errors.recipients.message === "string" && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.recipients.message}
              </p>
            )}

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => append({ name: "", address: "", amount: "", memo: "" })}
              className="mt-2"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Recipient
            </Button>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-sm text-muted-foreground">
            {fields.length} recipient{fields.length !== 1 ? "s" : ""} · {totalZec.toFixed(4)} ZEC total
          </div>
          <Button type="submit" disabled={isSubmitting} size="lg">
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...
              </>
            ) : (
              "Create Payroll Batch"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
