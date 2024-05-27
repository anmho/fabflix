import { getApiClient } from "./http";

export const getGenres = async () => {
  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/genres`, {
  //   credentials: "include",
  // });

  const http = getApiClient();
  const res = await http.get("/genres");
  // const data = await res.json();

  // console.log(data);

  return res.data;
};
