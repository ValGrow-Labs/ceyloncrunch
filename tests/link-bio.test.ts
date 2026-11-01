import test from 'node:test';
import assert from 'node:assert/strict';
import { linkBioConfig } from '../src/data/linksConfig';
import fs from 'node:fs';

test('LinkBio - Config Validation', async (t) => {
  await t.test('Profile section metadata is populated correctly', () => {
    assert.equal(linkBioConfig.brand.name, 'Ceylon Crunch');
    assert.ok(linkBioConfig.brand.description.length > 20, 'Description should be informative');
    assert.equal(linkBioConfig.brand.logoUrl, '/logo.png', 'Must use original brand logo');
    assert.equal(linkBioConfig.brand.verified, true);
    assert.ok(linkBioConfig.brand.tagline, 'Tagline should be present');
  });

  await t.test('All required user links exist in buttons or socialLinks', () => {
    const allTitlesAndNames = [
      ...linkBioConfig.buttons.map(b => b.title.toLowerCase()),
      ...linkBioConfig.socialLinks.map(s => s.name.toLowerCase()),
    ].join(' ');

    // 1. Official Website
    assert.ok(
      linkBioConfig.buttons.some(b => b.url === '/' && b.title.toLowerCase().includes('website')),
      'Official Website link must be present'
    );

    // 2. Products / Services
    assert.ok(
      linkBioConfig.buttons.some(b => b.url === '/shop'),
      'Products / Services link must be present'
    );

    // 3. Instagram
    assert.ok(
      linkBioConfig.buttons.some(b => b.url.includes('instagram.com')) &&
      linkBioConfig.socialLinks.some(s => s.url.includes('instagram.com')),
      'Instagram link must be present in buttons and social bar'
    );

    // 4. Facebook
    assert.ok(
      linkBioConfig.buttons.some(b => b.url.includes('facebook.com')) &&
      linkBioConfig.socialLinks.some(s => s.url.includes('facebook.com')),
      'Facebook link must be present'
    );

    // 5. TikTok
    assert.ok(
      linkBioConfig.buttons.some(b => b.url.includes('tiktok.com')) &&
      linkBioConfig.socialLinks.some(s => s.url.includes('tiktok.com')),
      'TikTok link must be present'
    );

    // 6. YouTube
    assert.ok(
      linkBioConfig.buttons.some(b => b.url.includes('youtube.com')) &&
      linkBioConfig.socialLinks.some(s => s.url.includes('youtube.com')),
      'YouTube link must be present'
    );

    // 7. Contact Us
    assert.ok(
      linkBioConfig.buttons.some(b => b.url === '/contact'),
      'Contact Us link must be present'
    );

    // 8. WhatsApp Concierge
    assert.ok(
      linkBioConfig.buttons.some(b => b.url.includes('wa.me')) &&
      linkBioConfig.socialLinks.some(s => s.url.includes('wa.me')),
      'WhatsApp direct link must be present'
    );
  });

  await t.test('All internal links correspond to valid routes in App.tsx', () => {
    const appTsx = fs.readFileSync('src/App.tsx', 'utf8');

    for (const btn of linkBioConfig.buttons) {
      if (!btn.isExternal) {
        const routePath = btn.url;
        const existsInRouter =
          appTsx.includes(`path="${routePath}"`) ||
          appTsx.includes(`path='${routePath}'`);
        assert.ok(
          existsInRouter,
          `Internal route ${routePath} should exist in App.tsx routes`
        );
      }
    }
  });

  await t.test('All external links have valid HTTPS URLs', () => {
    for (const btn of linkBioConfig.buttons) {
      if (btn.isExternal) {
        assert.ok(
          btn.url.startsWith('https://'),
          `External URL ${btn.url} must start with https://`
        );
      }
    }

    for (const s of linkBioConfig.socialLinks) {
      assert.ok(
        s.url.startsWith('https://'),
        `Social URL ${s.url} must start with https://`
      );
    }
  });
});

test('LinkBio - Component File Checks', () => {
  const linkBioCode = fs.readFileSync('src/pages/LinkBio.tsx', 'utf8');

  // Verify responsive and modern design attributes
  assert.ok(linkBioCode.includes('max-w-lg'), 'Should be centered with max-w-lg for mobile/desktop layout');
  assert.ok(linkBioCode.includes('rounded-2xl'), 'Buttons should have modern rounded corners');
  assert.ok(linkBioCode.includes('hover:shadow-md'), 'Buttons should have subtle hover shadows');
  assert.ok(linkBioCode.includes('hover:-translate-y-0.5'), 'Buttons should have subtle hover elevation');
  assert.ok(linkBioCode.includes('brand.logoUrl'), 'Must render brand logo from config');
  assert.ok(linkBioCode.includes('handleShare'), 'Should have link sharing capability');
  assert.ok(linkBioCode.includes('selectedCategory'), 'Should allow filtering/categorizing links');
});

