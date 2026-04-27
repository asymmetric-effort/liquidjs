import { test, expect } from '@playwright/test';

test.describe('SEO Files', () => {
  test('robots.txt is served and references sitemap', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).toContain('User-agent: *');
    expect(text).toContain('Allow: /');
    expect(text).toContain('sitemap.xml');
  });

  test('sitemap.xml is served and contains URLs', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).toContain('<?xml');
    expect(text).toContain('<urlset');
    expect(text).toContain('<loc>');
    expect(text).toContain('specifyjs.asymmetric-effort.com');
  });

  test('llms.txt is served and contains project info', async ({ request }) => {
    const response = await request.get('/llms.txt');
    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).toContain('SpecifyJS');
    expect(text).toContain('npm install');
    expect(text).toContain('@asymmetric-effort/specifyjs');
    expect(text).toContain('MIT');
  });

  test('sitemap.xml includes documentation routes', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    const text = await response.text();
    expect(text).toContain('/#/docs/guides/getting-started');
    expect(text).toContain('/#/docs/api/hooks');
  });

  test('sitemap.xml includes main routes', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    const text = await response.text();
    expect(text).toContain('/#/components');
    expect(text).toContain('/#/docs');
  });
});
