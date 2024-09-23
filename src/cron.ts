import { getOldNews, getUsers } from "./supabase.ts";
import { getFiveDayAgoDate } from "./utils.ts";
import { identifiesWeekendNews, identifiesMostRelevantNews } from "./openai.ts";
import { generateEmailBody, sendWeeklyEmail } from "./send_email.ts";

async function sendWeeklyNews() {
  try {
    // Calcula a data de uma semana atrás
    const oneWeekAgo = getFiveDayAgoDate();

    // Busca as notícias antigas no Supabase
    const news = await getOldNews(oneWeekAgo);
    const users = await getUsers();

    if (news && news.length > 0) {
      const allTitles = news.map((n) => {
        return { id: n.id, title: n.title }});

      const idWeekendNews: number = await identifiesWeekendNews(allTitles)
      const weekendNews = news.filter((n) => n.id == idWeekendNews)
      
      const idsMostRelevantNews: string = await identifiesMostRelevantNews(allTitles, idWeekendNews)

      const idsMostRelevantNewsArray = idsMostRelevantNews.split(", ");
      const mostRelevantNews = news.filter((n) => idsMostRelevantNewsArray.includes(n.id.toString()));
      
      // Enviar email para cada usuário
      for (const user of users) {
        try {
          const emailBody = generateEmailBody(user.username, weekendNews, mostRelevantNews); // Função para gerar o corpo do email
          await sendWeeklyEmail(user.email, emailBody);
          console.log(`Email enviado para ${user.email}`);
        } catch (error) {
          console.error(`Erro ao enviar email para ${user.email}:`, error);
        }
      }      
    } else {
      console.log("Nenhuma notícia para transferir.");
    }
  } catch (error) {
    console.error("Erro durante a transferência de notícias:", error);
  }
}

Deno.cron("envio de notícias semanais", "0 10 * * 5", () => {
  console.log("Iniciando o cron job de envio de notícias semanais...");
  sendWeeklyNews();
  console.log("Cron job de envio de notícias semanais concluído.");
});

