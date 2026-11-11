import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Volume2, VolumeX, RotateCcw, MousePointer2, Sparkles, MapPin, X } from 'lucide-react'
import Stickman from './components/Stickman'
import { bedroomObjects, scenes, type SceneId } from './data/scenes'

const lines: Record<string, string[]> = {
  lamp: ['Who turned that on? It was peaceful two seconds ago.', 'I was enjoying the dark. Thanks.', 'I am going to unscrew that bulb.'],
  alarm: ['That alarm is not supposed to ring yet!', 'I heard it. I heard it. Please stop.', 'I am throwing this clock out the window.'],
  bed: ['HEY! I was comfortable!', 'The mattress has done nothing to you.', 'I am holding on to the bed frame.'],
  window: ['A breeze? At this hour?', 'Close that. CLOSE THAT.', 'You are paying my heating bill.'],
  curtains: ['Sunlight. My only weakness.', 'I liked it better when it was dark.', 'Stop rearranging my circadian rhythm.'],
  pillow: ['My pillow! Give it back.', 'That is not a toy!', 'I am sleeping on your keyboard tonight.'],
  blanket: ['It is cold! Put that back!', 'I was under there!', 'This is a blanket-related crime.'],
  fan: ['Could you not change the fan speed?', 'I am either freezing or melting.', 'I will unplug it. I mean it.'],
  phone: ['Who keeps calling me?', 'If that is spam, I blame you.', 'I am putting you on silent.'],
  door: ['Who is it? Nobody? Then why knock?', 'Stop knocking!', 'I am not opening that door.'],
  mosquito: ['There is a mosquito in here!', 'I can hear it. I can FEEL it.', 'I am negotiating with an insect now.'],
  clock: ['Time is an illusion. Apparently.', 'Why is the clock doing that?', 'You have officially broken time.'],
}
const sceneHotspots = [
  {id:'curtains',x:8,y:12,w:23,h:43,label:'Curtains'},
  {id:'window',x:13,y:17,w:18,h:32,label:'Window'},
  {id:'clock',x:45,y:19,w:8,h:12,label:'Wall clock'},
  {id:'fan',x:43,y:1,w:15,h:20,label:'Ceiling fan'},
  {id:'alarm',x:14,y:52,w:7,h:9,label:'Alarm clock'},
  {id:'lamp',x:13,y:46,w:10,h:13,label:'Bedside lamp'},
  {id:'bed',x:29,y:47,w:38,h:36,label:'Bed frame'},
  {id:'pillow',x:32,y:55,w:18,h:11,label:'Pillows'},
  {id:'blanket',x:29,y:64,w:38,h:15,label:'Blanket'},
  {id:'phone',x:70,y:61,w:5,h:9,label:'Phone'},
  {id:'door',x:78,y:39,w:9,h:33,label:'Wardrobe / door'},
  {id:'mosquito',x:54,y:40,w:8,h:9,label:'Mosquito'},
]
export default function App() {
  const [intro,setIntro]=useState(true)
  const [mood,setMood]=useState(0)
  const [energy,setEnergy]=useState(82)
  const [counts,setCounts]=useState<Record<string,number>>({})
  const [dialogue,setDialogue]=useState('Psst. I can see your cursor. What are you planning?')
  const [soundOn,setSoundOn]=useState(false)
  const [showPlaces,setShowPlaces]=useState(false)
  const [scene,setScene]=useState<SceneId>('bedroom')
  const [cursorNear,setCursorNear]=useState(false)
  const [pose,setPose]=useState('idle')
  const [awake,setAwake]=useState(false)
  const [fanSpeed,setFanSpeed]=useState(1)
  const [lampOn,setLampOn]=useState(false)
  const [windowOpen,setWindowOpen]=useState(false)
  const [curtainsOpen,setCurtainsOpen]=useState(false)
  const [clockShift,setClockShift]=useState(0)
  const [blanketPulled,setBlanketPulled]=useState(false)
  const [pillowMoved,setPillowMoved]=useState(false)
  const [showHints,setShowHints]=useState(true)
  const root=useRef<HTMLElement>(null)
  const audio=useRef<AudioContext|null>(null)
  const timeout=useRef<number|undefined>(undefined)
  const level=Math.min(100,mood)
  const moodName=level<18?'PEACEFUL':level<38?'CURIOUS':level<58?'ANNOYED':level<78?'FRUSTRATED':'FURIOUS'

  useEffect(()=>{
    const ctx=gsap.context(()=>{
      gsap.to('.fan-blades',{rotation:360,transformOrigin:'0px 0px',duration:fanSpeed===0?0:Math.max(.35,2.8/fanSpeed),repeat:-1,ease:'none',paused:fanSpeed===0})
      gsap.to('.left-lamp,.right-lamp',{y:-1.5,duration:2.8,repeat:-1,yoyo:true,ease:'sine.inOut',stagger:.35})
      gsap.to('.curtain-left',{x:-3,duration:3.2,repeat:-1,yoyo:true,ease:'sine.inOut'})
      gsap.to('.curtain-right',{x:3,duration:3.5,repeat:-1,yoyo:true,ease:'sine.inOut'})
      gsap.to('.plant',{rotation:1.4,transformOrigin:'50% 100%',duration:2.5,repeat:-1,yoyo:true,ease:'sine.inOut'})
      gsap.to('.wall-clock,.alarm-clock',{rotation:1.2,transformOrigin:'50% 50%',duration:2.2,repeat:-1,yoyo:true,ease:'sine.inOut'})
      gsap.to('.wall-art',{y:-1.5,duration:4,repeat:-1,yoyo:true,ease:'sine.inOut'})
      gsap.to('.phone-object',{y:-1,duration:1.5,repeat:-1,yoyo:true,ease:'sine.inOut'})
      gsap.to('.mosquito-object',{x:12,y:-9,duration:.9,repeat:-1,yoyo:true,ease:'sine.inOut'})
      gsap.to('.rug',{y:1,duration:4,repeat:-1,yoyo:true,ease:'sine.inOut'})
      gsap.to('.bed-cover',{y:1.2,duration:3.4,repeat:-1,yoyo:true,ease:'sine.inOut'})
      gsap.to('.pillows',{y:1,duration:3.1,repeat:-1,yoyo:true,ease:'sine.inOut'})
      gsap.to('.wardrobe',{x:0,duration:3,repeat:-1,yoyo:true,ease:'sine.inOut'})
    },root)
    return ()=>ctx.revert()
  },[fanSpeed])

  useEffect(()=>{
    const node=root.current
    if(!node)return
    const onMove=(e:MouseEvent)=>{const rect=node.getBoundingClientRect();const near=Math.abs(e.clientX-(rect.left+rect.width*.5))<160&&Math.abs(e.clientY-(rect.top+rect.height*.57))<180;setCursorNear(near)}
    node.addEventListener('mousemove',onMove)
    return ()=>node.removeEventListener('mousemove',onMove)
  },[])
  useEffect(()=>{const id=window.setInterval(()=>setEnergy(v=>Math.max(20,v-.25)),7000);return()=>window.clearInterval(id)},[])
  useEffect(()=>()=>{if(timeout.current)window.clearTimeout(timeout.current);audio.current?.close()},[])
  function sound(){
    if(!soundOn)return
    try{const AC=window.AudioContext||(window as typeof window & {webkitAudioContext?:typeof AudioContext}).webkitAudioContext;if(!AC)return;audio.current??=new AC();const osc=audio.current.createOscillator();const gain=audio.current.createGain();osc.connect(gain);gain.connect(audio.current.destination);osc.frequency.value=520;gain.gain.setValueAtTime(.08,audio.current.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audio.current.currentTime+.18);osc.start();osc.stop(audio.current.currentTime+.18)}catch{}
  }
  function interact(id:string){
    const next=(counts[id]||0)+1
    setCounts(v=>({...v,[id]:next}))
    setMood(v=>Math.min(100,v+(next===1?7:next===2?10:13)))
    setEnergy(v=>Math.max(12,v-2))
    setAwake(true)
    setPose(id==='bed'?'startled':id==='fan'?'annoyed':'angry')
    const options=lines[id]||['Seriously?']
    setDialogue(options[Math.min(next-1,options.length-1)])
    sound()
    if(id==='lamp')setLampOn(v=>!v)
    if(id==='window')setWindowOpen(v=>!v)
    if(id==='curtains')setCurtainsOpen(v=>!v)
    if(id==='fan')setFanSpeed(v=>(v+1)%4)
    if(id==='alarm')setDialogue(next>1?'I AM AWAKE. THE WHOLE STREET IS AWAKE.':'BEEP BEEP BEEP. Happy now?')
    if(id==='phone')setDialogue('BZZZT. BZZZT. It is probably you. It is always you.')
    if(id==='door')setDialogue('KNOCK KNOCK. Who is there? YOUR WORST NIGHTMARE.')
    if(id==='mosquito')setDialogue('I have made an enemy of something smaller than a pea.')
    if(id==='clock')setClockShift(v=>v+1)
    if(id==='pillow')setPillowMoved(v=>!v)
    if(id==='blanket')setBlanketPulled(v=>!v)
    if(id==='bed'&&root.current)gsap.fromTo(root.current.querySelector('.bed'),{x:-9},{x:9,duration:.08,repeat:7,yoyo:true,clearProps:'x'})
    if(id==='alarm')gsap.fromTo(root.current?.querySelector('.alarm-clock'),{rotation:-12},{rotation:12,duration:.08,repeat:8,yoyo:true})
    if(id==='phone')gsap.fromTo(root.current?.querySelector('.phone-object'),{rotation:-8},{rotation:8,duration:.09,repeat:8,yoyo:true})
    if(id==='door')gsap.fromTo(root.current?.querySelector('.wardrobe'),{x:0},{x:-5,duration:.16,repeat:5,yoyo:true})
    if(id==='mosquito')gsap.fromTo(root.current?.querySelector('.mosquito-object'),{scale:1},{scale:1.5,duration:.12,repeat:5,yoyo:true,transformOrigin:'center'})
    if(timeout.current)window.clearTimeout(timeout.current)
    timeout.current=window.setTimeout(()=>setPose('idle'),900)
  }
  function randomDisturb(){const ids=bedroomObjects.map(o=>o.id);interact(ids[Math.floor(Math.random()*ids.length)])}
  function reset(){setMood(0);setEnergy(82);setCounts({});setDialogue('Peace. Finally.');setAwake(false);setPose('idle');setLampOn(false);setWindowOpen(false);setCurtainsOpen(false);setFanSpeed(1);setBlanketPulled(false);setPillowMoved(false);setClockShift(0)}
  const availableScenes=scenes.filter(s=>s.available)
  return (
    <main ref={root} className="restored-app">
      {intro&&<div className="intro-overlay"><div className="intro-card"><div className="intro-kicker">✦ LIFE.EXE PRESENTS ✦</div><div className="intro-art"><span className="intro-moon"/><div className="intro-bed"/><div className="intro-stick"><span/><i/><b/></div><div className="intro-zzz">Zz</div></div><h2>Someone is having<br/><em>a peaceful day.</em></h2><p className="intro-copy">This is your tiny sandbox. He has a routine, a temper, and absolutely no idea what you are about to do.</p><p className="intro-punch">Let's ruin his peace.</p><div className="intro-rules"><span><b>YOU</b> control the room</span><span><b>HE</b> reacts to chaos</span><span><b>CHAOS</b> is cumulative</span></div><button className="begin-button" onClick={()=>setIntro(false)}>ENTER HIS ROOM <span>→</span></button><small className="intro-foot">BEST EXPERIENCED WITH SOUND ON</small></div></div>}
      <section className="restored-world">
        <div className="world-location"><MapPin size={13}/><span>BEDROOM</span><button className="world-places" onClick={()=>setShowPlaces(v=>!v)} aria-label="Choose environment">⌄</button></div>
        <div className="world-controls">
          <button className="world-control" onClick={()=>setSoundOn(v=>!v)} aria-label="Toggle sound">{soundOn?<Volume2 size={17}/>:<VolumeX size={17}/>}</button>
          <button className="world-control" onClick={()=>setShowHints(v=>!v)} aria-label="Toggle object hints"><MousePointer2 size={17}/></button>
          <button className="world-control" onClick={reset} aria-label="Reset room"><RotateCcw size={17}/></button>
        </div>
        <div className="restored-scene" data-lamp={lampOn} data-window={windowOpen} data-curtains={curtainsOpen} data-blanket={blanketPulled} data-pillow={pillowMoved}>
          <svg className="bedroom-environment" viewBox="0 0 1600 900" role="img" aria-label="A hand-drawn bedroom sandbox">
            
        <defs>
          <linearGradient id="daylight" x2="0" y2="1"><stop stopColor="#dcecf1"/><stop offset="1" stopColor="#f7faf7"/></linearGradient>
          <linearGradient id="wallwash" x2="0" y2="1"><stop stopColor="#fff"/><stop offset="1" stopColor="#faf9f6"/></linearGradient>
          <linearGradient id="floorwash" x2="0" y2="1"><stop stopColor="#e8d4b8"/><stop offset="1" stopColor="#d9bd98"/></linearGradient>
          <pattern id="wallpaper" width="42" height="42" patternUnits="userSpaceOnUse"><path d="M21 10 C15 15 15 22 21 27 C27 22 27 15 21 10Z" fill="none" stroke="#8d918b" strokeWidth="1" opacity=".08"/></pattern>
          <pattern id="linen" width="22" height="22" patternUnits="userSpaceOnUse"><path d="M0 6 Q6 2 11 6 T22 6 M0 16 Q6 12 11 16 T22 16" fill="none" stroke="#71877b" strokeWidth="1" opacity=".12"/></pattern>
          <pattern id="floorboards" width="240" height="82" patternUnits="userSpaceOnUse"><path d="M0 2 H240 M0 80 H240 M120 2 V80 M0 41 H120 M120 24 H240" fill="none" stroke="#8d8171" strokeWidth="1.2" opacity=".15"/><path d="M18 22 q24 -7 48 0 M148 62 q28 -8 54 0" fill="none" stroke="#8d8171" strokeWidth="1" opacity=".1"/></pattern>
          <filter id="roomshadow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="12"/></filter>
        </defs>
        

        {/* Wall and floor establish a clear room horizon */}
        <rect width="1600" height="900" fill="#fff"/>
        <path d="M0 0 H1600 V625 Q1200 618 800 625 T0 625Z" fill="url(#wallwash)" stroke="#171717" strokeWidth="3"/>
        <path d="M0 0 H1600 V625 H0Z" fill="url(#wallpaper)"/>
        <path d="M0 625 Q400 619 800 625 T1600 625 V900 H0Z" fill="url(#floorwash)" stroke="#171717" strokeWidth="3"/>
        <path d="M0 640 Q400 634 800 640 T1600 640" fill="none" stroke="#171717" strokeWidth="2"/>
        <path d="M0 625 H1600 V900 H0Z" fill="url(#floorboards)" opacity=".8"/>
        <g fill="none" stroke="#8c8174" strokeWidth="1.5" opacity=".2">
          <path d="M0 720 Q360 710 720 720 T1600 718 M0 810 Q360 800 720 810 T1600 808"/>
          <path d="M250 640 L290 900 M570 640 L610 900 M890 640 L930 900 M1210 640 L1250 900"/>
        </g>


        <rect x="0" y="0" width="1600" height="900" fill="none" stroke="#171717" strokeWidth="5"/>
        <path d="M0 42 H1600 M0 55 H1600" fill="none" stroke="#d9d5ce" strokeWidth="2"/>
        <path d="M0 625 Q400 619 800 625 T1600 625" fill="none" stroke="#171717" strokeWidth="4"/>
        <path d="M0 637 H1600" fill="none" stroke="#c7b9a7" strokeWidth="7"/>
        <path d="M0 647 H1600" fill="none" stroke="#fff" strokeWidth="3"/>
        <path d="M0 0 V900 M1600 0 V900" fill="none" stroke="#171717" strokeWidth="5"/>
        <g fill="none" stroke="#8c8174" strokeWidth="1.5" opacity=".18">
          <path d="M0 700 L1600 700 M0 790 L1600 790 M0 870 L1600 870"/>
          <path d="M120 648 L70 900 M390 648 L360 900 M680 648 L660 900 M950 648 L960 900 M1220 648 L1260 900 M1480 648 L1540 900"/>
        </g>
        <g transform="translate(80 0)">
        {/* Window, view and curtains */}
        <g className="window" stroke="#171717" strokeLinejoin="round">
          <rect x="128" y="142" width="342" height="330" rx="3" fill="#fff" strokeWidth="8"/>
          <rect x="148" y="162" width="302" height="290" fill="url(#daylight)" strokeWidth="3"/>
          <path d="M299 163 V451 M149 306 H449" fill="none" strokeWidth="7"/>
          <path d="M149 386 Q212 332 299 381 T449 373 V451 H149Z" fill="#c4dce0" strokeWidth="2"/>
          <path d="M153 385 Q215 349 286 384 M313 379 Q382 345 445 373" fill="none" stroke="#829b91" strokeWidth="2"/>
          <path d="M100 120 Q169 87 235 120 L224 500 Q166 466 107 505Z" fill="#b9cbb8" strokeWidth="5"/>
          <path d="M500 120 Q431 87 365 120 L376 500 Q434 466 493 505Z" fill="#b9cbb8" strokeWidth="5"/>
          <path d="M116 151 Q163 132 216 151 M111 180 Q165 161 220 180 M384 151 Q438 132 484 151 M380 180 Q435 161 489 180" fill="none" stroke="#8b988d" strokeWidth="2" opacity=".65"/>
          <path d="M95 116 Q300 90 505 116" fill="none" strokeWidth="7"/>
          <circle cx="128" cy="117" r="5" fill="#bca98f" stroke="none"/><circle cx="470" cy="117" r="5" fill="#bca98f" stroke="none"/>
        </g>

        {/* Small wall clock, alarm and phone bring the bedroom back to life */}
        <g className="wall-clock" stroke="#171717" strokeWidth="4" strokeLinejoin="round">
          <circle cx="790" cy="250" r="48" fill="#fff"/>
          <circle cx="790" cy="250" r="39" fill="#faf9f5" stroke="#c9c1b5" strokeWidth="2"/>
          <path d="M790 221 V250 L812 263" fill="none" strokeWidth="4" strokeLinecap="round"/>
          <circle cx="790" cy="250" r="4" fill="#171717" stroke="none"/>
          <path d="M790 216 V222 M824 250 H818 M790 284 V278 M756 250 H762" strokeWidth="2"/>
        </g>
        <g className="alarm-clock" stroke="#171717" strokeLinejoin="round">
          <path d="M218 495 Q218 475 238 475 H285 Q305 475 305 495 V529 H218Z" fill="#d7bfa2" strokeWidth="4"/>
          <circle cx="261" cy="500" r="19" fill="#fff" strokeWidth="3"/>
          <path d="M261 486 V500 L273 506" fill="none" strokeWidth="3" strokeLinecap="round"/>
          <path d="M226 476 L217 463 M297 476 L306 463" fill="none" strokeWidth="5" strokeLinecap="round"/>
          <path d="M232 529 L227 538 M291 529 L296 538" fill="none" strokeWidth="4"/>
        </g>
        <g className="phone-object" stroke="#171717" strokeLinejoin="round">
          <rect x="1142" y="570" width="32" height="57" rx="6" fill="#333" strokeWidth="3"/>
          <rect x="1147" y="576" width="22" height="42" rx="2" fill="#dcecf1" strokeWidth="1.5"/>
          <circle cx="1158" cy="622" r="2" fill="#fff" stroke="none"/>
        </g>
        <g className="mosquito-object" stroke="#171717" strokeWidth="2.5" strokeLinecap="round" fill="none">
          <ellipse cx="910" cy="390" rx="5" ry="3" fill="#222"/>
          <path d="M906 389 Q893 373 887 382 M914 389 Q927 373 933 382 M910 393 L904 405 M912 393 L918 405 M905 389 L897 385 M915 389 L923 385"/>
        </g>
        {/* Framed botanical print */}
        <g className="wall-art" stroke="#171717" strokeLinejoin="round">
          <rect x="930" y="145" width="240" height="170" rx="3" fill="#d7bfa2" strokeWidth="6"/>
          <rect x="945" y="160" width="210" height="140" fill="#fff" strokeWidth="2"/>
          <path d="M1050 280 V190 M1050 235 Q1005 195 985 214 Q993 248 1050 250 M1050 224 Q1092 177 1120 197 Q1115 232 1050 242 M1050 263 Q1092 235 1125 251" fill="none" stroke="#71877b" strokeWidth="4" strokeLinecap="round"/>
          <path d="M1050 190 q-12 -15 -4 -24 q14 8 4 24 M985 214 q-22 -5 -24 -22 q20 -4 24 22 M1120 197 q10 -20 26 -16 q-1 20 -26 16" fill="#9dbb9d" strokeWidth="2"/>
        </g>

        {/* Ceiling fan is fully inside the room composition */}
        <g className="ceiling-fan" transform="translate(720 82)" stroke="#171717" strokeLinejoin="round">
          {/* Ceiling mount, downrod and motor housing */}
          <path d="M0 -72 V-28" fill="none" strokeWidth="5"/>
          <path d="M-15 -75 Q0 -86 15 -75 L12 -63 Q0 -57 -12 -63Z" fill="#d8d2c8" strokeWidth="3"/>
          <path d="M-7 -28 V-5 H7 V-28" fill="#c8c2b8" strokeWidth="3"/>
          <path d="M-23 -7 Q-22 -26 0 -29 Q22 -26 23 -7 L18 9 Q0 18 -18 9Z" fill="#e5e0d7" strokeWidth="4"/>
          <path d="M-13 2 Q0 8 13 2" fill="none" stroke="#a79e91" strokeWidth="2"/>
          {/* Three broad, gently tapered blades */}
          <g className="fan-blades" fill="#b8c9b9" strokeWidth="4">
            <path d="M-9 -15 Q-45 -51 -63 -103 Q-69 -123 -55 -127 Q-36 -126 -20 -91 Q-6 -57 5 -17 Q-1 -10 -9 -15Z"/>
            <path d="M14 -8 Q54 -36 101 -35 Q124 -34 126 -19 Q123 -3 87 8 Q51 17 13 7 Q8 0 14 -8Z"/>
            <path d="M-7 13 Q-20 56 -51 89 Q-66 104 -78 94 Q-87 80 -66 49 Q-44 18 -13 0 Q-4 3 -7 13Z"/>
          </g>
          {/* Blade-root collars and central cap */}
          <g fill="#d9d3c9" strokeWidth="2.5">
            <path d="M-13 -15 Q-5 -22 4 -14 L10 -4 Q2 3 -7 0Z"/>
            <path d="M8 -15 Q18 -12 20 -3 L15 8 Q5 8 1 0Z"/>
            <path d="M-9 5 Q-4 -4 5 -5 L13 2 Q10 12 0 15Z"/>
          </g>
          <circle cx="0" cy="-1" r="13" fill="#f3f0e9" strokeWidth="4"/>
          <circle cx="0" cy="-1" r="4" fill="#a99f91" strokeWidth="2"/>
          <path d="M-2 13 V29 M-2 29 Q-7 34 -2 38 Q3 34 -2 29" fill="none" stroke="#77736d" strokeWidth="2"/>
        </g>

        {/* Wardrobe sits against the far right wall */}
        <g className="wardrobe" stroke="#171717" strokeLinejoin="round">
          <path d="M1210 348 Q1210 336 1223 336 H1365 V625 H1210Z" fill="#b99168" strokeWidth="6"/>
          <rect x="1227" y="355" width="62" height="252" fill="#e4c9a5" strokeWidth="3"/>
          <rect x="1298" y="355" width="50" height="252" fill="#d8b68e" strokeWidth="3"/>
          <path d="M1289 361 V600" strokeWidth="2" fill="none"/>
          <circle cx="1276" cy="486" r="5" fill="#9d896e" stroke="none"/><circle cx="1310" cy="486" r="5" fill="#9d896e" stroke="none"/>
          <path d="M1236 374 H1280 M1307 374 H1339" stroke="#b8ad9d" strokeWidth="2" fill="none"/>
          <path d="M1230 625 V644 M1345 625 V644" strokeWidth="7" fill="none"/>
        </g>

        {/* Left bedside table and lamp */}
        <g className="bedside-left" stroke="#171717" strokeLinejoin="round">
          <path d="M188 510 H376 V640 H188Z" fill="#c69b70" strokeWidth="5"/>
          <path d="M202 524 H362 V613 H202Z" fill="#ead6b9" strokeWidth="2"/>
          <rect x="218" y="540" width="128" height="60" rx="2" fill="#fff" strokeWidth="2"/>
          <path d="M228 550 H336 V590 H228Z" fill="url(#linen)" strokeWidth="1.5"/>
          <path d="M207 640 V674 M357 640 V674" fill="none" strokeWidth="8"/>
          <path d="M205 674 H218 M347 674 H360" fill="none" strokeWidth="4"/>
        </g>
        <g className="left-lamp" stroke="#171717" strokeWidth="4" strokeLinejoin="round">
          <path d="M282 510 V452" fill="none" strokeWidth="6"/>
          <path d="M246 453 Q282 389 318 453Z" fill="#e7c58c"/>
          <ellipse cx="282" cy="511" rx="30" ry="8" fill="#fff"/>
          <path d="M252 452 Q282 445 312 452" fill="none" stroke="#c6b18d" strokeWidth="2"/>
        </g>

        {/* Bed shadow and substantial, symmetrical bed structure */}
        <ellipse cx="745" cy="758" rx="390" ry="34" fill="#302c28" opacity=".13" filter="url(#roomshadow)"/>
        <g className="bed" stroke="#171717" strokeLinejoin="round">
          {/* Upholstered headboard: full width, clearly behind mattress */}
          <path d="M410 438 Q410 398 448 398 H1030 Q1068 398 1068 438 V548 H410Z" fill="#aebfae" strokeWidth="8"/>
          <path d="M430 440 Q430 419 451 419 H1027 Q1048 419 1048 440 V527 H430Z" fill="#dce5d9" strokeWidth="3"/>
          <path d="M445 440 Q470 425 496 441 M1029 440 Q1004 425 978 441" fill="none" stroke="#b9ad9d" strokeWidth="2"/>
          {/* Mattress and base */}
          <path d="M382 505 Q382 484 405 484 H1073 Q1096 484 1096 507 V740 H382Z" fill="#e6d4bd" strokeWidth="7"/>
          <path d="M405 516 Q405 502 423 502 H1055 Q1073 502 1073 518 V692 H405Z" fill="#fff" strokeWidth="3"/>
          <path d="M397 691 Q740 714 1081 691 V742 H397Z" fill="#c8a77f" strokeWidth="3"/>
          <path d="M430 741 V808 M1048 741 V808" fill="none" strokeWidth="18"/>
          <path d="M408 808 H453 M1027 808 H1072" fill="none" strokeWidth="8"/>
        </g>

        {/* Two pillows with softer, slightly irregular contours */}
        <g className="pillows" stroke="#171717" strokeWidth="4" strokeLinejoin="round">
          <path d="M468 514 Q462 491 488 486 Q541 478 614 490 Q638 493 634 519 L625 570 Q621 589 599 587 L492 578 Q469 576 468 552Z" fill="#fff"/>
          <path d="M650 514 Q644 491 670 486 Q723 478 796 490 Q820 493 816 519 L807 570 Q803 589 781 587 L674 578 Q651 576 650 552Z" fill="#fff"/>
          <path d="M486 504 Q547 492 615 506 M668 504 Q729 492 797 506" fill="none" stroke="#b7b0a6" strokeWidth="2"/>
          <path d="M484 568 Q548 583 618 574 M666 568 Q730 583 800 574" fill="none" stroke="#e0dbd3" strokeWidth="2"/>
        </g>

        {/* Folded duvet, mostly white with a restrained sage edge */}
        <g className="bed-cover" stroke="#171717" strokeLinejoin="round">
          <path d="M410 592 Q738 560 1067 592 L1080 704 Q742 735 397 704Z" fill="#a9c3a9" strokeWidth="4"/>
          <path d="M425 606 Q742 580 1052 606 L1063 688 Q740 716 414 688Z" fill="#fbfcfa" stroke="#a9b9aa" strokeWidth="2"/>
          <path d="M439 621 Q740 598 1040 622 M428 674 Q740 699 1050 675" fill="none" stroke="#c5d2c6" strokeWidth="2"/>
          <path d="M415 704 Q740 733 1078 704" fill="none" stroke="#a6b7a8" strokeWidth="3"/>
        </g>

        {/* Right bedside table and lamp */}
        <g className="bedside-right" stroke="#171717" strokeLinejoin="round">
          <path d="M1100 510 H1200 V640 H1100Z" fill="#c69b70" strokeWidth="5"/>
          <path d="M1112 524 H1188 V613 H1112Z" fill="#ead6b9" strokeWidth="2"/>
          <rect x="1120" y="540" width="60" height="60" fill="url(#linen)" strokeWidth="1.5"/>
          <path d="M1112 640 V674 M1188 640 V674" fill="none" strokeWidth="8"/>
        </g>
        <g className="right-lamp" stroke="#171717" strokeWidth="4" strokeLinejoin="round">
          <path d="M1150 510 V452" fill="none" strokeWidth="6"/>
          <path d="M1114 453 Q1150 389 1186 453Z" fill="#e7c58c"/>
          <ellipse cx="1150" cy="511" rx="30" ry="8" fill="#fff"/>
          <path d="M1120 452 Q1150 445 1180 452" fill="none" stroke="#c6b18d" strokeWidth="2"/>
        </g>

        {/* Plant, set clear of the furniture */}
        <g className="plant" stroke="#171717" strokeLinejoin="round">
          <path d="M82 614 H145 L137 681 H92Z" fill="#b98e68" strokeWidth="4"/>
          <path d="M113 615 Q77 556 61 574 Q65 601 113 615Z M115 613 Q126 548 151 551 Q157 583 115 613Z M112 615 Q99 572 115 543 Q137 559 112 615Z" fill="#7fa47e" strokeWidth="3"/>
          <path d="M113 614 V562 M112 600 L78 579 M116 591 L143 564" fill="none" strokeWidth="2"/>
        </g>

        {/* A smaller rug in front of the bed, not swallowing the room */}
        <g className="rug" stroke="#171717" strokeLinejoin="round">
          <path d="M300 758 Q720 728 1140 758 L1180 862 Q720 842 260 862Z" fill="#d0b28d" strokeWidth="3"/>
          <path d="M320 770 Q720 745 1120 770 L1150 844 Q720 827 290 844Z" fill="#eadcc8" stroke="#b8ad9e" strokeWidth="2"/>
          <path d="M340 781 Q720 760 1100 781 M310 833 Q720 815 1130 833" fill="none" stroke="#d2c8ba" strokeWidth="2"/>
        </g>

        {/* Small skirting board and hand-inked floor detail */}
        <path d="M0 625 Q360 619 720 625 T1440 625" fill="none" stroke="#171717" strokeWidth="4"/>
        <path d="M0 633 Q360 627 720 633 T1440 633" fill="none" stroke="#c6beb2" strokeWidth="2"/>
        </g>

        {/* Side furnishings remain inside the room architecture */}
        <g className="wide-angle-furnishings" stroke="#171717" strokeLinejoin="round">
          <path d="M18 565 Q18 552 32 552 H132 V650 H18Z" fill="#bd9168" strokeWidth="5"/>
          <path d="M29 566 H121 V624 H29Z" fill="#e8d2b5" strokeWidth="2"/>
          <path d="M37 580 H112 M37 592 H112" fill="none" stroke="#9b7655" strokeWidth="2"/>
          <path d="M30 650 V674 M120 650 V674" fill="none" strokeWidth="8"/>
        </g>

      
            <g className="stickman-anchor" transform="translate(250 175)">
              <Stickman mood={mood} awake={awake} reaction={pose} cursorNear={cursorNear} pose={pose}/>
            </g>
          </svg>
          {sceneHotspots.map(h=><button key={h.id} className={`restored-hotspot ${showHints?'hints-on':''}`} style={{left:`${h.x}%`,top:`${h.y}%`,width:`${h.w}%`,height:`${h.h}%`}} onClick={()=>interact(h.id)} aria-label={h.label}><span>{h.label}</span></button>)}
          {dialogue&&<div className="restored-dialogue">{dialogue}</div>}
          <div className="restored-caption">LIFE.EXE · {moodName}</div>
          <button className="restored-disturb" onClick={randomDisturb}><Sparkles size={14}/> DISTURB HIM</button>
          {showPlaces&&<div className="restored-places"><div className="restored-places-head"><b>CHOOSE ENVIRONMENT</b><button onClick={()=>setShowPlaces(false)} aria-label="Close"><X size={15}/></button></div>{scenes.map(item=><button key={item.id} disabled={!item.available} className={item.id===scene?'selected':''} onClick={()=>{setScene(item.id);setShowPlaces(false)}}><span>{item.icon}</span><b>{item.name}</b><small>{item.available?'AVAILABLE':'COMING SOON'}</small></button>)}</div>}
        </div>
        <div className="restored-status"><div><small>HIS CURRENT STATE</small><b>{moodName}</b></div><div><small>IRRITATION</small><b>{level}%</b><i><span style={{width:`${level}%`}}/></i></div><div><small>ENERGY</small><b>{Math.round(energy)}%</b><i><span style={{width:`${energy}%`}}/></i></div><div className="restored-note"> {mood<20?'He is enjoying the quiet. For now.':mood<60?'He is starting to suspect you.':'He is planning something.'}</div></div>
      </section>
    </main>
  )
}
