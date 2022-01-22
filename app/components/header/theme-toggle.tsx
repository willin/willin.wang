import { THEMES_DARK, THEMES_LIGHT, THEME_ICONS } from '~/config';
import { useTheme } from '~/layout/theme';

export function ThemeToggle() {
  const [theme, setTheme] = useTheme();
  const onThemeClicked = (theme: string) => {
    setTheme(theme);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetch('/action/set-theme', {
      method: 'PUT',
      body: JSON.stringify({ theme })
    });
    localStorage.setItem('theme', theme);
  };

  return (
    <div className='dropdown dropdown-end dropdown-hover'>
      <div tabIndex='0' className='m-1 btn'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          class='inline-block w-6 h-6 stroke-current md:mr-2'>
          <path
            stroke-linecap='round'
            stroke-linejoin='round'
            stroke-width='2'
            d='M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01'></path>
        </svg>
        {theme}
      </div>
      <div className='shadow dropdown-content bg-neutral-focus rounded-box w-104 flex'>
        <div className='menu w-52'>
          <ul tabIndex='0'>
            <li>
              <span>Dark</span>
            </li>
            {THEMES_DARK.map((t) => (
              <li key={t}>
                <a onClick={onThemeClicked.bind(this, t.toLowerCase())}>
                  {THEME_ICONS[t]} {t}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className='menu w-52'>
          <ul tabIndex='0'>
            <li>
              <span>Light</span>
            </li>
            {THEMES_LIGHT.map((t) => (
              <li key={t}>
                <a onClick={onThemeClicked.bind(this, t.toLowerCase())}>
                  {THEME_ICONS[t]} {t}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
