"use client";
import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card,
         CardContent,
         CardHeader,
         CardTitle    
 } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/data-table";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transactions";
import { columns } from "./columns";
import { UploadButton } from "./upload-button";
import { ImportCard } from "./import-card";

enum VARIANTS {
  LIST ="LIST",
  IMPORT= "IMPORT"
};


const INITIAL_IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: {},
};


const TransactionsPage = () => {

    const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
    const [importResult, setImportResult] = useState(INITIAL_IMPORT_RESULTS)

    const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) =>{
      console.log({results})
      setImportResult(results)
      setVariant(VARIANTS.IMPORT)
    }

    const onCancelImport = () => {
      setImportResult(INITIAL_IMPORT_RESULTS)
      setVariant(VARIANTS.LIST)
    }

    const newTransaction = useNewTransaction();
    const deleteTransactions = useBulkDeleteTransactions();
    const transationsQuery = useGetTransactions();
    const transactions = transationsQuery.data || [];

   

   const isDisabled = 
   transationsQuery.isLoading || deleteTransactions.isPending;

  if (transationsQuery.isLoading){
    return(
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
              <CardHeader>
                <Skeleton 
                  className="h-8 w-48"
                />
              </CardHeader> 
              <CardContent>
                  <div className="h-[500px] w-full flex
                  items-center justify-center">
                    <Loader2 
                     className="size-6 text-slate-300 animate-spin"
                    />
                  </div>
              </CardContent>
            </Card>
      </div>
    )
  }

   if (variant === VARIANTS.IMPORT){
    return(
      <>
        <ImportCard
          data={importResult.data}
          onCancel={onCancelImport}
          onSubmit={() => {}}
        />
      </>
    )
   }

    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row 
                lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                      Transactions History
                    </CardTitle>
                    <div className="flex items-center gap-x-2">
                      <Button 
                        size={'sm'}
                        onClick={newTransaction.onOpen}
                      >
                        
                          <Plus className="size-4 mr-2"/>
                          Add new
                      </Button>
                      <UploadButton
                        onUpload={onUpload}
                      />
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable 
                      filterKey="payee"
                      columns={columns} 
                      data={transactions}
                      onDelete={(row) => {
                        const ids = row.map((r) => r.original.id);
                        deleteTransactions.mutate({ids});
                      }}
                      disabled={isDisabled}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default TransactionsPage;