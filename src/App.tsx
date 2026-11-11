import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ArrowRight, AudioLines, ChevronDown, DoorOpen, Lightbulb, Moon, MousePointer2, RotateCcw, Sparkles, Volume2, X } from 'lucide-react'
import Stickman from './components/Stickman'
import { bedroomObjects, scenes, type SceneId } from './data/scenes'

type ObjectId = typeof bedroomObjects[number]['id']
type Mood = 'peaceful' | 'confused' | 'annoyed' | 'angry' | 'furious'
const lines = {
  lamp: ['Huh? Who turned that on?', 'I was literally sleeping.', 'STOP. TOUCHING. THE. SWITCH.'],
  alarm: ['It is NOT alarm time.', 'I heard you. I am choosing not to get up.', 'I am going to throw this thing.'],
  bed: ['WHAT was that?', 'Is there an earthquake?', 'I swear this bed is haunted.'],
  window: ['A breeze. Lovely.', 'Why is it freezing in here?', 'Could you close that?!'],
  curtains: ['The sun. My only enemy.', 'I was not emotionally prepared for daylight.'],
  pillow: ['Hey! Give that back!', 'That is MY pillow!', 'You absolute menace.'],
  blanket: ['It is cold! Give it back!', 'I am not playing this game.'],
  fan: ['A little airflow. Nice.', 'Why is my blanket flying away?'],
  phone: ['Who is calling at this hour?', 'If this is spam, I am blaming you.'],
  door: ['Who is it?', 'I am not opening the door.', 'GO AWAY.'],
  mosquito: ['Did something just buzz?', 'I can hear you, tiny demon.', 'HOLD STILL!'],
  clock: ['That clock is definitely wrong.', 'Time is a social construct. Apparently.'],
}
const randomScene = (): SceneId => {
  const saved = sessionStorage.getItem('life-scene')
  const options = scenes.filter(s => s.available).map(s => s.id)
  const choices = options.filter(s => s !== saved)
  return choices[Math.floor(Math.random() * choices.length)] || 'bedroom'
}
const moodFor = (n: number): Mood => n < 18 ? 'peaceful' : n < 38 ? 'confused' : n < 60 ? 'annoyed' : n < 82 ? 'angry' : 'furious'

