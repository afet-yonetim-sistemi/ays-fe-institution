// Import Theme
import { normalTheme, darkTheme } from '../themes/themes';

export const getTheme = () => {
  let theme: any = {};
  let selected = localStorage.getItem('theme');

  if (selected === null || selected === 'normal') {
    localStorage.setItem('theme', 'normal');
    theme = normalTheme().styles;
    selected = 'normal';
  } else {
    localStorage.setItem('theme', 'dark');
    selected = 'dark';
    theme = theme = darkTheme().styles;
  }

  Object.keys(theme).forEach((styleName) => {
    const styleValue = theme[styleName];

    document.documentElement.style.setProperty(`--${styleName}`, styleValue);
  });
};
