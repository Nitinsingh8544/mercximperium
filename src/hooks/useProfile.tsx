import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Profile {
  id: string;
  user_id: string;
  name: string | null;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      
      // If no profile exists, create one
      if (!data) {
        const defaultUsername = user.email?.split("@")[0] || "";
        const defaultName = defaultUsername.charAt(0).toUpperCase() + defaultUsername.slice(1) + " User";
        
        const { data: newProfile, error: insertError } = await supabase
          .from("profiles")
          .insert({
            user_id: user.id,
            username: defaultUsername,
            name: defaultName,
          })
          .select()
          .single();

        if (insertError) throw insertError;
        setProfile(newProfile);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (updates: Partial<Pick<Profile, "name" | "username" | "bio" | "avatar_url">>) => {
    if (!user || !profile) return { error: new Error("No user or profile") };

    try {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return { error: null };
    } catch (error) {
      console.error("Error updating profile:", error);
      return { error };
    }
  };

  return { profile, loading, updateProfile, refetchProfile: fetchProfile };
};
