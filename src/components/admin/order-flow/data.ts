import type { PurchaseFlowPage } from "@/lib/api/types/cms";
import { generateId } from "../ui/generateId";

export type OrderFlowStep = {
  id: string;
  label: string;
  visible: boolean;
  title: string;
  content: string;
};

export type BankInfo = {
  visible: boolean;
  accountName: string;
  bankName: string;
  bankCode: string;
  accountNumber: string;
  note: string;
};

export type ReminderInfo = {
  content: string;
};

export type EditableOrderFlow = {
  steps: OrderFlowStep[];
  bankInfo: BankInfo;
  reminder: ReminderInfo;
};

export function toEditableOrderFlow(doc: PurchaseFlowPage): EditableOrderFlow {
  return {
    steps: doc.steps.map((step, i) => ({
      id: generateId("step"),
      label: `步驟 ${i + 1}`,
      visible: step.visible,
      title: step.title,
      content: step.body_html,
    })),
    bankInfo: {
      visible: doc.payment.visible ?? true,
      accountName: doc.payment.account_name,
      bankName: doc.payment.bank_name,
      bankCode: doc.payment.bank_code,
      accountNumber: doc.payment.account_number,
      note: doc.payment.note_html,
    },
    reminder: { content: doc.reminder_html },
  };
}

/** `base` is the server copy; fields the editor doesn't know about are kept as they are. */
export function fromEditableOrderFlow(draft: EditableOrderFlow, base: PurchaseFlowPage): PurchaseFlowPage {
  const { steps, bankInfo, reminder } = draft;
  const keepVisible = bankInfo.visible === false || base.payment.visible !== undefined;
  return {
    ...base,
    steps: steps.map((step, i) => ({
      ...base.steps[i],
      title: step.title,
      visible: step.visible,
      body_html: step.content,
    })),
    payment: {
      ...base.payment,
      account_name: bankInfo.accountName,
      bank_name: bankInfo.bankName,
      bank_code: bankInfo.bankCode,
      account_number: bankInfo.accountNumber,
      note_html: bankInfo.note,
      // `visible` is not stored by the backend yet; only send it once it means something, so an
      // untouched page does not count as edited.
      ...(keepVisible ? { visible: bankInfo.visible } : {}),
    },
    reminder_html: reminder.content,
  };
}

/** Key-order-insensitive serialization, so a re-built doc compares equal to the server copy. */
function stableStringify(value: unknown): string {
  return JSON.stringify(value, (_key, val) =>
    val && typeof val === "object" && !Array.isArray(val)
      ? Object.fromEntries(Object.entries(val).sort(([a], [b]) => a.localeCompare(b)))
      : val
  );
}

export function isSameOrderFlow(a: PurchaseFlowPage, b: PurchaseFlowPage): boolean {
  return stableStringify(a) === stableStringify(b);
}
