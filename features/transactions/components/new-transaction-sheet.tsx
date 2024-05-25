import { z } from "zod";
import { insertTransactionSchema } from "@/db/schema";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction"; 
import { useCreateTransaction } from "@/features/transactions/api/use-create-transaction";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";

import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useCreateCategory } from "@/features/categories/api/use-create-category";

import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";


import { TransactionForm } from "@/features/transactions/components/transaction-form";
import { Loader2 } from "lucide-react";

const formSchema = insertTransactionSchema.omit({
    id: true,
});

type formValues = z.input<typeof formSchema>;

export const NewTransactionSheet = () => {

    const {isOpen, onClose} = useNewTransaction();

    const createMutation = useCreateTransaction();

    const categoryQuery = useGetCategories();
    const categoryMutation = useCreateCategory();

    const onCreateCategory = (name:string) => categoryMutation.mutate({
        name
    });

    const categoryOptions = (categoryQuery.data ?? []).map((catagory) =>({
        label: catagory.name,
        value: catagory.id,
    }));


    const accountQuery = useGetAccounts();
    const accountMutation = useCreateAccount();

    const onCreateAccount = (name:string) => accountMutation.mutate({
        name
    });

    const accountOptions = (accountQuery.data ?? []).map((account) =>({
        label: account.name,
        value: account.id,
    }));

    const isPending = createMutation.isPending || 
    categoryMutation.isPending || accountMutation.isPending;

    const isLoading = categoryQuery.isLoading || accountQuery.isLoading;

    const onSubmit = (values: formValues) => {
        createMutation.mutate(values, {
            onSuccess: () => {
                onClose();
            }
        });
    }

    return(
        <Sheet open={isOpen} onOpenChange={onClose}>
         <SheetContent className = "spact-y-4">
            <SheetHeader>
                <SheetTitle>
                    New Transactions
                </SheetTitle>
                <SheetDescription>
                    Add a new transactions.
                </SheetDescription>
            </SheetHeader>
        

          {
            isLoading ? (
                <div className="absolute inset-0 flex items-center
                justify-center
                ">
                    <Loader2
                     className="size-4 text-muted-foreground animate-spin"
                    />
                </div>
            ):(

                <TransactionForm
                  onSubmit={onSubmit}
                  disabled={isPending}
                  categoryOptions={categoryOptions}
                  accountOptions={accountOptions}
                  onCreateCategory={onCreateCategory}
                  onCreateAccount={onCreateAccount}
                />
            )
          }

         </SheetContent>
        </Sheet>
    );
};