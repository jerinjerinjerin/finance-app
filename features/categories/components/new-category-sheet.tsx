import { z } from "zod";
import { insertCategorieSchema } from "@/db/schema";
import { CategoryForm } from "@/features/categories/components/category-form";
import { useNewCategory } from "@/features/categories/hooks/use-new-categoriy";
import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";

const formSchema = insertCategorieSchema.pick({
    name: true,
});

type formValues = z.input<typeof formSchema>;

export const NewCategorySheet = () => {

    const {isOpen, onClose} = useNewCategory();

    const mutation = useCreateCategory();

    const onSubmit = (values: formValues) => {
        mutation.mutateAsync(values, {
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
                    New Category
                </SheetTitle>
                <SheetDescription>
                    Create a new category to organize your transaction.
                </SheetDescription>
            </SheetHeader>
            <CategoryForm
              onSubmit={onSubmit}
              disabled={mutation.isPending}
              defaultValues={{
                name:"",
              }}
            />
         </SheetContent>
        </Sheet>
    );
};