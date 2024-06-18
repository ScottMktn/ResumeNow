// utils/extractBullets.ts

import { load } from "cheerio";

export function extractBullets(html: string): string[] {
  const $ = load(html);
  const bullets: string[] = [];

  // Select all <ul> elements and iterate through them
  $("ul").each((_, ul) => {
    const $ul = $(ul);

    // Check if the <ul> is within a <nav> or <footer>
    if ($ul.parents("nav, footer").length === 0) {
      // If not, get the <li> elements within this <ul>
      $ul.find("li").each((_, li) => {
        const bulletText = $(li).text().trim();
        // check if the bullet is greater than 5 words

        if (bulletText && bulletText.split(" ").length > 5) {
          bullets.push(bulletText);
        }
      });
    }
  });

  return bullets;
}
