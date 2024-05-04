const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface StarData {
  name: string;
  birthYear?: number;
}

export interface StarResponse {
  numMovies?: number;
  id?: string;
  name?: string;
  birthYear?: number;
  message: string;
  status: number;
}

export async function addStar(starData: StarData): Promise<StarResponse> {
  const { name, birthYear } = starData;
  const queryParams = new URLSearchParams();
  if (name) queryParams.append("name", name);
  if (birthYear) queryParams.append("birthYear", birthYear.toString());

  const url = `${API_URL}/addStar?${queryParams.toString()}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    credentials: "include",
  });

  const responseData = await response.json();
  console.log("responseData", responseData);
  if (!response.ok) {
    return { ...responseData };
  }

  return { ...responseData, status: 200, message: "Star successfully added." };
}
