import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const lanSessionPath = resolve(process.cwd(), 'lib/lan/lan-session.native.ts');

describe('Android LAN startup safety', () => {
  it('does not evaluate optional native LAN modules during app startup', () => {
    const source = readFileSync(lanSessionPath, 'utf8');

    expect(source).not.toContain("from 'react-native-tcp-socket'");
    expect(source).not.toContain("from 'react-native-zeroconf'");
    expect(source).not.toContain("from 'expo-network'");
    expect(source).toContain('private ensureNativeModules()');
    expect(source).toContain("require('react-native-tcp-socket')");
    expect(source).toContain("require('react-native-zeroconf')");
    expect(source).toContain("require('expo-network')");
  });
});
