"use server";

import { revalidatePath } from "next/cache";

import { createCustomer, deleteCustomer } from "@/lib/services/customers.service";

type CreateCustomerFormState = {
  success: boolean;
  message: string | null;
};

const defaultState: CreateCustomerFormState = {
  success: false,
  message: null,
};

export async function createCustomerAction(
  _prevState: CreateCustomerFormState,
  formData: FormData,
): Promise<CreateCustomerFormState> {
  try {
    const payload = {
      displayName: formData.get("displayName"),
      phone: formData.get("phone"),
      city: formData.get("city") || undefined,
      status: formData.get("status"),
      tags: (formData.get("tags") as string | null)
        ?.split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      notes: formData.get("notes") || undefined,
    };

    await createCustomer(payload);
    revalidatePath("/dashboard/customers");

    return {
      success: true,
      message: "مشتری با موفقیت ثبت شد.",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "ثبت مشتری با خطا مواجه شد.";
    return {
      success: false,
      message,
    };
  }
}

export { defaultState as createCustomerDefaultState };

export async function deleteCustomerAction(customerId: string) {
  try {
    await deleteCustomer(customerId);
    revalidatePath("/dashboard/customers");
    return { success: true, message: "مشتری حذف شد." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "حذف مشتری با خطا مواجه شد.";
    return { success: false, message };
  }
}


