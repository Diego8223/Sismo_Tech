import { useEffect, useState } from "react";

export function useFetch<T>(url: string, initialValue: T) {
  const [data, setData] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error("No fue posible consultar la información.");
        return response.json();
      })
      .then((result) => active && setData(result))
      .catch((err: Error) => active && setError(err.message))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [url]);

  return { data, loading, error };
}
