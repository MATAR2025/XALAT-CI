import { supabase } from "../lib/supabaseClient";

/**
 * Upload de l'image de signalement dans le Storage
 */
export async function uploadReportImage(file: File, userId: string) {
  const fileExt = file.name.split('.').pop();
  const filePath = `reports/${userId}/${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('reports')
    .upload(filePath, file);
    
  if (error) throw error;
  
  // On récupère l'URL publique pour pouvoir l'afficher plus tard
  const { data: { publicUrl } } = supabase.storage
    .from('reports')
    .getPublicUrl(filePath);
    
  return publicUrl;
}

/**
 * Insertion du signalement dans la table 'reports'
 */
export async function insertReport({ category, lat, lng, user_id, image_url }: { category: string, lat: number, lng: number, user_id: string, image_url: string }) {
  const { data, error } = await supabase.from('reports').insert([
    { 
      category, 
      lat, 
      lng, 
      user_id, 
      image_url,
      status: 'pending' // On ajoute un statut par défaut
    }
  ]).select(); // .select() est nécessaire pour retourner les données insérées en Next.js
  
  if (error) throw error;
  return data;
}

/**
 * Récupération des données utilisateur depuis la table 'profiles'
 */
export async function getUserData(userId: string) {
  // Correction : On utilise 'profiles' au lieu de 'users' pour correspondre à ton SQL
  const { data, error } = await supabase
    .from('profiles')
    .select('nom, prenom, quartier, points_civiques')
    .eq('id', userId)
    .single();
    
  if (error) throw error;

  // On formate pour que ton Dashboard reçoive les bons noms de variables
  return {
    name: `${data.prenom} ${data.nom}`,
    neighborhood: data.quartier,
    points: data.points_civiques
  };
}

/**
 * Sauvegarde des conversations du SenBot
 */
export async function saveSenBotChat({ user_id, question, response }: { user_id: string, question: string, response: string }) {
  // Correction : Les colonnes SQL étaient message_user et reponse_bot dans mon script précédent
  const { data, error } = await supabase.from('senbot_chats').insert([
    { 
      user_id, 
      message_user: question, 
      reponse_bot: response 
    }
  ]).select();
  
  if (error) throw error;
  return data;
}