export default function App() {
  const [intro, setIntro] = useState(!sessionStorage.getItem('life-intro'))
  const [scene, setScene] = useState<SceneId>(() => randomScene())
  const [hovered, setHovered] = useState<ObjectId | null>(null)
  const [active, setActive] = useState<Record<string, boolean>>({ lamp: false, window: false, curtains: false, blanket: true, fan: false })
  const [mood, setMood] = useState(4)
  const [energy, setEnergy] = useState(78)
  const [awake, setAwake] = useState(false)
  const [reaction, setReaction] = useState('...')
  const [dialogue, setDialogue] = useState('Zzz... just five more minutes.')
  const [pose, setPose] = useState('sleep')
  const [interactions, setInteractions] = useState(0)
  const [showPlaces, setShowPlaces] = useState(false)
  const [showHints, setShowHints] = useState(true)
  const [cursorNear, setCursorNear] = useState(false)
  const [fanSpeed, setFanSpeed] = useState(0)
  const [clockOffset, setClockOffset] = useState(0)
  const [mosquitoOn, setMosquitoOn] = useState(true)
  const [soundOn, setSoundOn] = useState(false)
  const sceneRef = useRef<HTMLDivElement>(null)
  const moodName = moodFor(mood)
  const isNight = !active.lamp && !active.curtains

  useEffect(() => { sessionStorage.setItem('life-scene', scene) }, [scene])
  useEffect(() => {
    const timer = window.setInterval(() => setEnergy(v => Math.max(8, v - (awake ? .25 : .04))), 5000)
    return () => clearInterval(timer)
  }, [awake])
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = sceneRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const x = ((e.clientX - r.left) / r.width) * 1100
      const y = ((e.clientY - r.top) / r.height) * 620
      const near = x > 430 && x < 690 && y > 280 && y < 560
      setCursorNear(near)
      if (near && mood > 48 && Math.random() > .985) setDialogue('I can SEE your little arrow, you know.')
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [mood])
  useEffect(() => {
    if (!reaction) return
    const t = window.setTimeout(() => setReaction(''), 1700)
    return () => clearTimeout(t)
  }, [reaction])
  const sceneLabel = useMemo(() => scenes.find(s => s.id === scene)?.name || 'Bedroom', [scene])

  function playTick() {
    if (!soundOn) return
    try {
      const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = mood > 65 ? 190 : 420
      gain.gain.setValueAtTime(0.045, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.11)
      osc.connect(gain); gain.connect(ctx.destination)
      osc.start(); osc.stop(ctx.currentTime + 0.12)
      osc.onended = () => void ctx.close()
    } catch { /* Audio is an optional enhancement. */ }
  }
  function speak(text: string, amount = 5, poseName = 'look') {
    playTick()
    setDialogue(text)
    setMood(v => Math.min(100, v + amount))
    setInteractions(v => v + 1)
    setReaction('!')
    setPose(poseName)
    if (!awake) setAwake(true)
    if (amount > 12) setEnergy(v => Math.max(8, v - 4))
  }
  function interact(id: ObjectId) {
    const count = interactions + 1
    const obj = bedroomObjects.find(o => o.id === id)!
    const list = lines[id]
    const line = list[Math.min(Math.floor((count - 1) / 3), list.length - 1)] || list[0]
    switch (id) {
      case 'lamp': setActive(v => ({ ...v, lamp: !v.lamp })); speak(active.lamp ? 'Oh, thank you. Wait... why did you turn it off?' : line, 8, 'startled'); break
      case 'alarm': speak(line, 11, 'angry'); setPose('angry'); break
      case 'bed': speak(line, 13, 'startled'); break
      case 'window': setActive(v => ({ ...v, window: !v.window })); speak(line, 7); break
      case 'curtains': setActive(v => ({ ...v, curtains: !v.curtains })); speak(line, 7, 'startled'); break
      case 'pillow': speak(line, 12, 'angry'); break
      case 'blanket': setActive(v => ({ ...v, blanket: !v.blanket })); speak(line, 10, 'startled'); break
      case 'fan': setFanSpeed(v => (v + 1) % 4); speak(line, 5); break
      case 'phone': speak(line, 9, 'startled'); break
      case 'door': speak(line, 8); break
      case 'mosquito': setMosquitoOn(v => !v); speak(line, 9, 'angry'); break
      case 'clock': setClockOffset(v => v + 3); speak(line, 6); break
    }
    if (count >= 8 && count % 4 === 0) {
      setDialogue('You know what? I am starting to think this is personal.')
      setMood(v => Math.min(100, v + 8))
    }
    if (mood > 78 && count % 3 === 0) setDialogue('THAT IS IT. I am watching YOU now.')
  }
  function changeScene(id: SceneId) {
    if (!scenes.find(s => s.id === id)?.available) return
    setShowPlaces(false)
    gsap.to(sceneRef.current, { opacity: 0, scale: .985, duration: .28, onComplete: () => {
      setScene(id); setActive({ lamp: false, window: false, curtains: false, blanket: true, fan: false })
      setHovered(null); setDialogue('New place. Same peace. Please let me have it.'); setAwake(true); setPose('look')
      gsap.to(sceneRef.current, { opacity: 1, scale: 1, duration: .65, ease: 'power2.out' })
    } })
  }
  function begin() {
    sessionStorage.setItem('life-intro', '1')
    setIntro(false)
    setDialogue('Zzz... just five more minutes.')
  }
  function resetDay() {
    setMood(4); setEnergy(78); setAwake(false); setInteractions(0); setActive({ lamp: false, window: false, curtains: false, blanket: true, fan: false }); setDialogue('Zzz... just five more minutes.'); setPose('sleep')
  }

  return <main className="app-shell">
    {/* Full-screen scene: only essential controls float over the world. */}
    <section className="game-frame">
      <div ref={sceneRef} className={`scene scene-${scene} ${active.lamp ? 'lamp-on' : ''} ${active.curtains ? 'curtains-open' : ''}`}>
        <div className="world-location"> <Moon size={13}/> <span>{sceneLabel.toUpperCase()}</span> <button className="world-places" onClick={() => setShowPlaces(v => !v)} aria-label="Explore places"><DoorOpen size={15}/></button></div>
        <div className="world-controls">
          <button className="world-control" title={soundOn ? 'Mute sounds' : 'Enable sounds'} onClick={() => setSoundOn(v => !v)}><Volume2 size={16}/></button>
          <button className={`world-control ${showHints ? 'control-active' : ''}`} title="Toggle interaction hints" onClick={() => setShowHints(v => !v)}><MousePointer2 size={16}/></button>
          <button className="world-control" title="Reset this day" onClick={resetDay}><RotateCcw size={15}/></button>
        </div>
        <svg className="scene-art" viewBox="0 0 1100 620" role="img" aria-label="Hand-drawn monochrome bedroom with a bed, window, fan, bedside table and interactive objects">
          <defs>
            <pattern id="pencilHatch" width="12" height="12" patternUnits="userSpaceOnUse">
              <path d="M-2 12 L12 -2 M4 16 L16 4" stroke="#111" strokeWidth=".8" opacity=".12"/>
            </pattern>
            <pattern id="fabricHatch" width="16" height="16" patternUnits="userSpaceOnUse">
              <path d="M0 4 Q4 1 8 4 T16 4 M0 12 Q4 9 8 12 T16 12" fill="none" stroke="#111" strokeWidth=".7" opacity=".15"/>
            </pattern>
            <filter id="pencilSoft"><feGaussianBlur stdDeviation="2"/></filter>
          </defs>

          <!-- paper, wall and floor: deliberately uneven ink contours -->
          <rect width="1100" height="620" fill="#fff"/>
          <path d="M0 0 H1100 V448 Q850 445 560 451 T0 447Z" fill="#fff" stroke="#171717" strokeWidth="3"/>
          <path d="M0 449 Q270 445 550 451 T1100 447 V620 H0Z" fill="#fafafa" stroke="#171717" strokeWidth="3"/>
          <path d="M0 462 Q300 456 550 463 T1100 459" fill="none" stroke="#111" strokeWidth="2"/>
          <path d="M0 469 Q260 464 550 470 T1100 466" fill="none" stroke="#111" strokeWidth="1" opacity=".35"/>
          <g fill="none" stroke="#111" strokeWidth="1.6" opacity=".22">
            <path d="M0 515 Q220 507 430 517 T860 515 T1100 516"/>
            <path d="M0 585 Q230 575 450 588 T880 585 T1100 586"/>
            <path d="M170 465 L205 620 M410 464 L450 620 M690 464 L725 620 M950 463 L985 620"/>
          </g>
          <path d="M0 0 H1100 V448 H0Z" fill="url(#pencilHatch)" opacity=".24"/>

          <!-- window and loose curtains -->
          <g className="window-object" stroke="#111" strokeWidth="5" strokeLinejoin="round">
            <path d="M92 105 Q92 94 106 94 H302 Q316 94 316 108 V292 H92Z" fill="#fff"/>
            <path d="M105 111 H303 V278 H105Z" fill="#fff"/>
            <path d="M204 111 Q201 190 204 278 M105 194 Q205 190 303 194" fill="none" strokeWidth="7"/>
            <path d="M107 263 Q151 220 202 252 T302 245 V278 H107Z" fill="#f7f7f7" strokeWidth="2"/>
            <path d="M108 260 Q150 232 193 253 M217 250 Q260 226 301 244" fill="none" strokeWidth="1.6"/>
          </g>
          <g className="curtain-object" fill="#fff" stroke="#111" strokeWidth="4" strokeLinejoin="round">
            <path d="M75 79 Q112 57 151 82 L145 328 Q110 308 77 337Z"/>
            <path d="M326 81 Q291 59 254 82 L261 329 Q293 310 326 338Z"/>
            <path d="M88 92 Q111 80 137 91 M88 112 Q111 99 139 111 M273 93 Q296 80 315 94 M271 116 Q293 102 316 116" fill="none" strokeWidth="1.4"/>
          </g>

          <!-- framed wall picture and little wall shelf -->
          <g stroke="#111" strokeWidth="4" strokeLinejoin="round">
            <path d="M825 106 Q825 98 836 98 H1000 Q1010 98 1010 108 V218 H825Z" fill="#fff"/>
            <path d="M839 112 H995 V204 H839Z" fill="#fff" strokeWidth="2"/>
            <path d="M850 190 Q883 130 916 180 T983 145" fill="none" strokeWidth="3"/>
            <path d="M863 176 l18 -30 18 30 M928 177 l18 -37 19 37" fill="#fff" strokeWidth="2.5"/>
            <path d="M846 222 H1002" strokeWidth="2"/>
          </g>

          <!-- ceiling fan, drawn with slightly imperfect blades -->
          <g className="fan-object" stroke="#111" strokeWidth="4" strokeLinejoin="round">
            <path d="M550 0 V54" fill="none"/>
            <circle cx="550" cy="65" r="10" fill="#fff"/>
            <g className={fanSpeed ? 'fan-spin' : ''} style={{ transformOrigin: '550px 65px' }} fill="#fff">
              <path d="M548 62 Q503 4 520 1 Q543 0 556 59Z"/>
              <path d="M554 63 Q615 25 621 42 Q628 61 559 72Z"/>
              <path d="M547 70 Q527 132 510 119 Q499 104 542 65Z"/>
            </g>
          </g>

          <!-- door with panel detail -->
          <g className="door-object" stroke="#111" strokeWidth="5" strokeLinejoin="round">
            <path d="M1005 135 Q1005 126 1017 126 H1080 V449 H1005Z" fill="#fff"/>
            <path d="M1018 149 H1067 V259 H1018Z M1018 278 H1067 V420 H1018Z" fill="none" strokeWidth="2"/>
            <circle cx="1060" cy="293" r="7" fill="#111" stroke="none"/>
            <path d="M1025 157 H1059 M1025 287 H1059 M1025 410 H1059" strokeWidth="1.3"/>
          </g>

          <!-- bedside table and alarm clock -->
          <g stroke="#111" strokeWidth="4" strokeLinejoin="round">
            <path d="M270 382 Q270 374 281 374 H410 V462 H270Z" fill="#fff"/>
            <path d="M280 462 V490 M400 462 V490 M275 490 H407" fill="none" strokeWidth="5"/>
            <path d="M292 390 H389 V447 H292Z" fill="url(#fabricHatch)" strokeWidth="2"/>
          </g>
          <g className="alarm-object" stroke="#111" strokeWidth="4" strokeLinejoin="round">
            <path d="M337 350 Q337 342 346 342 H384 Q393 342 393 351 V380 H337Z" fill="#fff"/>
            <circle cx="365" cy="348" r="25" fill="#fff"/>
            <path d="M365 348 L365 332 M365 348 L378 355" strokeWidth="3" strokeLinecap="round"/>
            <path d="M348 326 l-9 -10 M382 326 l9 -10" fill="none"/>
            <path d="M353 374 Q365 380 377 374" fill="none" strokeWidth="2"/>
          </g>

          <!-- bed frame, mattress and headboard -->
          <g className="bed-object" stroke="#111" strokeLinejoin="round">
            <ellipse cx="590" cy="566" rx="310" ry="18" fill="#111" opacity=".10" stroke="none"/>
            <path d="M318 365 Q318 340 345 340 H785 Q812 340 812 368 V531 H318Z" fill="#fff" strokeWidth="6"/>
            <path d="M337 365 Q337 356 350 356 H767 Q789 356 789 373 V498 H337Z" fill="#fff" strokeWidth="3"/>
            <path d="M339 373 Q335 310 365 293 Q395 275 430 294 Q448 307 449 350" fill="#fff" strokeWidth="5"/>
            <path d="M449 350 Q470 330 505 340" fill="none" strokeWidth="2"/>
            <path d="M353 378 Q560 360 787 379" fill="none" strokeWidth="2"/>
            <path d="M340 491 Q555 507 790 490 V532 H340Z" fill="url(#fabricHatch)" strokeWidth="2"/>
            <path d="M359 532 V582 M770 532 V582" fill="none" strokeWidth="12"/>
            <path d="M343 582 H375 M754 582 H786" fill="none" strokeWidth="7"/>
          </g>

          <!-- pillow and folded blanket -->
          <g stroke="#111" strokeWidth="3.5" strokeLinejoin="round">
            <path d="M367 367 Q367 350 387 350 H467 Q486 352 482 377 L478 405 Q475 420 456 416 L384 407 Q365 403 367 367Z" fill="#fff"/>
            <path d="M385 366 Q416 358 462 370 M382 394 Q421 401 464 397" fill="none" strokeWidth="1.5"/>
          </g>
          {active.lamp && <ellipse cx="760" cy="390" rx="180" ry="160" fill="#111" opacity=".035"/>}
          <g className="lamp-object" stroke="#111" strokeWidth="4" strokeLinejoin="round">
            <path d="M738 429 V343" fill="none" strokeWidth="7"/>
            <path d="M705 344 Q738 281 771 344Z" fill="#fff"/>
            <path d="M717 345 Q738 330 759 345" fill="none" strokeWidth="1.6"/>
            <ellipse cx="738" cy="430" rx="34" ry="8" fill="#fff"/>
          </g>

          <!-- wall clock -->
          <g className="clock-object" stroke="#111" strokeWidth="4">
            <circle cx="570" cy="174" r="42" fill="#fff"/>
            <circle cx="570" cy="174" r="3" fill="#111"/>
            <path d={`M570 174 L570 ${149 + clockOffset}`} strokeWidth="3" strokeLinecap="round"/>
            <path d="M570 174 L590 186" strokeWidth="3" strokeLinecap="round"/>
            <path d="M570 139 V145 M605 174 H599 M570 209 V203 M535 174 H541" strokeWidth="2"/>
          </g>

          <!-- mosquito, drawn as a tiny comic nuisance -->
          <g className="mosquito-object" style={{ opacity: mosquitoOn ? 1 : .15 }} stroke="#111" strokeWidth="2.5" fill="none" strokeLinecap="round">
            <path d="M630 345 q-8 -13 -16 -2 M630 345 q8 -13 16 -2 M630 345 l-3 12 M630 345 l4 12 M627 344 l-8 -8 M633 344 l8 -8"/>
            <circle cx="630" cy="344" r="3" fill="#111"/>
          </g>

          <!-- character and blanket remain in front of the bed -->
          <Stickman mood={mood} awake={awake} reaction={reaction} cursorNear={cursorNear} pose={pose} />
          <g className="blanket-overlay" opacity={active.blanket ? 1 : 0} stroke="#111" strokeWidth="4" strokeLinejoin="round">
            <path d="M490 447 Q550 427 610 450 L625 520 Q560 540 500 515Z" fill="#fff"/>
            <path d="M503 461 Q555 449 607 463 M508 498 Q558 516 615 502" fill="none" strokeWidth="1.5"/>
          </g>
          {active.window && <g fill="none" stroke="#111" strokeWidth="2"><path d="M115 280 Q200 310 295 280" strokeDasharray="5 8"/><path d="M125 292 q-10 14 -20 18 M275 292 q10 14 20 18"/></g>}
          <g fill="none" stroke="#111" strokeWidth="1.2" opacity=".35">
            <path d="M0 606 Q220 580 440 606 T880 606 T1320 606"/>
            <path d="M10 612 Q240 588 460 612 T900 612"/>
          </g>
        </svg>  </svg>
        <div className="night-vignette" />
        {isNight && <div className="night-overlay" />}
        <div className="scene-grain" />
        <div className="scene-dialogue"><span className="dialogue-tail" /><span>{dialogue}</span></div>

        {bedroomObjects.map((obj, index) => {
          const positions: Record<ObjectId, { left: string; top: string; width: string; height: string }> = {
            lamp: { left: '64%', top: '49%', width: '8%', height: '22%' },
            alarm: { left: '30%', top: '56%', width: '8%', height: '12%' },
            bed: { left: '25%', top: '62%', width: '49%', height: '27%' },
            window: { left: '12%', top: '12%', width: '15%', height: '33%' },
            curtains: { left: '6%', top: '10%', width: '5%', height: '40%' },
            pillow: { left: '29%', top: '62%', width: '13%', height: '9%' },
            blanket: { left: '43%', top: '69%', width: '18%', height: '16%' },
            fan: { left: '43%', top: '0%', width: '15%', height: '23%' },
            phone: { left: '73%', top: '75%', width: '7%', height: '12%' },
            door: { left: '90%', top: '18%', width: '9%', height: '55%' },
            mosquito: { left: '55%', top: '52%', width: '8%', height: '8%' },
            clock: { left: '49%', top: '17%', width: '6%', height: '15%' },
          }
          const p = positions[obj.id]
          return <button key={obj.id} className={`hotspot ${hovered === obj.id ? 'is-hovered' : ''} ${showHints ? 'show-hint' : ''}`} style={{ left: p.left, top: p.top, width: p.width, height: p.height }} onMouseEnter={() => setHovered(obj.id)} onMouseLeave={() => setHovered(null)} onFocus={() => setHovered(obj.id)} onBlur={() => setHovered(null)} onClick={() => interact(obj.id)} aria-label={`${obj.name}: ${obj.hint}`}>
            <span className="hotspot-ring" /><span className="hotspot-label">{obj.name}</span>{hovered === obj.id && <span className="tooltip"><b>{obj.name}</b><small>{obj.hint}</small><i>CLICK TO MESS WITH HIM ↗</i></span>}
          </button>
        })}
        <button className="world-disturb" onClick={() => interact(bedroomObjects[Math.floor(Math.random() * bedroomObjects.length)].id)}><Sparkles size={14}/> DISTURB HIM</button>
        {showPlaces && <div className="places-panel"><div className="places-head"><div><small>CHOOSE YOUR NEXT VICTIM</small><strong>Where is he now?</strong></div><button onClick={() => setShowPlaces(false)} aria-label="Close places"><X size={17}/></button></div><div className="places-grid">{scenes.map(s => <button key={s.id} disabled={!s.available} className={scene === s.id ? 'selected' : ''} onClick={() => changeScene(s.id)}><span>{s.icon}</span><b>{s.name}</b><small>{s.available ? s.subtitle : 'COMING SOON'}</small></button>)}</div><p>More places are being prepared. He has no idea.</p></div>}
      </div>
    </section>

    {intro && <div className="intro-overlay"><div className="intro-card"><div className="intro-kicker"><span className="brand-mark">L.</span> A TINY LIFE SIMULATOR</div><div className="intro-art"><div className="intro-moon"/><div className="intro-bed"/><div className="intro-stick"><span/><i/><b/></div><span className="intro-zzz">Z z z</span></div><p className="eyebrow">SUBJECT #001 / CURRENTLY UNWARE</p><h2>He has a life.<br/><em>You have other plans.</em></h2><p className="intro-copy">Meet your new favourite human. He has dreams, a routine, and absolutely no idea what's coming. He just wants to live peacefully.</p><p className="intro-punch">Unfortunately, you've arrived.</p><div className="intro-rules"><span>01 <b>Explore</b> his little world</span><span>02 <b>Find</b> things you can interact with</span><span>03 <b>Ruin</b> his perfectly normal day</span></div><button className="begin-button" onClick={begin}>LET THE CHAOS BEGIN <ArrowRight size={17}/></button><small className="intro-foot">NO STICKMEN WERE CONSULTED IN THE MAKING OF THIS EXPERIENCE.</small></div></div>}
  </main>
}