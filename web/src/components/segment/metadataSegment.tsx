import React from "react";
import Link from "next/link";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
interface Attribute {
  name: string;
  type: string;
}

interface Table {
  name: string;
  attributes: Attribute[];
}

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

        <div className="flex justify-end space-x-2"></div>
      </CardContent>
    </Card>
  );
};

const DatabaseSchema = () => {
  const tables: Table[] = [
    {
      name: "movies",
      attributes: [
        { name: "id", type: "VARCHAR(10)" },
        { name: "title", type: "VARCHAR(100)" },
        { name: "year", type: "INT" },
        { name: "director", type: "VARCHAR(100)" },
        { name: "price", type: "DECIMAL(10, 2)" },
      ],
    },
    {
      name: "stars",
      attributes: [
        { name: "id", type: "VARCHAR(10)" },
        { name: "name", type: "VARCHAR(100)" },
        { name: "birthYear", type: "INT" },
      ],
    },
    {
      name: "stars_in_movies",
      attributes: [
        { name: "starId", type: "VARCHAR(10)" },
        { name: "movieId", type: "VARCHAR(10)" },
      ],
    },
    {
      name: "genres",
      attributes: [
        { name: "id", type: "INT" },
        { name: "name", type: "VARCHAR(32)" },
      ],
    },
    {
      name: "genres_in_movies",
      attributes: [
        { name: "genreId", type: "INT" },
        { name: "movieId", type: "VARCHAR(10)" },
      ],
    },
    {
      name: "customers",
      attributes: [
        { name: "id", type: "INT" },
        { name: "firstName", type: "VARCHAR(50)" },
        { name: "lastName", type: "VARCHAR(50)" },
        { name: "ccId", type: "VARCHAR(20)" },
        { name: "address", type: "VARCHAR(200)" },
        { name: "email", type: "VARCHAR(50)" },
        { name: "password", type: "VARCHAR(20)" },
      ],
    },
    {
      name: "employees",
      attributes: [
        { name: "email", type: "VARCHAR(50)" },
        { name: "password", type: "VARCHAR(20)" },
        { name: "fullname", type: "VARCHAR(100)" },
      ],
    },
    {
      name: "sales",
      attributes: [
        { name: "id", type: "INT" },
        { name: "customerId", type: "INT" },
        { name: "movieId", type: "VARCHAR(10)" },
        { name: "saleDate", type: "DATE" },
        { name: "quantity", type: "INT" },
        { name: "invoiceAmount", type: "DECIMAL(10, 2)" },
      ],
    },
    {
      name: "creditcards",
      attributes: [
        { name: "id", type: "VARCHAR(20)" },
        { name: "firstname", type: "VARCHAR(50)" },
        { name: "lastname", type: "VARCHAR(50)" },
        { name: "expiration", type: "DATE" },
      ],
    },
    {
      name: "ratings",
      attributes: [
        { name: "movieId", type: "VARCHAR(10)" },
        { name: "rating", type: "FLOAT" },
        { name: "numVotes", type: "INT" },
      ],
    },
  ];

  return (
    <div className="flex flex-wrap justify-center items-start gap-4">
      {tables.map((table, index) => (
        <TableCard key={index} table={table} />
      ))}
    </div>
  );
};

export default DatabaseSchema;
