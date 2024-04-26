export const getGenres = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/genres`, {
    credentials: "include",
  });
  const data = await res.json();

  console.log(data);

  return data;
};
