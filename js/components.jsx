// Shared components for 閱讀人生

const { useState, useEffect, useRef, useMemo } = React;

// ─── Engraving placeholder for plate frames ───
function PlatePlaceholder({ num, caption, glyph, ratio }) {
  const aspectRatio = ratio || '4 / 5';
  return (
    <div className="plate-frame engraving-bg" style={{ aspectRatio }}>
      {num && <span className="plate-num">PL. {num}</span>}
      <div className="placeholder-glyph">{glyph || '❦'}</div>
      {caption && <span className="plate-cap">{caption}</span>}
    </div>
  );
}

// ─── Approbatum stamp (rating) ───
function Stamp({ rating }) {
  if (!rating) return null;
  return (
    <div className="stamp" title={`${rating} / 5`}>
      <div>
        <span className="stamp-line">APPROBATUM</span>
        <span className="stamp-num">{['Ⅰ','Ⅱ','Ⅲ','Ⅳ','Ⅴ'][rating-1] || rating}</span>
        <span className="stamp-line">EX V</span>
      </div>
    </div>
  );
}

function StarRating({ rating }) {
  return (
    <div className="rating-row" aria-label={`${rating}/5`}>
      {[1,2,3,4,5].map(n => (
        <span key={n} className={`star ${n > rating ? 'empty' : ''}`}>{n <= rating ? '✦' : '✧'}</span>
      ))}
      <span className="rating-label">{rating}/5</span>
    </div>
  );
}

// ─── Masthead / site header ───
function Masthead({ route, navigate, mode, toggleMode }) {
  const today = new Date();
  const dateStr = `${today.getFullYear()} / ${String(today.getMonth()+1).padStart(2,'0')} / ${String(today.getDate()).padStart(2,'0')}`;
  const isActive = (r) => {
    if (r === 'home') return route.page === 'home';
    if (r === 'index') return route.page === 'index';
    if (r === 'tags') return route.page === 'tags' || route.page === 'tag';
    if (r === 'about') return route.page === 'about';
    return false;
  };

  return (
    <header className="masthead wrap">
      <button className="lamp-toggle" onClick={toggleMode} aria-label="toggle lamp mode" title={mode === 'lamp' ? '熄燈 · day' : '點燈 · lamp'}>
        {mode === 'lamp' ? '☀' : '☾'}
      </button>

      <div className="nav-row">
        <span style={{ flex: 1, borderTop: '1px solid var(--rule)', height: 0 }}></span>
        <div className="nav-links">
          <a className={isActive('home') ? 'active' : ''} onClick={() => navigate('home')}>HOME · 首頁</a>
          <a className={isActive('index') ? 'active' : ''} onClick={() => navigate('index')}>INDEX · 目錄</a>
          <a className={isActive('tags') ? 'active' : ''} onClick={() => navigate('tags')}>TAGS · 分類</a>
          <a className={isActive('about') ? 'active' : ''} onClick={() => navigate('about')}>DE ME · 關於</a>
        </div>
        <span style={{ flex: 1, borderTop: '1px solid var(--rule)', height: 0 }}></span>
      </div>

      <h1>
        <span className="cn">閱讀人生</span>
        <span style={{ display: 'block', fontSize: '0.42em', fontStyle: 'italic', color: 'var(--ink-soft)', marginTop: '6px', letterSpacing: '0.04em' }}>Vita Lectionis</span>
      </h1>
      <div className="tagline">a private commonplace book of readings, films, and days</div>

      <div className="meta-bar">
        <span>VOL. III · № {String(window.ARTICLES.length).padStart(3,'0')} ENTRIES</span>
        <span>EST. MMXXIII</span>
        <span>{dateStr}</span>
      </div>
      <div style={{ borderTop: '3px double var(--rule)', borderBottom: '1px solid var(--rule)', height: 5, marginTop: 18 }}></div>
    </header>
  );
}

