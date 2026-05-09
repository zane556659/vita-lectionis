// Main App + routing for 閱讀人生

const { useState: useS, useEffect: useE } = React;

// Tweak defaults — host can rewrite this block on disk
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "fontSize": 17,
  "density": "medium",
  "accent": "rust",
  "showRoman": true
}/*EDITMODE-END*/;

function parseHash() {
  const h = window.location.hash || '#/';
  const parts = h.replace(/^#\/?/, '').split('/').filter(Boolean);
  if (parts.length === 0) return { page: 'home' };
  if (parts[0] === 'index') return { page: 'index' };
  if (parts[0] === 'tags') return { page: 'tags' };
  if (parts[0] === 'tag' && parts[1]) return { page: 'tag', id: parts[1] };
  if (parts[0] === 'about') return { page: 'about' };
  if (parts[0] === 'article' && parts[1]) return { page: 'article', id: parts[1] };
  return { page: 'home' };
}

function buildHash(page, params) {
  if (page === 'home') return '#/';
  if (page === 'article') return `#/article/${params.id}`;
  if (page === 'tag') return `#/tag/${params.id}`;
  return `#/${page}`;
}

function App() {
  const [route, setRoute] = useS(parseHash());
  const [mode, setMode] = useS(() => localStorage.getItem('vl-mode') || 'day');
  const [variant, setVariant] = useS(() => localStorage.getItem('vl-variant') || 'A');
  const [tweaks, setTweak] = window.useTweaks ? window.useTweaks(TWEAK_DEFAULTS) : [TWEAK_DEFAULTS, () => {}];

  useE(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useE(() => {
    document.body.dataset.mode = mode;
    localStorage.setItem('vl-mode', mode);
  }, [mode]);

  useE(() => {
    localStorage.setItem('vl-variant', variant);
  }, [variant]);

  // Apply tweaks
  useE(() => {
    document.documentElement.style.setProperty('--read-size', tweaks.fontSize + 'px');
    document.body.dataset.density = tweaks.density;
    const accentMap = {
      rust: { primary: '#9a4a2a', secondary: '#2f3a22' },
      moss: { primary: '#2f3a22', secondary: '#9a4a2a' },
      bloom: { primary: '#a85a55', secondary: '#2f3a22' },
      bark: { primary: '#6b4a2a', secondary: '#2f3a22' },
    };
    const m = accentMap[tweaks.accent] || accentMap.rust;
    document.documentElement.style.setProperty('--rust', m.primary);
    document.documentElement.style.setProperty('--moss-deep', m.secondary);
  }, [tweaks.fontSize, tweaks.density, tweaks.accent]);

  const navigate = (page, params) => {
    window.location.hash = buildHash(page, params || {});
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const toggleMode = () => setMode(m => m === 'day' ? 'lamp' : 'day');

  let content = null;
  if (route.page === 'home') content = <HomePage navigate={navigate} />;
  else if (route.page === 'index') content = <IndexPage navigate={navigate} />;
  else if (route.page === 'tags') content = <TagsPage navigate={navigate} />;
  else if (route.page === 'tag') content = <TagPage navigate={navigate} tagId={route.id} />;
  else if (route.page === 'about') content = <AboutPage navigate={navigate} />;
  else if (route.page === 'article') content = <ArticlePage navigate={navigate} articleId={route.id} variant={variant} setVariant={setVariant} />;

  const Tweaks = window.TweaksPanel;
  const TS = window.TweakSlider;
  const TR = window.TweakRadio;
  const TC = window.TweakColor;

  return (
    <>
      <Masthead route={route} navigate={navigate} mode={mode} toggleMode={toggleMode} />
      {content}
      <SiteFooter />
      {Tweaks && (
        <Tweaks title="Tweaks · 調 整">
          {TS && <TS label="字體大小 · Font size" value={tweaks.fontSize} min={14} max={22} step={1} unit="px"
            onChange={v => setTweak('fontSize', v)} />}
          {TR && <TR label="版面密度 · Density" value={tweaks.density}
            options={[{value:'tight',label:'疏'},{value:'medium',label:'中'},{value:'loose',label:'密'}]}
            onChange={v => setTweak('density', v)} />}
          {TC && <TC label="點綴色 · Accent" value={tweaks.accent}
            options={['#9a4a2a', '#2f3a22', '#a85a55', '#6b4a2a']}
            onChange={v => {
              const map = { '#9a4a2a': 'rust', '#2f3a22': 'moss', '#a85a55': 'bloom', '#6b4a2a': 'bark' };
              setTweak('accent', map[v] || 'rust');
            }} />}
        </Tweaks>
      )}
    </>
  );
}

// Mount
const loadingEl = document.getElementById('app-loading');
if (loadingEl) loadingEl.remove();
ReactDOM.createRoot(document.getElementById('app')).render(<App />);
