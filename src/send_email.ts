import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";
import type { INews } from "./supabase.ts";

const env = await load();
const resendUrl = "https://api.resend.com/emails";

const RESEND_API_KEY = env.RESEND_API_KEY || Deno.env.get("RESEND_API_KEY");

export async function sendEmail(email: string, emailBody: string) {
	const res = await fetch(resendUrl, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${RESEND_API_KEY}`,
		},
		body: JSON.stringify({
			from: "contato@joinvilleinfo.com.br",
			to: email,
			subject: "Notícias da semana",
			html: emailBody,
		}),
	});

	const data = await res.json();
	console.log(data);
}

export function generateEmailBody(
	username: string,
	weekendNews: INews | undefined,
	mostRelevantNews: INews[],
) {
	return `
  ${htmlEmailHeader}
      <div class="container">
      <h1>Olá, ${username}!</h1>
      <p>Confira as principais notícias da semana:</p>
      <div>
      <img src="${weekendNews?.cover_image_url}" alt="${weekendNews?.title}">
      <h3>${weekendNews?.title}</h3>
      </div>  
      <h2>Mais Relevantes:</h2>
      <ul class="grid">
        ${mostRelevantNews
					.map(
						(news) => `
          <li>
            <a href="https://www.joinvilleinfo.com.br/noticia/${news.friendly_url}">
            <img src="${news.cover_image_url}" alt="${news.title}">
            <h4>${news.title}</h4>
            </a>
          </li>
        `,
					)
					.join("")}
      </ul>
      <div class="cta">
      <a href="https://www.joinvilleinfo.com.br" class="button">
        Acesse o site
      </a>
      </div>
      </div>
      ${htmlEmailFooter}
    `;
}

const htmlEmailHeader = `
<!DOCTYPE html>
<html>
<head>
<style>
  body {
    background-image: linear-gradient(0deg,#000420, #250136); /* A dark purple */
    color: #9b9b9b; /* A light purple */
    font-family: Georgia, serif;
    box-sizing: border-box;
    padding: 1rem;
    margin: 0;
  }

  .container {
    background-color: #000412; /* A medium purple */
    padding: 20px;
    border-radius: 10px; /* Increased border radius for softer corners */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  }
  .container p {
    font-size: 20px;
    font-weight: 600;
  }
  .container div {
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .container div img {
    max-width: 100%;
    border-radius: 2rem;
  }
      .container div h3 {
        font-size: 16px;
      }

  table {
    width: 100%; /* Ensure table takes full width */
    border-collapse: collapse;
  }

  th, td {
    padding: 10px; /* Increased padding for better readability */
    text-align: left;
    border-bottom: 1px solid #666; /* A slightly darker purple for borders */
  }
  tr {
    display: flex;
    flex-direction: column;
  }

  /* Hero Image (optional) */
  .hero-image {
    width: 100%; /* Set image width */
    height: auto; /* Maintain aspect ratio */
    margin-bottom: 1rem; /* Add spacing after image */
  }
  .grid {
    display: grid;
    justify-items: center;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }
  .grid li {
    list-style: none;
  }

  .grid li img {
    width: 100%;
    max-height: 300px;
    border-radius: 1rem;
  }
    .grid li a {
    text-decoration: none;
    color: inherit;
  }
  .grid li a h4 {
    font-size: 1rem;
    font-weight: 600;
    color: #fff;
    margin: 0;
  }

  /* Button (optional) */
  .button {
    background-color: #7f5af0; /* A vibrant purple */
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    border: none; /* Remove border for cleaner look */
    border-radius: 5px; /* Add rounded corners */
    cursor: pointer;
  }

  .button:hover {
    background-color: #6633cc; /* A darker shade on hover */
    color: white;
  }
  .cta {
    text-align: center;
    margin-top: 20px;
  }

  .social-icons {
    text-align: center;
    margin-top: 20px;
  }

  .social-icon {
    margin: 0 10px;
    width: 2rem; /* Set icon size */
    height: 2rem; /* Set icon size */
    filter: invert();
  }
  .hidden {
      display: none;
  }
  @media (min-width: 768px) {
      .hidden {
          display: block;
      }
      .container div h3 {
        font-size: 20px;
      }
  tr {
    flex-direction: row;
  }
  }
  .header {
      display: flex;
      align-items: center;
      justify-content: center;
  gap: 1rem;
  }
.header span {
  color: #fff;
  font-weight: bold;
  font-size: 1.5rem;
}
  .hero-image {
      width: 5rem;
      height: auto;
  border-radius: 50%;
  }
h1 {
  color: #fff;
}

</style>
</head>

  <body>

<div class="header" >
  <span class="hidden md:flex text-3xl -ml-2 font-bold text-white">Joinville</span>
  <img src="https://www.joinvilleinfo.com.br/logo_insta.png" alt="Joinville Info Logo" class="hero-image">
  <span class="md:mr-12 text-3xl -ml-2 font-bold text-white">INFO</span>
</div>
`;
const htmlEmailFooter = `

<div class="social-icons">
<a href="https://www.facebook.com/joinvilleinfo" target="_blank">
  <img src="https://www.joinvilleinfo.com.br/facebook.png" alt="Facebook icon" class="social-icon">
</a>
<a href="https://chat.whatsapp.com/DVDVfq5uKHH8rGa5GJ1h0e" target="_blank">
  <img src="https://www.joinvilleinfo.com.br/whatsapp.png" alt="Whatsapp icon" class="social-icon">
</a>
<a href="https://www.instagram.com/joinville_info" target="_blank">
  <img src="https://www.joinvilleinfo.com.br/instagram.png" alt="Instagram" class="social-icon">
</a>
</div>
</body>
</html>
`;
