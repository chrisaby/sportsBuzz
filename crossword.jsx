import { useState, useEffect, useCallback, useRef } from "react";

const ROWS = 11;
const COLS = 9;

const SOLUTION = [
  [null,'C','O','R','N','E','R',null,null],
  ['P','E','N','A','L','T','Y',null,null],
  [null,'N',null,null,null,'G','O','A','L'],
  ['S','T','R','I','K','E','R','H',null],
  ['T','U',null,'W','I','C','K','E','T'],
  ['U','R',null,null,null,null,'E','A',null],
  ['M','Y',null,null,null,null,'R','D',null],
  ['P',null,null,null,'F',null,null,'E',null],
  ['S',null,null,null,'O','V','E','R',null],
  [null,null,null,null,'U',null,null,null,null],
  [null,null,null,null,'L',null,null,null,null],
];

const CELL_NUMBERS = {
  '0,1':1,'1,0':2,'1,6':3,'2,5':4,
  '3,0':5,'3,7':6,'4,3':7,'7,4':8,'8,4':9,
};

const WORDS = {
  across: [
    { num:1, row:0, col:1, len:6, answer:'CORNER',  clue:'Set piece taken from the corner flag in football', sport:'⚽' },
    { num:2, row:1, col:0, len:7, answer:'PENALTY', clue:'Spot kick awarded for a foul inside the box',       sport:'⚽' },
    { num:4, row:2, col:5, len:4, answer:'GOAL',    clue:'What a striker aims to score',                       sport:'⚽' },
    { num:5, row:3, col:0, len:7, answer:'STRIKER', clue:'Forward player whose main job is to score goals',    sport:'⚽' },
    { num:7, row:4, col:3, len:6, answer:'WICKET',  clue:'Three stumps and two bails a batsman defends',       sport:'🏏' },
    { num:9, row:8, col:4, len:4, answer:'OVER',    clue:'Six deliveries bowled by one bowler in cricket',     sport:'🏏' },
  ],
  down: [
    { num:1, row:0, col:1, len:7, answer:'CENTURY', clue:"A batsman's score of 100 runs",                      sport:'🏏' },
    { num:3, row:1, col:6, len:6, answer:'YORKER',  clue:"Delivery aimed at or near the batsman's feet",       sport:'🏏' },
    { num:5, row:3, col:0, len:6, answer:'STUMPS',  clue:'Three upright posts at each end of the pitch',       sport:'🏏' },
    { num:6, row:3, col:7, len:6, answer:'HEADER',  clue:'Scoring or clearing the ball with your head',        sport:'⚽' },
    { num:8, row:7, col:4, len:4, answer:'FOUL',    clue:'An illegal play or infringement of rules',           sport:'⚽' },
  ],
};

function buildCellWordMap() {
  const map = {};
  for (let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) map[`${r},${c}`]={across:null,down:null};
  WORDS.across.forEach(w=>{ for(let i=0;i<w.len;i++) map[`${w.row},${w.col+i}`].across=w.num; });
  WORDS.down.forEach(w=>{ for(let i=0;i<w.len;i++) map[`${w.row+i},${w.col}`].down=w.num; });
  return map;
}
const CELL_WORD_MAP = buildCellWordMap();

function getWordCells(num,dir){
  const words=dir==='across'?WORDS.across:WORDS.down;
  const word=words.find(w=>w.num===num);
  if(!word)return[];
  return Array.from({length:word.len},(_,i)=>dir==='across'?[word.row,word.col+i]:[word.row+i,word.col]);
}

