const btnToggle = document.getElementById('btn-theme-toggle');

function appliquerTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
    btnToggle.textContent = '☀️'; // soleil pour mode sombre
  } else {
    document.body.classList.remove('dark-mode');
    btnToggle.textContent = '🌙'; // lune pour mode clair
  }
  localStorage.setItem('theme', theme);
}

// Chargement du thème au démarrage
const themeStocke = localStorage.getItem('theme') || 'light';
appliquerTheme(themeStocke);

btnToggle.addEventListener('click', () => {
  const themeActuel = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
  const nouveauTheme = themeActuel === 'light' ? 'dark' : 'light';
  appliquerTheme(nouveauTheme);
});
