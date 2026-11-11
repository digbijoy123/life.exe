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
        <svg className="scene-art" viewBox="0 0 1100 620" role="img" aria-label="A hand-drawn bedroom with a sleeping stickman and interactive objects">
          <defs>
            <linearGradient id="wall" x2="0" y2="1"><stop stopColor="#d9c9b7"/><stop offset="1" stopColor="#c7b39f"/></linearGradient>
            <linearGradient id="floor" x2="0" y2="1"><stop stopColor="#9b7564"/><stop offset="1" stopColor="#75584f"/></linearGradient>
            <radialGradient id="lampGlow"><stop stopColor="#ffe5a4" stopOpacity=".7"/><stop offset="1" stopColor="#ffe5a4" stopOpacity="0"/></radialGradient>
            <pattern id="wallpaper" width="42" height="42" patternUnits="userSpaceOnUse"><path d="M21 8 q5 5 0 10 q-5 -5 0 -10 M21 25 q5 5 0 10 q-5 -5 0 -10" fill="none" stroke="#a88f7d" strokeOpacity=".18" strokeWidth="1.2"/></pattern>
            <filter id="soft"><feGaussianBlur stdDeviation="22"/></filter>
          </defs>
          <rect width="1100" height="455" fill="url(#wall)"/><rect width="1100" height="455" fill="url(#wallpaper)"/>
          <path d="M0 455 H1100 V620 H0Z" fill="url(#floor)"/><path d="M0 457 H1100" stroke="#4f3b38" strokeWidth="7" opacity=".35"/>
          <path d="M0 485 H1100 M0 555 H1100" stroke="#d7ad8c" strokeWidth="2" opacity=".18"/>
          <g opacity=".5" stroke="#4d3c3a" strokeWidth="2"><path d="M120 455 L150 620 M340 455 L370 620 M560 455 L590 620 M780 455 L810 620 M1000 455 L1030 620"/></g>
          <g className="window-object"><rect x="92" y="86" width="220" height="190" rx="5" fill="#6c5d5a"/><rect x="101" y="95" width="202" height="172" fill="#34495b"/><circle cx="253" cy="130" r="21" fill="#f1d9a3"/><path d="M101 200 Q150 160 190 202 T303 188 V267 H101Z" fill="#637b76"/><path d="M202 95 V267 M101 180 H303" stroke="#e5d5c4" strokeWidth="9"/><path d="M80 70 Q115 50 150 75 L150 292 Q110 280 80 300Z M315 70 Q280 50 245 75 L245 292 Q285 280 315 300Z" fill="#9c6662" stroke="#6d4b4b" strokeWidth="5"/></g>
          <g><rect x="810" y="92" width="175" height="120" rx="5" fill="#7d6657" stroke="#51433e" strokeWidth="7"/><rect x="821" y="103" width="153" height="98" fill="#d9c4a9"/><path d="M835 186 Q880 130 930 170 T965 140" stroke="#a0a58a" strokeWidth="7" fill="none"/><path d="M850 165 l15 -28 15 28 M915 174 l17 -34 16 34" fill="#83917b"/></g>
          <g className="door-object"><rect x="1000" y="125" width="82" height="332" rx="4" fill="#795d50" stroke="#4b3d39" strokeWidth="8"/><circle cx="1060" cy="300" r="7" fill="#d9b76e"/><path d="M1010 145 H1070 M1010 435 H1070" stroke="#b58e71" strokeWidth="4"/></g>
          <g><rect x="0" y="432" width="1100" height="28" fill="#a98a72" opacity=".6"/></g>
          {active.lamp && <ellipse cx="720" cy="320" rx="290" ry="245" fill="url(#lampGlow)" />}
          <g className="bed-object"><ellipse cx="550" cy="545" rx="270" ry="22" fill="#30262a" opacity=".25"/><path d="M280 425 Q280 390 320 390 H770 Q810 390 810 430 V535 H280Z" fill="#5d4a4d" stroke="#3e343b" strokeWidth="7"/><path d="M295 425 Q300 402 330 402 H760 Q790 402 795 430 V500 H295Z" fill="#b77e79"/><path d="M300 460 Q500 430 790 464 V526 H300Z" fill="#7d777d"/><path d="M310 470 Q430 450 530 475 T790 470" fill="none" stroke="#d5a49a" strokeWidth="4" opacity=".5"/><rect x="300" y="520" width="25" height="48" rx="4" fill="#493a3c"/><rect x="765" y="520" width="25" height="48" rx="4" fill="#493a3c"/><rect x="330" y="395" width="115" height="48" rx="15" fill="#eee2d0" stroke="#827a76" strokeWidth="4"/><path d="M350 410 q25 -8 70 0" stroke="#b3a39b" strokeWidth="3" fill="none"/></g>
          <g className="alarm-object"><rect x="340" y="395" width="62" height="35" rx="5" fill="#8b6a57" stroke="#51413e" strokeWidth="4"/><circle cx="370" cy="380" r="20" fill="#e8d9bd" stroke="#65534d" strokeWidth="4"/><path d="M370 380 L370 366 M370 380 L381 385" stroke="#574a47" strokeWidth="3" strokeLinecap="round"/><path d="M354 361 l-7 -9 M386 361 l7 -9" stroke="#574a47" strokeWidth="4" strokeLinecap="round"/></g>
          <g className="lamp-object"><path d="M730 435 V345" stroke="#55433d" strokeWidth="8"/><path d="M710 345 Q730 300 750 345Z" fill="#e5bb79" stroke="#685248" strokeWidth="5"/><ellipse cx="730" cy="435" rx="31" ry="8" fill="#685248"/><path d="M730 430 V442" stroke="#e4bd7e" strokeWidth="5"/></g>
          <g className="clock-object"><circle cx="570" cy="155" r="43" fill="#e9dfce" stroke="#6e5c54" strokeWidth="6"/><circle cx="570" cy="155" r="4" fill="#554a48"/><path d={`M570 155 L570 ${130 + clockOffset}`} stroke="#5b4b47" strokeWidth="4" strokeLinecap="round"/><path d="M570 155 L590 165" stroke="#5b4b47" strokeWidth="3" strokeLinecap="round"/><text x="570" y="118" textAnchor="middle" fontSize="9" fill="#75645b">12</text></g>
          <g className="fan-object"><path d="M550 0 V55" stroke="#544b4a" strokeWidth="7"/><circle cx="550" cy="66" r="11" fill="#51484a"/><g className={fanSpeed ? 'fan-spin' : ''} style={{ transformOrigin: '550px 66px' }} fill="#7b6b68"><path d="M550 65 Q500 5 525 2 Q555 8 555 62Z"/><path d="M551 66 Q615 20 615 49 Q600 75 555 71Z"/><path d="M550 67 Q570 130 542 128 Q520 108 545 69Z"/></g></g>
          <g className="phone-object"><rect x="815" y="472" width="35" height="62" rx="7" fill="#35323b" stroke="#d5c3aa" strokeWidth="3"/><rect x="820" y="480" width="25" height="43" rx="3" fill="#a4b5a0"/><circle cx="832" cy="528" r="2" fill="#eee"/></g>
          <g className="mosquito-object" style={{ opacity: mosquitoOn ? 1 : .15 }}><path d="M630 345 q-8 -13 -16 -2 M630 345 q8 -13 16 -2 M630 345 l-3 12 M630 345 l4 12" stroke="#403a43" strokeWidth="2.5" fill="none" strokeLinecap="round"/><circle cx="630" cy="344" r="3" fill="#403a43"/></g>
          <g className="door-knock"><path d="M1040 265 q-24 0 -24 24 M1040 265 q24 0 24 24" stroke="#e7c18a" strokeWidth="4" fill="none"/></g>
          <Stickman mood={mood} awake={awake} reaction={reaction} cursorNear={cursorNear} pose={pose} />
          <g className="blanket-overlay" opacity={active.blanket ? 1 : 0}><path d="M490 447 Q550 430 610 450 L625 520 Q560 540 500 515Z" fill="#8b8190" stroke="#544b59" strokeWidth="5"/></g>
          {active.window && <path d="M100 280 Q200 320 310 280" stroke="#d6e4d2" strokeWidth="4" fill="none" strokeDasharray="8 8" />}
          <g opacity=".2"><path d="M0 610 Q220 580 440 610 T880 610 T1320 610" stroke="#ead5bc" strokeWidth="4" fill="none"/></g>
        </svg>
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