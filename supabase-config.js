// Browser-safe project URL and anon/public key only. Never place the service-role key here.
export const supabaseConfig = {
  url: 'https://YOUR_PROJECT.supabase.co',
  anonKey: 'YOUR_SUPABASE_ANON_PUBLIC_KEY',
  saveGameFunction: 'https://YOUR_PROJECT.supabase.co/functions/v1/save-game',
  profileFunction: 'https://YOUR_PROJECT.supabase.co/functions/v1/player-profile'
};
