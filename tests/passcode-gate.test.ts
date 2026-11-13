import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  verifyPasscode,
  computeHash,
  recordFailedAttempt,
  getRateLimitStatus,
  resetFailedAttempts,
  lockSite,
} from '../src/lib/passcode';
import fs from 'node:fs';
import path from 'node:path';

describe('Passcode Security & Gate Validation', () => {
  it('correctly validates accepted default passcodes', async () => {
    assert.strictEqual(await verifyPasscode('crunch2026'), true);
    assert.strictEqual(await verifyPasscode('ceylon2026'), true);
    assert.strictEqual(await verifyPasscode('ceyloncrunch'), true);
  });

  it('correctly handles whitespace-trimmed passcodes', async () => {
    assert.strictEqual(await verifyPasscode('  crunch2026  '), true);
    assert.strictEqual(await verifyPasscode('\ncrunch2026\t'), true);
  });

  it('rejects incorrect passcodes and empty inputs', async () => {
    assert.strictEqual(await verifyPasscode('wrong_passcode'), false);
    assert.strictEqual(await verifyPasscode(''), false);
    assert.strictEqual(await verifyPasscode('   '), false);
    assert.strictEqual(await verifyPasscode('123456'), false);
  });

  it('produces standard deterministic SHA-256 hashes', async () => {
    const hash = await computeHash('crunch2026');
    assert.strictEqual(hash, '24db66463194d962f64b289b5ccf5912206b5c4302dc09e4b6d907c7a8b6f145');
  });

  it('PasscodeScreen component has removed the Remember this browser checkbox and 30-day expiry', () => {
    const filePath = path.resolve('src/components/auth/PasscodeScreen.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');

    assert.ok(
      !content.includes('Remember this browser'),
      'PasscodeScreen should not contain "Remember this browser"'
    );
    assert.ok(
      !content.includes('30-day session'),
      'PasscodeScreen should not contain "30-day session"'
    );
  });

  it('PasscodeScreen component has removed PRIVATE STOREFRONT ACCESS, SITE PASSCODE, Encrypted, and Authorized access notice', () => {
    const filePath = path.resolve('src/components/auth/PasscodeScreen.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');

    assert.ok(
      !content.includes('Private Storefront Access') && !content.includes('PRIVATE STOREFRONT ACCESS'),
      'PasscodeScreen should not contain "PRIVATE STOREFRONT ACCESS"'
    );
    assert.ok(
      !content.includes('SITE PASSCODE'),
      'PasscodeScreen should not contain "SITE PASSCODE"'
    );
    assert.ok(
      !content.includes('Encrypted'),
      'PasscodeScreen should not contain "Encrypted"'
    );
    assert.ok(
      !content.includes('Authorized access only'),
      'PasscodeScreen should not contain "Authorized access only"'
    );
  });

  it('PasscodeScreen component contains the required ValGrow Labs footer', () => {
    const filePath = path.resolve('src/components/auth/PasscodeScreen.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');

    assert.ok(
      content.includes('Powered by') && content.includes('ValGrow Labs'),
      'PasscodeScreen must contain "Powered by ValGrow Labs" footer'
    );
    assert.ok(
      content.includes('/valgrow-logo.png'),
      'PasscodeScreen should reference ValGrow Labs logo asset'
    );
  });

  it('PasscodeScreen component preserves Ceylon Crunch theme colors, fonts, welcome text and centers logo', () => {
    const filePath = path.resolve('src/components/auth/PasscodeScreen.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');

    assert.ok(content.includes('/logo.png'), 'PasscodeScreen must include Ceylon Crunch logo');
    assert.ok(content.includes('#1F3D2B'), 'PasscodeScreen must use primary forest green (#1F3D2B)');
    assert.ok(content.includes('#FBF7F0'), 'PasscodeScreen must use natural canvas (#FBF7F0)');
    assert.ok(content.includes('#EADFD0'), 'PasscodeScreen must use outline border color (#EADFD0)');
    assert.ok(
      content.includes('Welcome to Ceylon Crunch. Enter your passcode to continue.'),
      'PasscodeScreen must contain exact welcome text'
    );
  });

  it('App.tsx protects all routes with PasscodeGate', () => {
    const filePath = path.resolve('src/App.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');

    assert.ok(content.includes('<PasscodeGate>'), 'App.tsx must wrap application in PasscodeGate');
    assert.ok(content.includes('<PasscodeProvider>'), 'App.tsx must provide PasscodeProvider context');
  });
});
