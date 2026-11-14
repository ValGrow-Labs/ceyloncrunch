import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

describe('Full-Width Responsive Layout Verification', () => {
  it('index.html sets html, body, and #root to 100% width with 0 margin/padding and overflow-x-hidden', () => {
    const htmlPath = path.resolve('index.html');
    const content = fs.readFileSync(htmlPath, 'utf-8');

    assert.ok(content.includes('class="w-full m-0 p-0 overflow-x-hidden"'), 'html tag has full-width classes');
    assert.ok(content.includes('id="root" class="w-full min-h-screen m-0 p-0 overflow-x-hidden flex flex-col"'), '#root element has full-width and zero margin classes');
    assert.ok(content.includes('w-full m-0 p-0 overflow-x-hidden'), 'body element has full-width and zero margin classes');
  });

  it('src/index.css specifies width: 100%, margin: 0, padding: 0, and overflow-x: hidden for html, body, #root', () => {
    const cssPath = path.resolve('src/index.css');
    const content = fs.readFileSync(cssPath, 'utf-8');

    assert.ok(content.includes('html,'), 'targets html in base layer');
    assert.ok(content.includes('body,'), 'targets body in base layer');
    assert.ok(content.includes('#root'), 'targets #root in base layer');
    assert.ok(content.includes('width: 100%;'), 'specifies width 100%');
    assert.ok(content.includes('margin: 0;'), 'specifies margin 0');
    assert.ok(content.includes('padding: 0;'), 'specifies padding 0');
    assert.ok(content.includes('overflow-x: hidden;'), 'specifies overflow-x hidden');
  });

  it('App.tsx main wrapper removes max-w-[1320px] and uses full width responsive container with small padding', () => {
    const appPath = path.resolve('src/App.tsx');
    const content = fs.readFileSync(appPath, 'utf-8');

    assert.ok(!content.includes('max-w-[1320px]'), 'max-w-[1320px] is completely removed from App.tsx');
    assert.ok(
      content.includes('<main className="flex-1 w-full min-w-0 pt-16 sm:pt-18 lg:pt-20 pb-16 lg:pb-12 px-4 sm:px-6 lg:px-8">'),
      '<main> uses full width w-full min-w-0 with clean horizontal padding'
    );
  });

  it('Header.tsx removes max-w-[1320px] and spans 100% full width', () => {
    const headerPath = path.resolve('src/components/layout/Header.tsx');
    const content = fs.readFileSync(headerPath, 'utf-8');

    assert.ok(!content.includes('max-w-[1320px]'), 'max-w-[1320px] is removed from Header.tsx');
    assert.ok(content.includes('className="w-full h-15 sm:h-16 px-4 sm:px-6 lg:px-8'), 'Header nav bar uses 100% width with responsive padding');
  });

  it('Footer.tsx removes max-w-[1320px] and spans 100% full width', () => {
    const footerPath = path.resolve('src/components/layout/Footer.tsx');
    const content = fs.readFileSync(footerPath, 'utf-8');

    assert.ok(!content.includes('max-w-[1320px]'), 'max-w-[1320px] is removed from Footer.tsx');
    assert.ok(content.includes('className="w-full px-4 sm:px-6 lg:px-8 space-y-10"'), 'Footer inner content uses 100% width with responsive padding');
  });

  it('Shop.tsx and CategoryPage.tsx expand grids responsively across 1366px (xl) and 1920px (2xl) viewports', () => {
    const shopPath = path.resolve('src/pages/Shop.tsx');
    const shopContent = fs.readFileSync(shopPath, 'utf-8');
    assert.ok(
      shopContent.includes('xl:grid-cols-5 2xl:grid-cols-6'),
      'Shop.tsx grid scales responsively to 5 and 6 columns on xl and 2xl screens'
    );

    const categoryPath = path.resolve('src/pages/CategoryPage.tsx');
    const catContent = fs.readFileSync(categoryPath, 'utf-8');
    assert.ok(
      catContent.includes('xl:grid-cols-5 2xl:grid-cols-6'),
      'CategoryPage.tsx grid scales responsively to 5 and 6 columns on xl and 2xl screens'
    );
  });
});
