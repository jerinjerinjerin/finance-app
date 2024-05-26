import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead
} from "@/components/ui/table"

type Props = {
    headers: string[];
    body: string[][];
   selectedColumns: Record<string, string | null>;
    onTableHeadSelectChange: (columnIndex: number, value: string | null) => void;
}

export const ImportTable = ({
    headers,
    body,
   selectedColumns,
    onTableHeadSelectChange,
}:Props) => {
    return(
        <div className="rounded-md border overflow-hidden">
            <Table>
                <TableHeader className="bg-muted">
                    <TableRow>
                        {headers.map((header, index) => {
                            return(
                                <TableHead key={index}>
                                    {header}
                                </TableHead>
                            )
                        })}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {body.map((row: string[], index) =>(
                        <TableRow key={index}>
                            {row.map((cell, index) => {
                                return(
                                    <TableCell key={index}>
                                        {cell}
                                    </TableCell>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}