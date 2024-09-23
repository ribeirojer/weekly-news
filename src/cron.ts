import { getOldNews, getUsers } from "./supabase.ts";
import { getFiveDayAgoDate } from "./utils.ts";
import { getWeekendNewsId, getRelevantNewsIds } from "./openai.ts";
import { generateEmailBody, sendEmail } from "./send_email.ts";

async function sendNewsletter() {
  try {
    const oneWeekAgo = getFiveDayAgoDate();
    const news = await getOldNews(oneWeekAgo);
    const users = await getUsers();

    if (news && news.length > 0) {
      const weekendNewsId = await getWeekendNewsId(news);
      const weekendNews = news.find(n => n.id == weekendNewsId);

      const relevantNewsIds = await getRelevantNewsIds(news, weekendNewsId);
      const relevantNews = news.filter(n => relevantNewsIds.includes(n.id.toString()));

      for (const user of users) {
        try {
          const emailBody = generateEmailBody(user.username, weekendNews, relevantNews);
          await sendEmail(user.email, emailBody);
          console.log(`Email enviado para ${user.email}`);
        } catch (error) {
          console.error(`Erro ao enviar email para ${user.email}:`, error);
        }
      }
    } else {
      console.log("Nenhuma notícia para enviar.");
    }
  } catch (error) {
    console.error("Erro durante o envio de newsletter:", error);
  }
}

Deno.cron("envio de noticias", "0 10 * * 6", () => {
  console.log("Iniciando o cron job de envio de newsletter...");
  sendNewsletter()
    .then(() => console.log("Cron job concluído com sucesso."))
    .catch(error => console.error("Erro no cron job:", error));
});