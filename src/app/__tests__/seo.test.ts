import sitemap from "../sitemap";
import robots from "../robots";
import { generateMetadata as generateBlogMetadata } from "../blog/[slug]/page";

const baseUrl = "https://elviswohlken.com";

describe("SEO routes", () => {
  beforeEach(() => {
    global.fetch = jest.fn(async (input: RequestInfo | URL) => {
      const url = input.toString();
      if (url.includes("/api/blog/")) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            slug: "moltbook-weird-posts-and-security",
            title: "Moltbook, Weird Posts, and a Security Wake-Up Call",
            date: "2026-02-03",
            content: "Test content",
          }),
        } as Response;
      }

      return {
        ok: true,
        status: 200,
        json: async () => [
          {
            slug: "moltbook-weird-posts-and-security",
            title: "Moltbook, Weird Posts, and a Security Wake-Up Call",
            date: "2026-02-03",
            content: "Test content",
          },
        ],
      } as Response;
    }) as jest.Mock;
  });

  test("sitemap includes blog routes", async () => {
    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain(`${baseUrl}/`);
    expect(urls).toContain(`${baseUrl}/blog`);
    expect(urls.some((url) => url.startsWith(`${baseUrl}/blog/`))).toBe(true);
  });

  test("robots points to sitemap", async () => {
    const rules = await robots();
    const sitemapUrl = rules.sitemap as string;

    expect(sitemapUrl).toBe(`${baseUrl}/sitemap.xml`);
  });

  test("blog metadata includes canonical + openGraph", async () => {
    const metadata = await generateBlogMetadata({
      params: Promise.resolve({ slug: "moltbook-weird-posts-and-security" }),
    });

    expect(metadata.alternates?.canonical).toBe(
      `${baseUrl}/blog/moltbook-weird-posts-and-security`
    );
    expect(metadata.openGraph?.type).toBe("article");
  });
});
