import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parse } from 'date-fns';
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ImportTable } from "./import-table";
import { convertAmountToMiliunits } from "@/lib/utils";

const dateFormat = "yyyy-MM-dd HH:mm:ss";
const outputFormat = "yyyy-MM-dd";

const requireOptins = ["amount", "date", "payee"];

interface SelectColumnsState {
  [key: string]: string | null;
}

type Props = {
  data: string[][];
  onCancel: () => void;
  onSubmit: (data: any) => void;
};

export const ImportCard = ({ data, onCancel, onSubmit }: Props) => {
  const [selectedColumns, setSelectedColumns] = useState<SelectColumnsState>(
    {}
  );
  const headers = data && data.length > 0 ? data[0] : [];
  const body = data && data.length > 1 ? data.slice(1) : [];

  const onTableHeadSelectChange = (
    columnIndex: number,
    value: string | null
  ) => {
    setSelectedColumns((prev) => {
      const newSelectedColumns = { ...prev };

      for (const key in newSelectedColumns) {
        if (newSelectedColumns[key] === value) {
          newSelectedColumns[key] = null;
        }
      }

      if (value === "skip") {
        value = null;
      }

      newSelectedColumns[`column_${columnIndex}`] = value;
      return newSelectedColumns;
    });
  };

  const progress = Object.values(selectedColumns).filter(Boolean).length;

  const handleContuine = () => {
    const getColemIndex = (column: string) => {

      return column.split("_")[1];
  }

  const mappedData = {
    headers: headers.map((_header, index) => {
      const columIndex = getColemIndex(`column_${index}`)
      return selectedColumns[`column_${columIndex}`] || null;
    }),

    body:body.map((row) => {
      const transFormedRow = row.map((cell, index) => {
        const columnIndex = getColemIndex(`column_${index}`);
        return selectedColumns[`column_${columnIndex}`] ? cell : null;
      });

      return transFormedRow.every((item) => item === null)
      ? [] : transFormedRow;
    }).filter((row) => row.length > 0),
  }
  const arrayData = mappedData.body.map((row) => {
    return row.reduce((acc: any, cell, index) => {
      const header = mappedData.headers[index];
      if(header != null) {
        acc[header] = cell;
      }
      return acc;
    },{})
  })
  const formattedData = arrayData.map((item) =>({
    ...item,
    amount: convertAmountToMiliunits(parseFloat(item.amount)),
    date: format((item.date, dateFormat, new Date()), outputFormat)
  }))
  //console.log({ formattedData });
  onSubmit(formattedData);
}

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader
          className="gap-y-2 lg:flex-row 
            lg:items-center lg:justify-between"
        >
          <CardTitle className="text-xl line-clamp-1">
            Import Transactions
          </CardTitle>
          <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
            <Button 
              size={"sm"} 
              onClick={onCancel}
              className="w-full lg:w-auto"
            >
              Cancel
            </Button>
            <Button
               size={"sm"}
               disabled={
                  progress < requireOptins.length 
               }
               onClick={handleContuine}
               className="w-full lg:w-auto"
            >
              Continue ({progress} / {requireOptins.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ImportTable
            headers={headers}
            body={body}
            selectedColumns={selectedColumns}
            onTableHeadSelectChange={onTableHeadSelectChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};
