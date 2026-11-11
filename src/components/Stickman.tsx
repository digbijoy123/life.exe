import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

type Props = { mood: number; awake: boolean; reaction: string; cursorNear: boolean; pose: string }
export default function Stickman({ mood, awake, reaction, cursorNear, pose }: Props) {
  const root = useRef<SVGGElement>(null)
  useEffect(() => {
    if (!root.current) return
    const ctx = gsap.context(() => {
      gsap.to('.stick-breathe', { scaleY: awake ? 1.012 : 1.035, duration: awake ? 1.1 : 2.2, yoyo: true, repeat: -1, transformOrigin: '50% 100%', ease: 'sine.inOut' })
      gsap.to('.stick-head', { y: awake ? 0 : 2, rotation: awake ? 0 : -2, duration: 2.1, yoyo: true, repeat: -1, transformOrigin: '50% 100%', ease: 'sine.inOut' })
      if (pose === 'startled') gsap.fromTo(root.current, { y: -15, rotation: -4 }, { y: 0, rotation: 0, duration: .55, ease: 'bounce.out' })
      if (pose === 'angry') gsap.fromTo(root.current, { x: -5 }, { x: 5, duration: .08, repeat: 7, yoyo: true, ease: 'none' })
      if (pose === 'look') gsap.to('.stick-head', { rotation: cursorNear ? 12 : 0, duration: .3 })
    }, root)
    return () => ctx.revert()
  }, [awake, pose, cursorNear])
  const angry = mood > 65
  return (
    <g ref={root} className={`stickman ${awake ? 'awake' : 'asleep'}`}>
      <ellipse cx="550" cy="552" rx="54" ry="9" fill="#24202a" opacity=".13" />
      <g className="stick-breathe" stroke="#272530" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M550 394 Q545 425 550 458" />
        <path d="M548 414 Q524 425 513 451" />
        <path d="M550 414 Q572 427 584 449" />
        <path d="M550 456 Q527 477 520 505" />
        <path d="M550 456 Q571 479 584 505" />
      </g>
      <g className="stick-head">
        <circle cx="550" cy="367" r="27" fill="#f5f0e8" stroke="#272530" strokeWidth="7" />
        {awake ? <>
          <ellipse cx="541" cy="367" rx="3" ry="4" fill="#272530" />
          <ellipse cx="559" cy="367" rx="3" ry="4" fill="#272530" />
          <path d={angry ? 'M541 382 Q550 376 559 382' : 'M542 379 Q550 386 558 379'} stroke="#272530" strokeWidth="2.8" fill="none" strokeLinecap="round" />
          {angry && <path d="M536 357 L545 360 M555 360 L564 357" stroke="#272530" strokeWidth="2.8" strokeLinecap="round" />}
        </> : <path d="M540 369 Q545 373 550 369 M554 369 Q559 373 564 369" stroke="#272530" strokeWidth="2.8" fill="none" strokeLinecap="round" />}
      </g>
      {reaction && <g className="reaction-mark"><path d="M590 330 l8 -12 5 11 12 -2" stroke="#e78b54" strokeWidth="4" fill="none" strokeLinecap="round" /></g>}
    </g>
  )
}