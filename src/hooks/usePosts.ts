import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type MediaType = Database["public"]["Enums"]["media_type"];
type CreatorType = Database["public"]["Enums"]["creator_type"];

export interface CreatePostData {
  title: string;
  content: string;
  category: CreatorType;
  subcategory_id?: string;
  media_type: MediaType;
  media_url?: string;
  thumbnail_url?: string;
  tags: string[];
  is_tokenized: boolean;
  token_reward: number;
  is_published: boolean;
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postData: CreatePostData) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("You must be logged in to create a post");
      }

      const { data, error } = await supabase
        .from("posts")
        .insert({
          author_id: user.id,
          content: postData.content,
          category: postData.category,
          media_type: postData.media_type,
          media_url: postData.media_url,
          thumbnail_url: postData.thumbnail_url,
          tags: postData.tags,
          is_tokenized: postData.is_tokenized,
          token_reward: postData.token_reward,
          is_published: postData.is_published,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
