import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

type Props = { mood: number; awake: boolean; reaction: string; cursorNear: boolean; pose: string }

export default function Stickman({ mood, awake, reaction, cursorNear, pose }: Props) {
  const root = useRef<SVGGElement>(null)
  const angry = mood > 65

  useEffect(() => {
    if (!root.current) return
    const ctx = gsap.context(() => {
      gsap.to('.stick-torso', {
        scaleY: awake ? 1.008 : 1.025,
        duration: awake ? 1.15 : 2.4,
        yoyo: true,
        repeat: -1,
        transformOrigin: '50% 0%',
        ease: 'sine.inOut',
      })
      gsap.to('.stick-head', {
        y: awake ? 0 : 2,
        rotation: cursorNear ? 7 : awake ? 0 : -2,
        duration: .35,
        yoyo: !awake,
        repeat: awake ? 0 : -1,
        transformOrigin: '50% 100%',
        ease: 'sine.inOut',
      })
      if (pose === 'startled') gsap.fromTo(root.current, { y: -13, rotation: -3 }, { y: 0, rotation: 0, duration: .55, ease: 'bounce.out' })
      if (pose === 'angry') gsap.fromTo(root.current, { x: -4 }, { x: 4, duration: .075, repeat: 9, yoyo: true, ease: 'none' })
    }, root)
    return () => ctx.revert()
  }, [awake, pose, cursorNear])

  return (
    <g ref={root} className={`stickman ink-character ${awake ? 'awake' : 'asleep'}`} stroke="#111" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <ellipse cx="550" cy="553" rx="48" ry="7" fill="#111" opacity=".10" stroke="none" />
      <g className="stick-limbs">
        {/* long, loose arms with rounded hand loops */}
        <path d="M535 420 Q508 432 493 465 Q486 478 478 490" />
        <path d="M565 420 Q590 433 606 462 Q615 475 621 489" />
        <path d="M478 490 q-16 10 -17 -4 q1 -14 17 -22" strokeWidth="4.5" />
        <path d="M621 489 q16 10 17 -4 q-1 -14 -17 -22" strokeWidth="4.5" />
        {/* legs */}
        <path d="M541 469 Q535 510 532 548 L530 551" />
        <path d="M559 469 Q567 510 572 548 L574 551" />
        <path d="M530 551 q-19 4 -35 7 q-8 4 0 6 q24 1 39 -5" strokeWidth="4.5" />
        <path d="M574 551 q18 4 35 7 q8 4 0 6 q-24 1 -39 -5" strokeWidth="4.5" />
      </g>
      <g className="stick-torso">
        <path d="M535 413 Q550 405 565 413 Q570 433 563 469 Q550 482 537 469 Q530 434 535 413Z" fill="#fff" />
        <path d="M535 420 Q550 425 565 420" strokeWidth="3" opacity=".6" />
      </g>
      <g className="stick-head">
        <circle cx="550" cy="356" r="43" fill="#fff" strokeWidth="5.5" />
        {awake ? (
          <>
            <path d={cursorNear ? 'M535 352 q7 -7 12 0' : 'M535 351 q6 -5 11 0'} strokeWidth="3.5" />
            <path d={cursorNear ? 'M557 352 q7 -7 12 0' : 'M557 351 q6 -5 11 0'} strokeWidth="3.5" />
            {angry && <path d="M533 340 l13 3 M558 343 l13 -4" strokeWidth="3.5" />}
            <path d={angry ? 'M539 373 q11 -8 22 0' : 'M538 370 q12 13 24 0'} strokeWidth="3.5" />
          </>
        ) : (
          <>
            <path d="M535 355 q7 11 13 0 M556 355 q7 11 13 0" strokeWidth="3.5" />
            <path d="M540 374 q10 7 20 0" strokeWidth="3" />
          </>
        )}
        {reaction && <path d="M594 318 l8 -13 6 10 12 -3" strokeWidth="4" />}
      </g>
      {!awake && <g className="sleep-zzz" stroke="none" fill="#111" fontFamily="Georgia,serif" fontStyle="italic"><text x="602" y="300" fontSize="17">z</text><text x="616" y="282" fontSize="22">Z</text></g>}
    </g>
  )
}
