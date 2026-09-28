/**
 * Sri Muthukumaran Medical College - Theme & Design System Manager
 * Provides centralized dynamic theme customization & persistence
 */

class ThemeManager {
  constructor() {
    this.storageKey = 'smmcri_theme_config';
    this.defaultConfig = {
      theme: 'light', // 'light' | 'dark'
      primaryColor: '#0F52BA',
      secondaryColor: '#0D9488',
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      borderRadius: '12px',
      colorPreset: 'sapphire'
    };
    
    this.presets = {
      sapphire: { primary: '#0F52BA', secondary: '#0D9488', name: 'Medical Sapphire (Default)' },
      navy: { primary: '#1e3a8a', secondary: '#0284c7', name: 'Clinical Royal Navy' },
      emerald: { primary: '#059669', secondary: '#0d9488', name: 'Surgical Emerald' },
      crimson: { primary: '#be123c', secondary: '#e11d48', name: 'Cardiology Crimson' },
      purple: { primary: '#7c3aed', secondary: '#2563eb', name: 'Academic Purple' }
    };

    this.fonts = [
      { name: "Plus Jakarta Sans (Modern Clean)", value: "'Plus Jakarta Sans', system-ui, sans-serif" },
      { name: "Outfit (Geometric & Contemporary)", value: "'Outfit', 'Plus Jakarta Sans', sans-serif" },
      { name: "Inter (Classic Functional)", value: "'Inter', system-ui, sans-serif" }
    ];

    this.init();
  }

  init() {
    const saved = localStorage.getItem(this.storageKey);
    this.config = saved ? { ...this.defaultConfig, ...JSON.parse(saved) } : { ...this.defaultConfig };
    this.applyTheme(this.config);
  }

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.config));
  }

  applyTheme(config) {
    const root = document.documentElement;

    // Apply Light/Dark Mode
    if (config.theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }

    // Apply Primary Color & derive lighter/glow variants
    root.style.setProperty('--primary', config.primaryColor);
    root.style.setProperty('--primary-hover', this.adjustColor(config.primaryColor, -20));
    root.style.setProperty('--primary-light', this.hexToRgba(config.primaryColor, 0.12));
    root.style.setProperty('--primary-glow', this.hexToRgba(config.primaryColor, 0.28));

    // Apply Secondary Color
    root.style.setProperty('--secondary', config.secondaryColor);
    root.style.setProperty('--secondary-hover', this.adjustColor(config.secondaryColor, -20));
    root.style.setProperty('--secondary-light', this.hexToRgba(config.secondaryColor, 0.12));
    root.style.setProperty('--secondary-glow', this.hexToRgba(config.secondaryColor, 0.25));

    // Apply Font
    root.style.setProperty('--font-family', config.fontFamily);

    // Apply Border Radius
    root.style.setProperty('--radius-md', config.borderRadius);

    // Dispatch event for components that redraw (like charts)
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: config }));
  }

  setTheme(mode) {
    this.config.theme = mode;
    this.save();
    this.applyTheme(this.config);
  }

  toggleDarkMode() {
    const nextMode = this.config.theme === 'dark' ? 'light' : 'dark';
    this.setTheme(nextMode);
    return nextMode;
  }

  setPrimaryColor(hex) {
    this.config.primaryColor = hex;
    this.config.colorPreset = 'custom';
    this.save();
    this.applyTheme(this.config);
  }

  setSecondaryColor(hex) {
    this.config.secondaryColor = hex;
    this.save();
    this.applyTheme(this.config);
  }

  setFontFamily(font) {
    this.config.fontFamily = font;
    this.save();
    this.applyTheme(this.config);
  }

  setRadius(radius) {
    this.config.borderRadius = radius;
    this.save();
    this.applyTheme(this.config);
  }

  applyPreset(presetKey) {
    if (this.presets[presetKey]) {
      const preset = this.presets[presetKey];
      this.config.primaryColor = preset.primary;
      this.config.secondaryColor = preset.secondary;
      this.config.colorPreset = presetKey;
      this.save();
      this.applyTheme(this.config);
    }
  }

  resetToDefault() {
    this.config = { ...this.defaultConfig };
    this.save();
    this.applyTheme(this.config);
  }

  // Utility helpers
  hexToRgba(hex, alpha = 1) {
    let cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split('').map(c => c + c).join('');
    }
    const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
    const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
    const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  adjustColor(color, percent) {
    let num = parseInt(color.replace("#", ""), 16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) + amt,
      G = (num >> 8 & 0x00FF) + amt,
      B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }
}

window.themeManager = new ThemeManager();
