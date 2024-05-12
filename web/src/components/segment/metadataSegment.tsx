import React, { useEffect, useState } from "react";
import { Card, CardContent } from "~/components/ui/card";
// import { Table, fetchDatabaseSchema } from ;
import { fetchDatabaseSchema, Table } from "~/api/databaseSchema";

const TableCard: React.FC<{ table: Table }> = ({ table }) => {
  return (
    <Card className="w-full min-w-[300px] max-w-xs m-2 border border-gray-300 bg-white text-black shadow-sm">
      <CardContent className="p-6 space-y-4 text-left justify-between flex flex-col">
        <h3 className="text-xl font-bold">{table.name}</h3>
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="text-left font-medium">Attribute</th>
              <th className="text-left font-medium">Type</th>
            </tr>
          </thead>
          <tbody>
            {table.attributes.map((attr, index) => (
              <tr key={index}>
                <td>{attr.name}</td>
                <td>{attr.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

const DatabaseSchema = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSchemaData = async () => {
      const data = await fetchDatabaseSchema();
      setTables(data);
      setLoading(false);
    };

    fetchSchemaData();
  }, []);

  return loading ? (
    <p>Loading...</p>
  ) : (
    <div className="flex flex-wrap justify-center items-start gap-4">
      {tables.map((table, index) => (
        <TableCard key={index} table={table} />
      ))}
    </div>
  );
};

export default DatabaseSchema;
