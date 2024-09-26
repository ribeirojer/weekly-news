import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";
const env = await load();

const supabaseUrl = env.SUPABASE_URL || Deno.env.get("SUPABASE_URL");
const supabaseKey = env.SUPABASE_KEY || Deno.env.get("SUPABASE_KEY");

if (!supabaseUrl) {
	console.error("supabaseUrl não configurada.");
	Deno.exit(1);
}
if (!supabaseKey) {
	console.error("supabaseKey não configurada.");
	Deno.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

export interface INews {
	id: number;
	title: string;
	content: string;
	author: string;
	tags: string[];
	cover_image_url: string;
	friendly_url: string;
	created_at: string;
	updated_at: string;
	category: string;
	small_cover_image_url: string;
}

// Função para buscar notícias mais recentes que uma semana
export async function getOldNews(oneWeekAgo: string) {
	try {
		const { data: news, error } = await supabase
			.from("news")
			.select("*")
			.gt("created_at", oneWeekAgo);

		if (error)
			throw new Error(`Erro ao buscar notícias do Supabase: ${error.message}`);
		return news as INews[];
	} catch (error) {
		throw new Error(error.message);
	}
}

export async function getUsers() {
	try {
		const { data: users, error } = await supabase
			.from("users")
			.select("username, email");

		if (error)
			throw new Error(`Erro ao buscar usuários do Supabase: ${error.message}`);
		return users;
	} catch (error) {
		throw new Error(error.message);
	}
}
