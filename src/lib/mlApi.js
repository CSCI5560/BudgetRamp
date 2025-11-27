export async function runMLTask(task, input) {
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_FUNCTION_URL}/unified-ml`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ task, input }),
    }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Prediction failed");

  return data.result;
}