export default function CrosswordPuzzle(){
  const [userGrid,setUserGrid]=useState(()=>Array.from({length:ROWS},()=>Array(COLS).fill('')));
  const [selected,setSelected]=useState({row:0,col:1});
  const [direction,setDirection]=useState('across');
  const [checked,setChecked]=useState(false);
  const [revealed,setRevealed]=useState(false);
  const [completed,setCompleted]=useState(false);
  const [flash,setFlash]=useState(false);
  const gridRef=useRef(null);

  useEffect(()=>{
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Courier+Prime:wght@400;700&display=swap';
    document.head.appendChild(link);
    return()=>document.head.removeChild(link);
  },[]);

  const activeWordNum=selected?CELL_WORD_MAP[`${selected.row},${selected.col}`]?.[direction]:null;
  const activeCells=new Set(activeWordNum?getWordCells(activeWordNum,direction).map(([r,c])=>`${r},${c}`):[]);

  useEffect(()=>{
    let ok=true;
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++)
      if(SOLUTION[r][c]!==null&&userGrid[r][c]!==SOLUTION[r][c]){ok=false;break;}
    if(ok&&!revealed){let any=false;for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)if(SOLUTION[r][c])any=true;if(any){setCompleted(true);setFlash(true);setTimeout(()=>setFlash(false),2000);}}
    else setCompleted(false);
  },[userGrid]);

  const advance=(row,col,dir)=>{
    const wn=CELL_WORD_MAP[`${row},${col}`]?.[dir];
    if(!wn)return null;
    const words=dir==='across'?WORDS.across:WORDS.down;
    const word=words.find(w=>w.num===wn);
    if(dir==='across'){const nc=col+1;if(nc<word.col+word.len)return{row,col:nc};}
    else{const nr=row+1;if(nr<word.row+word.len)return{row:nr,col};}
    return null;
  };
  const retreat=(row,col,dir)=>{
    const wn=CELL_WORD_MAP[`${row},${col}`]?.[dir];
    if(!wn)return null;
    const words=dir==='across'?WORDS.across:WORDS.down;
    const word=words.find(w=>w.num===wn);
    if(dir==='across'){const pc=col-1;if(pc>=word.col)return{row,col:pc};}
    else{const pr=row-1;if(pr>=word.row)return{row:pr,col};}
    return null;
  };

  const handleCellClick=(row,col)=>{
    if(SOLUTION[row][col]===null)return;
    if(selected?.row===row&&selected?.col===col){
      const nd=direction==='across'?'down':'across';
      if(CELL_WORD_MAP[`${row},${col}`]?.[nd])setDirection(nd);
    } else {
      setSelected({row,col});
      if(!CELL_WORD_MAP[`${row},${col}`]?.[direction]){
        const od=direction==='across'?'down':'across';
        if(CELL_WORD_MAP[`${row},${col}`]?.[od])setDirection(od);
      }
    }
    setChecked(false);
    gridRef.current?.focus();
  };

  const handleClueClick=(num,dir)=>{
    const words=dir==='across'?WORDS.across:WORDS.down;
    const word=words.find(w=>w.num===num);
    if(word){setSelected({row:word.row,col:word.col});setDirection(dir);gridRef.current?.focus();}
  };

  const handleKeyDown=useCallback((e)=>{
    if(!selected)return;
    const{row,col}=selected;
    if(e.key.match(/^[a-zA-Z]$/)&&!e.metaKey&&!e.ctrlKey){
      e.preventDefault();
      if(revealed)return;
      const letter=e.key.toUpperCase();
      setUserGrid(prev=>{const next=prev.map(r=>[...r]);next[row][col]=letter;return next;});
      const nxt=advance(row,col,direction);
      if(nxt)setSelected(nxt);
      setChecked(false);
    } else if(e.key==='Backspace'){
      e.preventDefault();
      if(revealed)return;
      if(userGrid[row][col]){
        setUserGrid(prev=>{const next=prev.map(r=>[...r]);next[row][col]='';return next;});
      } else {
        const prev=retreat(row,col,direction);
        if(prev){setSelected(prev);setUserGrid(g=>{const next=g.map(r=>[...r]);next[prev.row][prev.col]='';return next;});}
      }
      setChecked(false);
    } else if(e.key==='ArrowRight'){
      e.preventDefault();
      if(direction!=='across'){setDirection('across');return;}
      if(col+1<COLS&&SOLUTION[row][col+1]!==null)setSelected({row,col:col+1});
    } else if(e.key==='ArrowLeft'){
      e.preventDefault();
      if(direction!=='across'){setDirection('across');return;}
      if(col-1>=0&&SOLUTION[row][col-1]!==null)setSelected({row,col:col-1});
    } else if(e.key==='ArrowDown'){
      e.preventDefault();
      if(direction!=='down'){setDirection('down');return;}
      if(row+1<ROWS&&SOLUTION[row+1]?.[col]!==null)setSelected({row:row+1,col});
    } else if(e.key==='ArrowUp'){
      e.preventDefault();
      if(direction!=='down'){setDirection('down');return;}
      if(row-1>=0&&SOLUTION[row-1]?.[col]!==null)setSelected({row:row-1,col});
    } else if(e.key==='Tab'){
      e.preventDefault();
      const allWords=[...WORDS.across.map(w=>({...w,dir:'across'})),...WORDS.down.map(w=>({...w,dir:'down'}))];
      const ci=allWords.findIndex(w=>w.num===activeWordNum&&w.dir===direction);
      const ni=e.shiftKey?(ci-1+allWords.length)%allWords.length:(ci+1)%allWords.length;
      const nw=allWords[ni];
      setSelected({row:nw.row,col:nw.col});setDirection(nw.dir);
    }
  },[selected,direction,userGrid,activeWordNum,revealed]);

  const handleReveal=()=>{
    setRevealed(true);
    setUserGrid(SOLUTION.map(row=>row.map(cell=>cell||'')));
    setChecked(false);setCompleted(false);
  };

  const handleReset=()=>{
    setUserGrid(Array.from({length:ROWS},()=>Array(COLS).fill('')));
    setChecked(false);setRevealed(false);setCompleted(false);setSelected({row:0,col:1});setDirection('across');
  };

  const CELL=38;
  const BORDER=2;

  const getCellBg=(row,col)=>{
    if(SOLUTION[row][col]===null)return'#1c1c2e';
    const key=`${row},${col}`;
    const isSel=selected?.row===row&&selected?.col===col;
    const isAct=activeCells.has(key);
    if(isSel)return'#f59e0b';
    if(isAct)return'#bbf7d0';
    return '#fff';
  };

  const getCellTextColor=(row,col)=>{
    if(!checked||!userGrid[row][col])return'#1c1c2e';
    return userGrid[row][col]===SOLUTION[row][col]?'#15803d':'#dc2626';
  };

  const activeWordObj=activeWordNum?(direction==='across'?WORDS.across:WORDS.down).find(w=>w.num===activeWordNum):null;

  const styles={
    wrapper:{
      fontFamily:"'Courier Prime', monospace",
      background:'linear-gradient(135deg,#0f0f1a 0%,#1a1a2e 50%,#0d1b2a 100%)',
      minHeight:'100vh',
      padding:'20px 16px',
      color:'#f0ede6',
    },
    header:{
      textAlign:'center',
      marginBottom:20,
    },
    title:{
      fontFamily:"'Playfair Display', serif",
      fontSize:'clamp(22px,5vw,36px)',
      fontWeight:900,
      color:'#f0ede6',
      letterSpacing:'-0.5px',
      margin:0,
      lineHeight:1.1,
    },
    subtitle:{
      fontSize:13,
      color:'#94a3b8',
      marginTop:6,
      letterSpacing:'0.15em',
      textTransform:'uppercase',
    },
    badge:{
      display:'inline-block',
      background:'rgba(245,158,11,0.15)',
      border:'1px solid rgba(245,158,11,0.4)',
      borderRadius:20,
      padding:'3px 12px',
      fontSize:12,
      color:'#f59e0b',
      marginTop:8,
    },
    mainLayout:{
      display:'flex',
      flexWrap:'wrap',
      gap:20,
      justifyContent:'center',
      alignItems:'flex-start',
    },
    gridContainer:{
      display:'flex',
      flexDirection:'column',
      alignItems:'center',
    },
    gridOuter:{
      background:'rgba(255,255,255,0.04)',
      borderRadius:12,
      padding:16,
      border:'1px solid rgba(255,255,255,0.1)',
      boxShadow:'0 20px 60px rgba(0,0,0,0.5)',
    },
    grid:{
      display:'grid',
      gridTemplateColumns:`repeat(${COLS},${CELL}px)`,
      gridTemplateRows:`repeat(${ROWS},${CELL}px)`,
      gap:BORDER,
      background:'#334155',
      border:`${BORDER}px solid #334155`,
      borderRadius:4,
      cursor:'default',
      outline:'none',
    },
    activeClueBar:{
      background:'rgba(245,158,11,0.1)',
      border:'1px solid rgba(245,158,11,0.3)',
      borderRadius:8,
      padding:'8px 14px',
      marginTop:12,
      fontSize:13,
      color:'#fcd34d',
      textAlign:'center',
      maxWidth:`${COLS*CELL+(COLS-1)*BORDER}px`,
    },
    btnRow:{
      display:'flex',
      gap:10,
      marginTop:14,
      justifyContent:'center',
      flexWrap:'wrap',
    },
    btn:(variant)=>({
      padding:'8px 18px',
      borderRadius:8,
      border:'none',
      cursor:'pointer',
      fontFamily:"'Courier Prime', monospace",
      fontWeight:700,
      fontSize:13,
      letterSpacing:'0.05em',
      transition:'all 0.15s',
      ...(variant==='primary'?{background:'#f59e0b',color:'#1c1c2e'}:
          variant==='success'?{background:'#22c55e',color:'#fff'}:
          variant==='danger'?{background:'rgba(220,38,38,0.2)',color:'#fca5a5',border:'1px solid rgba(220,38,38,0.4)'}:
          {background:'rgba(255,255,255,0.08)',color:'#94a3b8',border:'1px solid rgba(255,255,255,0.15)'}),
    }),
    cluesPanel:{
      display:'flex',
      flexDirection:'column',
      gap:16,
      maxWidth:320,
      minWidth:260,
    },
    clueSection:{
      background:'rgba(255,255,255,0.04)',
      border:'1px solid rgba(255,255,255,0.1)',
      borderRadius:12,
      padding:'14px 16px',
    },
    clueSectionTitle:{
      fontFamily:"'Playfair Display', serif",
      fontSize:15,
      fontWeight:700,
      color:'#94a3b8',
      letterSpacing:'0.1em',
      textTransform:'uppercase',
      marginBottom:12,
      borderBottom:'1px solid rgba(255,255,255,0.08)',
      paddingBottom:8,
    },
    clueItem:(isActive)=>({
      display:'flex',
      alignItems:'flex-start',
      gap:8,
      padding:'6px 8px',
      borderRadius:8,
      marginBottom:4,
      cursor:'pointer',
      transition:'background 0.15s',
      background:isActive?'rgba(245,158,11,0.15)':'transparent',
      border:isActive?'1px solid rgba(245,158,11,0.3)':'1px solid transparent',
    }),
    clueNum:(isActive)=>({
      minWidth:22,
      fontSize:12,
      fontWeight:700,
      color:isActive?'#f59e0b':'#64748b',
      paddingTop:1,
    }),
    clueText:(isActive)=>({
      fontSize:13,
      lineHeight:1.4,
      color:isActive?'#fcd34d':'#cbd5e1',
    }),
    completedBanner:{
      background:'linear-gradient(135deg,#166534,#15803d)',
      border:'2px solid #22c55e',
      borderRadius:12,
      padding:'16px 24px',
      textAlign:'center',
      marginBottom:20,
      animation:'pulse 1s ease-in-out',
    },
  };

  return(
    <div style={styles.wrapper}>
      <style>{`
        @keyframes pulse{0%{transform:scale(0.95);opacity:0}50%{transform:scale(1.02)}100%{transform:scale(1);opacity:1}}
        @keyframes flashGold{0%,100%{background:rgba(245,158,11,0.15)}50%{background:rgba(245,158,11,0.4)}}
        .clue-item:hover{background:rgba(255,255,255,0.06)!important;}
        ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#334155;border-radius:3px}
      `}</style>

      <div style={styles.header}>
        <h1 style={styles.title}>⚽ SPORTS CROSSWORD 🏏</h1>
        <p style={styles.subtitle}>Cricket &amp; Football Edition</p>
        <span style={styles.badge}>Easy · 11 Words</span>
      </div>

      {completed&&(
        <div style={{...styles.completedBanner,animation:flash?'pulse 0.6s ease-out':'none'}}>
          <div style={{fontSize:28,marginBottom:4}}>🎉</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:'#4ade80'}}>
            Puzzle Complete!
          </div>
          <div style={{fontSize:13,color:'#86efac',marginTop:4}}>Well played, champion!</div>
        </div>
      )}

      <div style={styles.mainLayout}>
        {/* Grid Section */}
        <div style={styles.gridContainer}>
          <div style={styles.gridOuter}>
            <div
              ref={gridRef}
              tabIndex={0}
              onKeyDown={handleKeyDown}
              style={styles.grid}
              aria-label="Crossword grid"
            >
              {Array.from({length:ROWS},(_,row)=>
                Array.from({length:COLS},(_,col)=>{
                  const sol=SOLUTION[row][col];
                  const isBlack=sol===null;
                  const key=`${row},${col}`;
                  const num=CELL_NUMBERS[key];
                  const isSel=selected?.row===row&&selected?.col===col;
                  const isAct=activeCells.has(key);
                  const letter=userGrid[row][col];
                  const textColor=isBlack?'transparent':checked&&letter?(letter===sol?'#16a34a':'#dc2626'):(isSel?'#1c1c2e':isAct?'#166534':'#1c1c2e');
                  const bg=isBlack?'#0f172a':isSel?'#f59e0b':isAct?'#d1fae5':'#f8f9fa';

                  return(
                    <div
                      key={key}
                      onClick={()=>handleCellClick(row,col)}
                      style={{
                        width:CELL,height:CELL,
                        background:bg,
                        position:'relative',
                        display:'flex',
                        alignItems:'center',
                        justifyContent:'center',
                        cursor:isBlack?'default':'pointer',
                        transition:'background 0.1s',
                        userSelect:'none',
                      }}
                    >
                      {!isBlack&&num&&(
                        <span style={{
                          position:'absolute',top:2,left:2,
                          fontSize:9,fontWeight:700,
                          color:isSel?'#7c3700':isAct?'#166534':'#475569',
                          lineHeight:1,fontFamily:"'Courier Prime',monospace",
                        }}>{num}</span>
                      )}
                      {!isBlack&&(
                        <span style={{
                          fontSize:18,fontWeight:700,
                          color:textColor,
                          fontFamily:"'Courier Prime',monospace",
                          lineHeight:1,
                        }}>{letter}</span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Active clue bar */}
          <div style={styles.activeClueBar}>
            {activeWordObj
              ?<><strong>{activeWordObj.num}{direction==='across'?'A':'D'}</strong> {activeWordObj.sport} {activeWordObj.clue} <span style={{color:'#94a3b8'}}>({activeWordObj.len})</span></>
              :<span style={{color:'#475569'}}>Click a cell to begin</span>
            }
          </div>

          {/* Buttons */}
          <div style={styles.btnRow}>
            <button style={styles.btn('check')} onClick={()=>setChecked(c=>!c)}>
              {checked?'✓ Checking':'Check'}
            </button>
            <button style={styles.btn('danger')} onClick={handleReveal}>Reveal</button>
            <button style={styles.btn('default')} onClick={handleReset}>Reset</button>
          </div>
          {checked&&!completed&&(
            <p style={{textAlign:'center',fontSize:12,color:'#94a3b8',marginTop:8}}>
              🟢 correct · 🔴 incorrect
            </p>
          )}
        </div>

        {/* Clues Panel */}
        <div style={styles.cluesPanel}>
          {/* Across */}
          <div style={styles.clueSection}>
            <div style={styles.clueSectionTitle}>→ Across</div>
            {WORDS.across.map(w=>{
              const isActive=direction==='across'&&activeWordNum===w.num;
              return(
                <div
                  key={`a${w.num}`}
                  className="clue-item"
                  style={styles.clueItem(isActive)}
                  onClick={()=>handleClueClick(w.num,'across')}
                >
                  <span style={styles.clueNum(isActive)}>{w.num}.</span>
                  <span style={styles.clueText(isActive)}>
                    {w.sport} {w.clue} <span style={{color:'#475569'}}>({w.len})</span>
                  </span>
                </div>
              );
            })}
          </div>
          {/* Down */}
          <div style={styles.clueSection}>
            <div style={styles.clueSectionTitle}>↓ Down</div>
            {WORDS.down.map(w=>{
              const isActive=direction==='down'&&activeWordNum===w.num;
              return(
                <div
                  key={`d${w.num}`}
                  className="clue-item"
                  style={styles.clueItem(isActive)}
                  onClick={()=>handleClueClick(w.num,'down')}
                >
                  <span style={styles.clueNum(isActive)}>{w.num}.</span>
                  <span style={styles.clueText(isActive)}>
                    {w.sport} {w.clue} <span style={{color:'#475569'}}>({w.len})</span>
                  </span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{...styles.clueSection,padding:'10px 16px'}}>
            <div style={{display:'flex',gap:16,fontSize:12,color:'#64748b',justifyContent:'center'}}>
              <span>🏏 Cricket</span>
              <span>⚽ Football</span>
            </div>
            <div style={{marginTop:6,fontSize:11,color:'#475569',textAlign:'center'}}>
              Tab · next word &nbsp;|&nbsp; Arrows · navigate
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}