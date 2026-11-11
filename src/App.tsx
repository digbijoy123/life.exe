export default function App() {
  return (
    <main className="environment-stage" aria-label="Bedroom environment design preview">
      <svg className="bedroom-environment" viewBox="0 0 1440 900" role="img" aria-label="A carefully composed hand-drawn bedroom in white with restrained sage and warm neutral accents">
        <defs>
          <linearGradient id="daylight" x2="0" y2="1"><stop stopColor="#dcecf1"/><stop offset="1" stopColor="#f7faf7"/></linearGradient>
          <linearGradient id="wallwash" x2="0" y2="1"><stop stopColor="#fff"/><stop offset="1" stopColor="#faf9f6"/></linearGradient>
          <linearGradient id="floorwash" x2="0" y2="1"><stop stopColor="#f2eee7"/><stop offset="1" stopColor="#e9e3d9"/></linearGradient>
          <pattern id="wallpaper" width="42" height="42" patternUnits="userSpaceOnUse"><path d="M21 10 C15 15 15 22 21 27 C27 22 27 15 21 10Z" fill="none" stroke="#8d918b" strokeWidth="1" opacity=".08"/></pattern>
          <pattern id="linen" width="22" height="22" patternUnits="userSpaceOnUse"><path d="M0 6 Q6 2 11 6 T22 6 M0 16 Q6 12 11 16 T22 16" fill="none" stroke="#71877b" strokeWidth="1" opacity=".12"/></pattern>
          <pattern id="floorboards" width="240" height="82" patternUnits="userSpaceOnUse"><path d="M0 2 H240 M0 80 H240 M120 2 V80 M0 41 H120 M120 24 H240" fill="none" stroke="#8d8171" strokeWidth="1.2" opacity=".15"/><path d="M18 22 q24 -7 48 0 M148 62 q28 -8 54 0" fill="none" stroke="#8d8171" strokeWidth="1" opacity=".1"/></pattern>
          <filter id="roomshadow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="12"/></filter>
        </defs>

        <!-- Wall and floor establish a clear room horizon -->
        <rect width="1440" height="900" fill="#fff"/>
        <path d="M0 0 H1440 V625 Q1080 618 720 625 T0 625Z" fill="url(#wallwash)" stroke="#171717" strokeWidth="3"/>
        <path d="M0 0 H1440 V625 H0Z" fill="url(#wallpaper)"/>
        <path d="M0 625 Q360 619 720 625 T1440 625 V900 H0Z" fill="url(#floorwash)" stroke="#171717" strokeWidth="3"/>
        <path d="M0 640 Q360 634 720 640 T1440 640" fill="none" stroke="#171717" strokeWidth="2"/>
        <path d="M0 625 H1440 V900 H0Z" fill="url(#floorboards)" opacity=".8"/>
        <g fill="none" stroke="#8c8174" strokeWidth="1.5" opacity=".2">
          <path d="M0 720 Q360 710 720 720 T1440 718 M0 810 Q360 800 720 810 T1440 808"/>
          <path d="M250 640 L290 900 M570 640 L610 900 M890 640 L930 900 M1210 640 L1250 900"/>
        </g>

        <!-- Window, view and curtains -->
        <g className="window" stroke="#171717" strokeLinejoin="round">
          <rect x="128" y="142" width="342" height="330" rx="3" fill="#fff" strokeWidth="8"/>
          <rect x="148" y="162" width="302" height="290" fill="url(#daylight)" strokeWidth="3"/>
          <path d="M299 163 V451 M149 306 H449" fill="none" strokeWidth="7"/>
          <path d="M149 386 Q212 332 299 381 T449 373 V451 H149Z" fill="#dce9e7" strokeWidth="2"/>
          <path d="M153 385 Q215 349 286 384 M313 379 Q382 345 445 373" fill="none" stroke="#829b91" strokeWidth="2"/>
          <path d="M100 120 Q169 87 235 120 L224 500 Q166 466 107 505Z" fill="#e9eee8" strokeWidth="5"/>
          <path d="M500 120 Q431 87 365 120 L376 500 Q434 466 493 505Z" fill="#e9eee8" strokeWidth="5"/>
          <path d="M116 151 Q163 132 216 151 M111 180 Q165 161 220 180 M384 151 Q438 132 484 151 M380 180 Q435 161 489 180" fill="none" stroke="#8b988d" strokeWidth="2" opacity=".65"/>
          <path d="M95 116 Q300 90 505 116" fill="none" strokeWidth="7"/>
          <circle cx="128" cy="117" r="5" fill="#bca98f" stroke="none"/><circle cx="470" cy="117" r="5" fill="#bca98f" stroke="none"/>
        </g>

        <!-- Framed botanical print -->
        <g className="wall-art" stroke="#171717" strokeLinejoin="round">
          <rect x="930" y="145" width="240" height="170" rx="3" fill="#f2eee7" strokeWidth="6"/>
          <rect x="945" y="160" width="210" height="140" fill="#fff" strokeWidth="2"/>
          <path d="M1050 280 V190 M1050 235 Q1005 195 985 214 Q993 248 1050 250 M1050 224 Q1092 177 1120 197 Q1115 232 1050 242 M1050 263 Q1092 235 1125 251" fill="none" stroke="#71877b" strokeWidth="4" strokeLinecap="round"/>
          <path d="M1050 190 q-12 -15 -4 -24 q14 8 4 24 M985 214 q-22 -5 -24 -22 q20 -4 24 22 M1120 197 q10 -20 26 -16 q-1 20 -26 16" fill="#c8d6c9" strokeWidth="2"/>
        </g>

        <!-- Ceiling fan is fully inside the room composition -->
        <g className="ceiling-fan" transform="translate(720 34)" stroke="#171717" strokeWidth="4" strokeLinejoin="round">
          <path d="M0 0 V48" fill="none"/><circle cy="58" r="10" fill="#fff"/>
          <path d="M-5 54 Q-66 -9 -47 -20 Q-22 -15 5 52Z" fill="#f8f8f5"/>
          <path d="M5 55 Q83 16 89 42 Q88 64 7 67Z" fill="#f8f8f5"/>
          <path d="M-4 64 Q-22 139 -46 124 Q-56 105 -8 55Z" fill="#f8f8f5"/>
        </g>

        <!-- Wardrobe sits against the far right wall -->
        <g className="wardrobe" stroke="#171717" strokeLinejoin="round">
          <path d="M1210 348 Q1210 336 1223 336 H1365 V625 H1210Z" fill="#e7dfd3" strokeWidth="6"/>
          <rect x="1227" y="355" width="62" height="252" fill="#fbfaf7" strokeWidth="3"/>
          <rect x="1298" y="355" width="50" height="252" fill="#f4f0e9" strokeWidth="3"/>
          <path d="M1289 361 V600" strokeWidth="2" fill="none"/>
          <circle cx="1276" cy="486" r="5" fill="#9d896e" stroke="none"/><circle cx="1310" cy="486" r="5" fill="#9d896e" stroke="none"/>
          <path d="M1236 374 H1280 M1307 374 H1339" stroke="#b8ad9d" strokeWidth="2" fill="none"/>
          <path d="M1230 625 V644 M1345 625 V644" strokeWidth="7" fill="none"/>
        </g>

        <!-- Left bedside table and lamp -->
        <g className="bedside-left" stroke="#171717" strokeLinejoin="round">
          <path d="M188 510 H376 V640 H188Z" fill="#e9e2d8" strokeWidth="5"/>
          <path d="M202 524 H362 V613 H202Z" fill="#f7f4ee" strokeWidth="2"/>
          <rect x="218" y="540" width="128" height="60" rx="2" fill="#fff" strokeWidth="2"/>
          <path d="M228 550 H336 V590 H228Z" fill="url(#linen)" strokeWidth="1.5"/>
          <path d="M207 640 V674 M357 640 V674" fill="none" strokeWidth="8"/>
          <path d="M205 674 H218 M347 674 H360" fill="none" strokeWidth="4"/>
        </g>
        <g className="left-lamp" stroke="#171717" strokeWidth="4" strokeLinejoin="round">
          <path d="M282 510 V452" fill="none" strokeWidth="6"/>
          <path d="M246 453 Q282 389 318 453Z" fill="#f3e8d0"/>
          <ellipse cx="282" cy="511" rx="30" ry="8" fill="#fff"/>
          <path d="M252 452 Q282 445 312 452" fill="none" stroke="#c6b18d" strokeWidth="2"/>
        </g>

        <!-- Bed shadow and substantial, symmetrical bed structure -->
        <ellipse cx="745" cy="758" rx="390" ry="34" fill="#302c28" opacity=".13" filter="url(#roomshadow)"/>
        <g className="bed" stroke="#171717" strokeLinejoin="round">
          <!-- Upholstered headboard: full width, clearly behind mattress -->
          <path d="M410 438 Q410 398 448 398 H1030 Q1068 398 1068 438 V548 H410Z" fill="#e8e1d7" strokeWidth="8"/>
          <path d="M430 440 Q430 419 451 419 H1027 Q1048 419 1048 440 V527 H430Z" fill="#f7f5f0" strokeWidth="3"/>
          <path d="M445 440 Q470 425 496 441 M1029 440 Q1004 425 978 441" fill="none" stroke="#b9ad9d" strokeWidth="2"/>
          <!-- Mattress and base -->
          <path d="M382 505 Q382 484 405 484 H1073 Q1096 484 1096 507 V740 H382Z" fill="#f0ece5" strokeWidth="7"/>
          <path d="M405 516 Q405 502 423 502 H1055 Q1073 502 1073 518 V692 H405Z" fill="#fff" strokeWidth="3"/>
          <path d="M397 691 Q740 714 1081 691 V742 H397Z" fill="#e3dbcf" strokeWidth="3"/>
          <path d="M430 741 V808 M1048 741 V808" fill="none" strokeWidth="18"/>
          <path d="M408 808 H453 M1027 808 H1072" fill="none" strokeWidth="8"/>
        </g>

        <!-- Two pillows with softer, slightly irregular contours -->
        <g className="pillows" stroke="#171717" strokeWidth="4" strokeLinejoin="round">
          <path d="M468 514 Q462 491 488 486 Q541 478 614 490 Q638 493 634 519 L625 570 Q621 589 599 587 L492 578 Q469 576 468 552Z" fill="#fff"/>
          <path d="M650 514 Q644 491 670 486 Q723 478 796 490 Q820 493 816 519 L807 570 Q803 589 781 587 L674 578 Q651 576 650 552Z" fill="#fff"/>
          <path d="M486 504 Q547 492 615 506 M668 504 Q729 492 797 506" fill="none" stroke="#b7b0a6" strokeWidth="2"/>
          <path d="M484 568 Q548 583 618 574 M666 568 Q730 583 800 574" fill="none" stroke="#e0dbd3" strokeWidth="2"/>
        </g>

        <!-- Folded duvet, mostly white with a restrained sage edge -->
        <g className="bed-cover" stroke="#171717" strokeLinejoin="round">
          <path d="M410 592 Q738 560 1067 592 L1080 704 Q742 735 397 704Z" fill="#e6eee7" strokeWidth="4"/>
          <path d="M425 606 Q742 580 1052 606 L1063 688 Q740 716 414 688Z" fill="#fbfcfa" stroke="#a9b9aa" strokeWidth="2"/>
          <path d="M439 621 Q740 598 1040 622 M428 674 Q740 699 1050 675" fill="none" stroke="#c5d2c6" strokeWidth="2"/>
          <path d="M415 704 Q740 733 1078 704" fill="none" stroke="#a6b7a8" strokeWidth="3"/>
        </g>

        <!-- Right bedside table and lamp -->
        <g className="bedside-right" stroke="#171717" strokeLinejoin="round">
          <path d="M1100 510 H1200 V640 H1100Z" fill="#e9e2d8" strokeWidth="5"/>
          <path d="M1112 524 H1188 V613 H1112Z" fill="#f7f4ee" strokeWidth="2"/>
          <rect x="1120" y="540" width="60" height="60" fill="url(#linen)" strokeWidth="1.5"/>
          <path d="M1112 640 V674 M1188 640 V674" fill="none" strokeWidth="8"/>
        </g>
        <g className="right-lamp" stroke="#171717" strokeWidth="4" strokeLinejoin="round">
          <path d="M1150 510 V452" fill="none" strokeWidth="6"/>
          <path d="M1114 453 Q1150 389 1186 453Z" fill="#f3e8d0"/>
          <ellipse cx="1150" cy="511" rx="30" ry="8" fill="#fff"/>
          <path d="M1120 452 Q1150 445 1180 452" fill="none" stroke="#c6b18d" strokeWidth="2"/>
        </g>

        <!-- Plant, set clear of the furniture -->
        <g className="plant" stroke="#171717" strokeLinejoin="round">
          <path d="M82 614 H145 L137 681 H92Z" fill="#d8cfc1" strokeWidth="4"/>
          <path d="M113 615 Q77 556 61 574 Q65 601 113 615Z M115 613 Q126 548 151 551 Q157 583 115 613Z M112 615 Q99 572 115 543 Q137 559 112 615Z" fill="#c5d5c5" strokeWidth="3"/>
          <path d="M113 614 V562 M112 600 L78 579 M116 591 L143 564" fill="none" strokeWidth="2"/>
        </g>

        <!-- A smaller rug in front of the bed, not swallowing the room -->
        <g className="rug" stroke="#171717" strokeLinejoin="round">
          <path d="M300 758 Q720 728 1140 758 L1180 862 Q720 842 260 862Z" fill="#e9e2d7" strokeWidth="3"/>
          <path d="M320 770 Q720 745 1120 770 L1150 844 Q720 827 290 844Z" fill="#f8f6f1" stroke="#b8ad9e" strokeWidth="2"/>
          <path d="M340 781 Q720 760 1100 781 M310 833 Q720 815 1130 833" fill="none" stroke="#d2c8ba" strokeWidth="2"/>
        </g>

        <!-- Small skirting board and hand-inked floor detail -->
        <path d="M0 625 Q360 619 720 625 T1440 625" fill="none" stroke="#171717" strokeWidth="4"/>
        <path d="M0 633 Q360 627 720 633 T1440 633" fill="none" stroke="#c6beb2" strokeWidth="2"/>
      </svg></svg>
      <div className="environment-caption">BEDROOM · ENVIRONMENT DESIGN</div>
    </main>
  )
}