// ─── Footer ───
function SiteFooter() {
  return (
    <footer className="site-footer wrap">
      <div className="fleuron">❦ &nbsp; ❀ &nbsp; ❦</div>
      <div className="credit">VITA LECTIONIS · MMXXVI</div>
      <div className="colophon">set in IM Fell English &amp; EB Garamond · printed on aged paper</div>
      <div style={{ marginTop: 16, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-faded)' }}>
        — Finis · 卷 終 —
      </div>
    </footer>
  );
}

// ─── Section header (uniform) ───
function SectionHead({ num, en, zh, pg, right }) {
  return (
    <div className="sec-head">
      <span className="num">{num}</span>
      <span className="en">{en}</span>
      <span className="zh">· {zh} ·</span>
      <span style={{ flex: 1, borderBottom: '1px solid var(--rule)', marginBottom: 8 }}></span>
      {right || (pg && <span className="pg">p. {pg}</span>)}
    </div>
  );
}

// ─── Catalogue line item (目錄列) ───
function CatalogueRow({ idx, article, navigate }) {
  const tag = window.TAGS.find(t => t.id === article.tag);
  return (
    <div className="cat-row" onClick={() => navigate('article', { id: article.id })}>
      <span className="cat-num">{['Ⅰ','Ⅱ','Ⅲ','Ⅳ','Ⅴ','Ⅵ','Ⅶ','Ⅷ','Ⅸ','Ⅹ'][idx] || (idx+1)}.</span>
      <div className="cat-body">
        <div className="cat-title">
          <span>{article.title}</span>
          <span className="lat">{article.titleLat}</span>
        </div>
        <div className="cat-meta">{article.subject} · {article.author}</div>
      </div>
      <div className="cat-cat" style={{ color: 'var(--rust)' }}>{tag && tag.glyph} {article.cat}</div>
      <div className="cat-page">{article.date.slice(2).replace(/ \/ /g,'.')} · {String(idx+1).padStart(3,'0')}</div>
    </div>
  );
}

// ─── Featured (front-page hero) card ───
function FeaturedCard({ article, navigate }) {
  return (
    <div className="featured-card" onClick={() => navigate('article', { id: article.id })}>
      <div className="ftr-img">
        <PlatePlaceholder num={article.plate} caption={article.plant} glyph="❦" />
      </div>
      <div className="ftr-text">
        <div className="ftr-cat">{article.cat} · {article.catLat}</div>
        <h2 className="ftr-title">{article.title}</h2>
        <div className="ftr-lat">{article.titleLat}</div>
        <p className="ftr-excerpt">{article.excerpt}</p>
        <div style={{ marginTop: 'auto' }}>
          <StarRating rating={article.rating} />
        </div>
        <div className="ftr-foot">
          <span>{article.date}</span>
          <span>{article.readMin} min read · No. {String(window.ARTICLES.indexOf(article)+1).padStart(3,'0')}</span>
        </div>
      </div>
    </div>
  );
}

// ─── List card (smaller, for index/tag pages) ───
function ListCard({ article, navigate }) {
  const tag = window.TAGS.find(t => t.id === article.tag);
  return (
    <div className="list-card" onClick={() => navigate('article', { id: article.id })}>
      <div className="lc-img">
        <PlatePlaceholder num={article.plate} caption={article.plantZh} glyph={tag && tag.glyph} ratio="1 / 1.15" />
      </div>
      <div className="lc-text">
        <div className="lc-cat">{article.cat} · {article.catLat}</div>
        <div className="lc-title">{article.title}</div>
        <div className="lc-lat">{article.titleLat}</div>
        <p className="lc-excerpt">{article.excerpt}</p>
        <div className="lc-foot">
          <span>{article.date}</span>
          <span>· {article.readMin} min</span>
          <span style={{ flex: 1 }}></span>
          <StarRating rating={article.rating} />
        </div>
      </div>
    </div>
  );
}

// ─── Tag chip ───
function TagChip({ tag, count, active, onClick }) {
  return (
    <div className={`tag-chip ${active ? 'active' : ''}`} onClick={onClick}>
      <span style={{ color: 'var(--rust)', fontFamily: 'var(--display)', fontSize: 14, marginRight: 4 }}>{tag.glyph}</span>
      <span className="chip-zh">{tag.zh}</span>
      <span className="chip-lat">{tag.lat}</span>
      <span className="chip-count">· {count}</span>
    </div>
  );
}

// ─── Fleuron divider ───
function Fleuron({ glyph }) {
  return (
    <div className="fleuron-row">
      <span className="line"></span>
      <span>{glyph || '❦ ❀ ❦'}</span>
      <span className="line"></span>
    </div>
  );
}

Object.assign(window, {
  PlatePlaceholder, Stamp, StarRating,
  Masthead, SiteFooter, SectionHead,
  CatalogueRow, FeaturedCard, ListCard,
  TagChip, Fleuron,
});
