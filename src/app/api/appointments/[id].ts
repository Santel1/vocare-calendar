// import { supabase } from "@/app/server/utils/supabase/supabase";

// export default async function handler(req, res) {
//   const { id } = req.query;

//   if (req.method === "PATCH") {
//     const { is_done } = req.body;

//     const { error } = await supabase
//       .from("appointments")
//       .update({ is_done })
//       .eq("id", id);

//     if (error) return res.status(500).json({ error: error.message });

//     return res.status(200).json({ success: true });
//   }

//   res.status(405).end();
// }
