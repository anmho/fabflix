import axios from "axios";

export interface Attribute {
  name: string;
  type: string;
}

export interface Table {
  name: string;
  attributes: Attribute[];
}

export async function fetchDatabaseSchema(): Promise<Table[]> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/getDatabaseSchema`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch schema", error);
    return [];
  }
}
