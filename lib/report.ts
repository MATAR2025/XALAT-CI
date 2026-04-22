import { supabase } from "../lib/supabaseClient";

export async function uploadReportImage(file: File, userId: string) {
  const fileExt = file.name.split('.').pop();
  const filePath = `reports/${userId}/${Date.now()}.${fileExt}`;
  const { data, error } = await supabase.storage.from('reports').upload(filePath, file);
  if (error) throw error;
  return data.path;
}

export async function insertReport({ category, lat, lng, user_id, image_url }: { category: string, lat: number, lng: number, user_id: string, image_url: string }) {
  const { data, error } = await supabase.from('reports').insert([
    { category, lat, lng, user_id, image_url }
  ]);
  if (error) throw error;
  return data;
}
