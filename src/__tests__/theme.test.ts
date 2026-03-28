import { lightTheme, darkTheme, palette } from '../core/theme';

describe('Theme tokens', () => {
  it('light theme should not be dark', () => {
    expect(lightTheme.dark).toBe(false);
  });

  it('dark theme should be dark', () => {
    expect(darkTheme.dark).toBe(true);
  });

  it('brand colors match official palette', () => {
    expect(palette.blue500).toBe('#023397');
    expect(palette.green500).toBe('#38E67D');
  });

  it('light and dark themes have the same color keys', () => {
    const lightKeys = Object.keys(lightTheme.colors).sort();
    const darkKeys = Object.keys(darkTheme.colors).sort();
    expect(lightKeys).toEqual(darkKeys);
  });

  it('dark theme background should be dark navy', () => {
    expect(darkTheme.colors.background).toBe('#0D1829');
  });
});
