// Pages for 閱讀人生

const { useState: useStateP, useEffect: useEffectP, useMemo: useMemoP } = React;

// ─── HOME · 首頁 ───
function HomePage({ navigate }) {
  const articles = window.ARTICLES;
  const featured = articles.filter(a => a.featured);
  const recent = articles.slice(0, 6);

  return (
    <div className="page-enter">
      <div className="wrap" style={{ paddingTop: 24, paddingBottom: 80 }}>
        {/* Featured pair */}
        <SectionHead num="I." en="Hodierna" zh="今 日 精 選" pg="001" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, marginBottom: 56 }}>
          {featured.slice(0, 2).map(a => <FeaturedCard key={a.id} article={a} navigate={navigate} />)}
        </div>

        <Fleuron glyph="❦ ❀ ❦" />

        {/* Recent — catalogue style */}
        <SectionHead num="II." en="Nuper Lecta" zh="新 近 心 得" pg="002" />
        <div style={{ borderTop: '3px double var(--rule)', borderBottom: '1px solid var(--rule)', padding: '4px 0' }}>
          {recent.map((a, i) => <CatalogueRow key={a.id} idx={i} article={a} navigate={navigate} />)}
        </div>

        <div style={{ textAlign: 'center', marginTop: 36 }}>
          <button onClick={() => navigate('index')} style={{
            fontFamily: 'var(--display-sc)', letterSpacing: '0.22em', fontSize: 12,
            padding: '12px 28px', background: 'var(--moss-deep)', color: 'var(--paper-light)',
            border: 'none', cursor: 'pointer'
          }}>VIEW ALL · 全 部 目 錄</button>
        </div>

        <Fleuron />

        {/* Categories preview */}
        <SectionHead num="III." en="Per Genus" zh="依 類 別" pg="003" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
          {window.TAGS.map(tag => {
            const count = articles.filter(a => a.tag === tag.id).length;
            return (
              <div key={tag.id} onClick={() => navigate('tag', { id: tag.id })} style={{
                border: '1px solid var(--rule)', background: 'var(--paper-light)',
                padding: '24px 20px', cursor: 'pointer', textAlign: 'center',
                transition: 'background 0.2s'
              }} onMouseEnter={e => e.currentTarget.style.background = 'var(--paper-dark)'}
                 onMouseLeave={e => e.currentTarget.style.background = 'var(--paper-light)'}>
                <div style={{ fontFamily: 'var(--display)', fontSize: 36, color: 'var(--rust)', lineHeight: 1 }}>{tag.glyph}</div>
                <div style={{ fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 22, color: 'var(--moss-deep)', marginTop: 14 }}>{tag.lat}</div>
                <div style={{ fontFamily: 'var(--serif-cn)', fontSize: 15, color: 'var(--ink)', marginTop: 4 }}>{tag.zh}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-faded)', marginTop: 10, paddingTop: 10, borderTop: '1px dotted var(--rule-soft)' }}>
                  {String(count).padStart(2,'0')} entries
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── INDEX · 心得目錄 ───
function IndexPage({ navigate }) {
  const [filter, setFilter] = useStateP('all');
  const articles = filter === 'all' ? window.ARTICLES : window.ARTICLES.filter(a => a.tag === filter);

  return (
    <div className="page-enter">
      <div className="wrap" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <SectionHead num="" en="Catalogus Lectionum" zh="心 得 目 錄" pg="ALL" />

        <div style={{ marginBottom: 24, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <span className="smcp" style={{ fontSize: 11, color: 'var(--ink-faded)', marginRight: 8 }}>FILTER · 篩 選</span>
          <button onClick={() => setFilter('all')} className="tag-pill" style={{
            background: filter === 'all' ? 'var(--moss-deep)' : 'var(--paper-light)',
            color: filter === 'all' ? 'var(--paper-light)' : 'var(--ink-soft)',
            borderColor: filter === 'all' ? 'var(--moss-deep)' : 'var(--rule)',
          }}>ALL · 全部</button>
          {window.TAGS.map(t => (
            <button key={t.id} onClick={() => setFilter(t.id)} className="tag-pill" style={{
              background: filter === t.id ? 'var(--moss-deep)' : 'var(--paper-light)',
              color: filter === t.id ? 'var(--paper-light)' : 'var(--ink-soft)',
              borderColor: filter === t.id ? 'var(--moss-deep)' : 'var(--rule)',
            }}>{t.glyph} {t.zh}</button>
          ))}
          <span style={{ flex: 1 }}></span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-faded)' }}>
            {articles.length} of {window.ARTICLES.length}
          </span>
        </div>

        <div style={{ borderTop: '3px double var(--rule)', borderBottom: '1px solid var(--rule)', padding: '4px 0', marginBottom: 32 }}>
          {articles.map((a, i) => <CatalogueRow key={a.id} idx={i} article={a} navigate={navigate} />)}
        </div>

        {/* List card view below */}
        <SectionHead num="" en="Detailed View" zh="詳 細 列 表" />
        <div>
          {articles.map(a => <ListCard key={a.id} article={a} navigate={navigate} />)}
        </div>
      </div>
    </div>
  );
}

// ─── TAGS · 分類總覽 ───
function TagsPage({ navigate }) {
  return (
    <div className="page-enter">
      <div className="wrap" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <SectionHead num="" en="Per Genus" zh="依 類 別 瀏 覽" />
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 48 }}>
          {window.TAGS.map(tag => {
            const count = window.ARTICLES.filter(a => a.tag === tag.id).length;
            return <TagChip key={tag.id} tag={tag} count={count} onClick={() => navigate('tag', { id: tag.id })} />;
          })}
        </div>

        {/* Each category section with its articles */}
        {window.TAGS.map((tag, i) => {
          const list = window.ARTICLES.filter(a => a.tag === tag.id);
          return (
            <section key={tag.id} style={{ marginBottom: 48 }}>
              <SectionHead num={['I.','II.','III.','IV.'][i]} en={tag.lat} zh={tag.zh} pg={`${list.length} entries`} />
              <div>
                {list.map(a => <ListCard key={a.id} article={a} navigate={navigate} />)}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

// ─── TAG (single category) ───
function TagPage({ navigate, tagId }) {
  const tag = window.TAGS.find(t => t.id === tagId);
  if (!tag) return <div className="wrap" style={{ padding: 60 }}>Unknown tag.</div>;
  const list = window.ARTICLES.filter(a => a.tag === tag.id);

  return (
    <div className="page-enter">
      <div className="wrap" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontFamily: 'var(--display)', fontSize: 56, color: 'var(--rust)', lineHeight: 1 }}>{tag.glyph}</div>
          <div style={{ fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 36, color: 'var(--moss-deep)', marginTop: 10 }}>{tag.lat}</div>
          <div style={{ fontFamily: 'var(--serif-cn)', fontSize: 18, color: 'var(--ink)', marginTop: 4, letterSpacing: '0.1em' }}>· {tag.zh} ·</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-faded)', marginTop: 10 }}>
            {list.length} ENTRIES · sub categoria
          </div>
        </div>
        <div className="heavy-rule" style={{ marginBottom: 28 }}></div>

        <div>
          {list.map(a => <ListCard key={a.id} article={a} navigate={navigate} />)}
        </div>

        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <button onClick={() => navigate('tags')} className="tag-pill">← 返 回 分 類 總 覽</button>
        </div>
      </div>
    </div>
  );
}

// ─── ABOUT · 關於 ───
function AboutPage({ navigate }) {
  return (
    <div className="page-enter">
      <div className="wrap-narrow" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <SectionHead num="" en="De Me" zh="關 於 閱 讀 人 生" pg="colophon" />

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 40, marginBottom: 40 }}>
          <div>
            <PlatePlaceholder num="P" caption="Lector ipse" glyph="✎" ratio="3 / 4" />
          </div>
          <div style={{ fontFamily: 'var(--serif-body)', fontSize: 16, lineHeight: 1.85, color: 'var(--ink)', textAlign: 'justify' }}>
            <p style={{ marginTop: 0 }}>
              <span style={{ fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 20, color: 'var(--moss-deep)' }}>閱讀人生 · Vita Lectionis</span>
              ，是一個慢讀慢寫的個人筆記。我把讀過的書、看過的電影、上過的課、走過的地方，當成是自然博物學家收集標本——每一個都仔細看過、仔細寫過、貼上標籤，留在這個小小的紙本博物館裡。
            </p>
            <p>
              這個網站的設計刻意取自 19 世紀植物圖鑑的版面語言：泛黃紙感、襯線體、雙線分隔、中英並列。希望讀者在閱讀的時候，能夠慢一點，像翻一本舊書那樣翻過去。
            </p>
            <p>
              不接廣告、不收訂閱、不放追蹤碼。<i>Sub umbra alarum tuarum.</i>
            </p>
          </div>
        </div>

        <Fleuron />

        {/* Stats panel */}
        <SectionHead num="" en="Numerata" zh="數 字 紀 錄" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
          {[
            { lab: 'Entries · 心得篇數', val: window.ARTICLES.length },
            { lab: 'Categories · 類別', val: window.TAGS.length },
            { lab: 'Avg. Read · 平均閱讀', val: Math.round(window.ARTICLES.reduce((s,a)=>s+a.readMin,0)/window.ARTICLES.length) + ' min' },
            { lab: 'Since · 起站於', val: 'MMXXIII' },
          ].map((s, i) => (
            <div key={i} style={{ border: '1px solid var(--rule)', background: 'var(--paper-light)', padding: '18px 20px' }}>
              <div className="smcp" style={{ fontSize: 10, color: 'var(--ink-faded)', marginBottom: 6 }}>{s.lab}</div>
              <div style={{ fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 32, color: 'var(--moss-deep)' }}>{s.val}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 40, padding: 24, border: '1px solid var(--rule)', background: 'var(--paper-light)' }}>
          <div className="smcp" style={{ fontSize: 11, color: 'var(--rust)', marginBottom: 8 }}>EPISTOLA · 來 信</div>
          <div style={{ borderTop: '1px solid var(--rule)', marginBottom: 12 }}></div>
          <div style={{ fontFamily: 'var(--serif-body)', fontSize: 15, lineHeight: 1.8, color: 'var(--ink)' }}>
            若您有書籍、電影或學習材料想要推薦，歡迎來信。我大概一週讀一次信，一個月回一次。
            <span style={{ display: 'block', marginTop: 12, fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--moss-deep)' }}>
              ✉ &nbsp; lector@vita-lectionis · placeholder
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ARTICLE · 單篇文章閱讀頁 (3 variants) ───

function ArticleTitleBlock({ article }) {
  return (
    <div className="art-title-block">
      <div className="art-cat">{article.cat} · {article.catLat}</div>
      <h1 className="art-title">{article.title}</h1>
      <div className="art-lat">{article.titleLat}</div>
      <div className="art-meta">
        <span>{article.date}</span>
        <span>{article.author}</span>
        <span>{article.readMin} min read</span>
        <span>No. {String(window.ARTICLES.indexOf(article)+1).padStart(3,'0')}</span>
      </div>
    </div>
  );
}

function ArticleBody({ blocks, variant }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.type === 'lead') return <p key={i} className={'lead' + (variant === 'A' && i === 0 ? ' drop-cap' : '')}>{b.text}</p>;
        if (b.type === 'p') return <p key={i}>{b.text}</p>;
        if (b.type === 'h2') return (
          <h2 key={i} id={`h-${i}`}>
            <span className="h2-num">{b.num}.</span>
            <span>{b.en}</span>
            <span className="h2-zh">· {b.zh} ·</span>
          </h2>
        );
        if (b.type === 'blockquote') return (
          <blockquote key={i}>
            {b.text}
            <span className="attr">{b.attr}</span>
          </blockquote>
        );
        return null;
      })}
    </>
  );
}

function ArticleColophon({ article }) {
  return (
    <div className="art-colophon">
      <div className="col-l">
        <div className="label">PLATE · 圖 版</div>
        <div className="value">PL. {article.plate}</div>
      </div>
      <div className="col-c">
        ❦ &nbsp; FINIS &nbsp; ❦
      </div>
      <div className="col-r">
        <div className="label">CATALOGUED · 編 入</div>
        <div className="value">{article.date}</div>
      </div>
    </div>
  );
}

function PrevNext({ article, navigate }) {
  const idx = window.ARTICLES.indexOf(article);
  const prev = idx > 0 ? window.ARTICLES[idx - 1] : null;
  const next = idx < window.ARTICLES.length - 1 ? window.ARTICLES[idx + 1] : null;
  return (
    <div className="prev-next">
      {prev ? (
        <a onClick={() => navigate('article', { id: prev.id })}>
          <div className="label">← PRECEDENS · 較 新</div>
          <div className="title">{prev.title}</div>
        </a>
      ) : <div></div>}
      {next ? (
        <a className="next" onClick={() => navigate('article', { id: next.id })}>
          <div className="label">SEQUENS · 較 舊 →</div>
          <div className="title">{next.title}</div>
        </a>
      ) : <div></div>}
    </div>
  );
}

// Variant A — 經典博物誌 (single col + marginalia sidebar)
function ArticleVariantA({ article, navigate }) {
  return (
    <div className="art-A">
      <ArticleTitleBlock article={article} />
      <div className="rule-double" style={{ marginBottom: 32 }}></div>
      <div className="art-body-wrap">
        <div className="art-body">
          <ArticleBody blocks={article.body} variant="A" />
          <Fleuron glyph="❦ ❀ ❦" />
        </div>
        <aside className="marginalia">
          <div className="mg-block">
            <div className="mg-label">SUBJECT · 對 象</div>
            <div className="mg-value">{article.subject}</div>
          </div>
          <div className="mg-block">
            <div className="mg-label">AUTHOR · 作 者</div>
            <div className="mg-value">{article.author}</div>
          </div>
          <div className="mg-block">
            <div className="mg-label">PLATE · 圖 版</div>
            <PlatePlaceholder num={article.plate} caption={article.plant} glyph="❦" ratio="4 / 5" />
            <div style={{ fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 13, color: 'var(--ink-faded)', marginTop: 8, textAlign: 'center' }}>
              {article.plantZh}
            </div>
          </div>
          <div className="mg-block">
            <div className="mg-label">RATING · 評 等</div>
            <div style={{ marginTop: 8 }}>
              <Stamp rating={article.rating} />
            </div>
          </div>
        </aside>
      </div>
      <ArticleColophon article={article} />
      <PrevNext article={article} navigate={navigate} />
    </div>
  );
}

// Variant B — 雙欄古籍 (two cols + TOC)
function ArticleVariantB({ article, navigate }) {
  const headings = article.body.filter(b => b.type === 'h2');
  return (
    <div className="art-B">
      <ArticleTitleBlock article={article} />
      <div className="art-toc">
        <a><span className="toc-num">·</span><span>Lead</span><span className="toc-dot"></span><span className="toc-pg">001</span></a>
        {headings.map((h, i) => (
          <a key={i} href={`#h-${article.body.indexOf(h)}`}>
            <span className="toc-num">{h.num}.</span>
            <span>{h.en}</span>
            <span className="toc-dot"></span>
            <span className="toc-pg">{String((i+1)*2+1).padStart(3,'0')}</span>
          </a>
        ))}
      </div>
      <div className="art-body">
        <ArticleBody blocks={article.body} variant="B" />
      </div>
      <Fleuron glyph="❦ ❀ ❦" />
      <ArticleColophon article={article} />
      <PrevNext article={article} navigate={navigate} />
    </div>
  );
}

// Variant C — 簡素抄本 (minimal centered + reading progress)
function ArticleVariantC({ article, navigate }) {
  const [progress, setProgress] = useStateP(0);
  useEffectP(() => {
    const onScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const p = Math.min(100, Math.max(0, (window.scrollY / Math.max(1, docH)) * 100));
      setProgress(p);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [article.id]);

  return (
    <div className="art-C">
      <ArticleTitleBlock article={article} />
      <div className="art-body">
        <ArticleBody blocks={article.body} variant="C" />
        <Fleuron glyph="❦" />
      </div>
      <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center', gap: 16, alignItems: 'center' }}>
        <Stamp rating={article.rating} />
        <div>
          <div className="smcp" style={{ fontSize: 10, color: 'var(--ink-faded)' }}>RATING · 評 等</div>
          <div style={{ marginTop: 4 }}><StarRating rating={article.rating} /></div>
        </div>
      </div>
      <ArticleColophon article={article} />
      <PrevNext article={article} navigate={navigate} />
      <div className="art-progress"><div style={{ width: progress + '%' }}></div></div>
    </div>
  );
}

function ArticlePage({ navigate, articleId, variant, setVariant }) {
  const article = window.ARTICLES.find(a => a.id === articleId);
  useEffectP(() => { window.scrollTo(0, 0); }, [articleId]);

  if (!article) return <div className="wrap" style={{ padding: 60 }}>Article not found.</div>;

  const VariantComp = { A: ArticleVariantA, B: ArticleVariantB, C: ArticleVariantC }[variant] || ArticleVariantA;

  return (
    <div className="page-enter">
      <VariantComp article={article} navigate={navigate} />
      <div className="variant-switch">
        {[
          { id: 'A', en: 'Classica', zh: '經典博物誌' },
          { id: 'B', en: 'Bicolumna', zh: '雙欄古籍' },
          { id: 'C', en: 'Simplex', zh: '簡素抄本' },
        ].map(v => (
          <button key={v.id} className={variant === v.id ? 'active' : ''} onClick={() => setVariant(v.id)}>
            {v.en}
            <span className="vs-label">{v.zh}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, {
  HomePage, IndexPage, TagsPage, TagPage, AboutPage, ArticlePage,
});
