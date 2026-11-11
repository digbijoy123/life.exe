export default function App() {
  return (
    <main className="environment-stage" aria-label="Bedroom environment design preview">
      <svg className="bedroom-environment" viewBox="0 0 1440 900" role="img" aria-label="A neatly arranged monochrome hand-drawn bedroom interior">
        <defs>
          <pattern id="wall-paper" width="34" height="34" patternUnits="userSpaceOnUse">
            <path d="M17 8 C11 13 11 20 17 24 C23 20 23 13 17 8Z" fill="none" stroke="#111" strokeWidth="1" opacity=".08"/>
          </pattern>
          <pattern id="fabric" width="18" height="18" patternUnits="userSpaceOnUse">
            <path d="M0 5 Q5 1 9 5 T18 5 M0 14 Q5 10 9 14 T18 14" fill="none" stroke="#111" strokeWidth="1" opacity=".12"/>
          </pattern>
          <pattern id="wood" width="160" height="90" patternUnits="userSpaceOnUse">
            <path d="M0 4 H160 M0 88 H160 M72 4 V88 M0 47 H72 M72 26 H160" fill="none" stroke="#111" strokeWidth="1.4" opacity=".13"/>
            <path d="M15 22 q22 -7 40 0 M93 66 q24 -8 45 0" fill="none" stroke="#111" strokeWidth="1" opacity=".08"/>
          </pattern>
          <filter id="soft-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="9"/>
          </filter>
        </defs>

        <rect width="1440" height="900" fill="#fff"/>
        <path d="M0 0 H1440 V650 Q1120 642 720 650 T0 650Z" fill="#fff" stroke="#111" strokeWidth="3"/>
        <path d="M0 0 H1440 V650 H0Z" fill="url(#wall-paper)"/>
        <path d="M0 650 Q360 642 720 650 T1440 650 V900 H0Z" fill="#fafafa" stroke="#111" strokeWidth="3"/>
        <path d="M0 665 Q360 656 720 665 T1440 663" fill="none" stroke="#111" strokeWidth="2"/>
        <path d="M0 674 Q360 666 720 674 T1440 672" fill="none" stroke="#111" strokeWidth="1" opacity=".35"/>
        <path d="M0 650 H1440 V900 H0Z" fill="url(#wood)" opacity=".75"/>

        <g fill="none" stroke="#111" strokeWidth="2" opacity=".13">
          <path d="M0 760 Q350 748 700 760 T1440 758"/>
          <path d="M0 850 Q350 838 700 850 T1440 848"/>
          <path d="M240 665 L270 900 M560 665 L590 900 M900 665 L930 900 M1220 665 L1250 900"/>
        </g>

        <g className="room-window" stroke="#111" strokeLinejoin="round">
          <path d="M112 125 Q112 111 128 111 H470 Q486 111 486 127 V430 H112Z" fill="#fff" strokeWidth="7"/>
          <path d="M132 132 H466 V408 H132Z" fill="#eaf3f5" strokeWidth="3"/>
          <path d="M299 133 Q296 270 299 407 M133 270 Q300 265 465 270" fill="none" strokeWidth="7"/>
          <path d="M133 355 Q205 305 298 353 T465 346 V407 H133Z" fill="#dce9e9" strokeWidth="2"/>
          <path d="M139 355 Q213 320 286 356 M315 352 Q385 319 460 348" fill="none" strokeWidth="2"/>
          <path d="M91 96 Q157 62 224 96 L214 482 Q151 448 98 488Z" fill="#e8eee8" strokeWidth="5"/>
          <path d="M508 96 Q442 62 375 96 L385 482 Q448 448 501 488Z" fill="#e8eee8" strokeWidth="5"/>
          <path d="M108 121 Q150 103 194 121 M102 151 Q151 132 207 151 M393 120 Q444 101 491 122 M389 151 Q444 132 497 151" fill="none" strokeWidth="2" opacity=".55"/>
        </g>

        <g className="wall-art" stroke="#111" strokeLinejoin="round">
          <path d="M1000 135 Q1000 122 1014 122 H1295 Q1309 122 1309 136 V332 H1000Z" fill="#f2eee7" strokeWidth="6"/>
          <path d="M1020 143 H1289 V311 H1020Z" fill="none" strokeWidth="2"/>
          <path d="M1047 285 Q1100 210 1161 267 T1270 211" fill="none" strokeWidth="4"/>
          <path d="M1065 265 l30 -56 29 56 M1178 272 l31 -70 34 70" fill="#fff" strokeWidth="3"/>
          <path d="M1035 320 H1274" fill="none" strokeWidth="2"/>
        </g>

        <g className="ceiling-fan" stroke="#111" strokeWidth="4" strokeLinejoin="round" fill="#fff">
          <path d="M720 0 V86" fill="none"/>
          <circle cx="720" cy="96" r="12"/>
          <path d="M715 91 Q650 10 675 6 Q704 8 727 89Z"/>
          <path d="M725 93 Q818 35 825 65 Q829 93 730 105Z"/>
          <path d="M716 102 Q690 196 661 174 Q650 151 711 94Z"/>
        </g>

        <g className="wardrobe" stroke="#111" strokeLinejoin="round">
          <path d="M1185 390 Q1185 378 1198 378 H1354 V650 H1185Z" fill="#e9e4dc" strokeWidth="6"/>
          <path d="M1203 399 H1271 V630 H1203Z M1280 399 H1337 V630 H1280Z" fill="#f7f4ef" strokeWidth="3"/>
          <path d="M1263 405 V622 M1272 405 V622" fill="none" strokeWidth="1.5"/>
          <circle cx="1253" cy="520" r="5" fill="#111"/>
          <circle cx="1295" cy="520" r="5" fill="#111"/>
          <path d="M1208 415 H1260 M1285 415 H1331" strokeWidth="1.5" opacity=".5"/>
        </g>

        <g className="bedside-left" stroke="#111" strokeLinejoin="round">
          <path d="M170 530 H370 V660 H170Z" fill="#eee8df" strokeWidth="5"/>
          <path d="M183 545 H357 V631 H183Z" fill="url(#fabric)" strokeWidth="2"/>
          <path d="M190 660 V700 M350 660 V700" fill="none" strokeWidth="8"/>
          <path d="M212 550 H335 V620 H212Z" fill="#fff" strokeWidth="2"/>
          <path d="M220 559 H327 V611 H220Z" fill="url(#fabric)" strokeWidth="1.5"/>
        </g>
        <g className="table-lamp" stroke="#111" strokeWidth="4" strokeLinejoin="round">
          <path d="M270 530 V463" fill="none" strokeWidth="6"/>
          <path d="M235 464 Q270 397 305 464Z" fill="#f3e7c9"/>
          <ellipse cx="270" cy="531" rx="31" ry="8" fill="#fff"/>
        </g>

        <g className="bed-shadow" filter="url(#soft-shadow)" opacity=".16">
          <ellipse cx="755" cy="735" rx="390" ry="42" fill="#111"/>
        </g>
        <g className="bed" stroke="#111" strokeLinejoin="round">
          <path d="M390 440 Q390 409 425 409 H1050 Q1084 409 1084 443 V750 H390Z" fill="#f0ece5" strokeWidth="8"/>
          <path d="M414 447 Q414 430 438 430 H1036 Q1060 430 1060 451 V699 H414Z" fill="#fff" strokeWidth="3"/>
          <path d="M412 460 Q400 365 474 350 Q543 340 570 414 L570 446" fill="#e7e2d9" strokeWidth="7"/>
          <path d="M424 462 Q435 385 482 374 Q526 369 550 427" fill="none" strokeWidth="2"/>
          <path d="M572 452 Q790 426 1058 455" fill="none" strokeWidth="2"/>
          <path d="M414 665 Q735 691 1060 663 V727 H414Z" fill="url(#fabric)" strokeWidth="3"/>
          <path d="M435 750 V812 M1038 750 V812" fill="none" strokeWidth="18"/>
          <path d="M411 812 H462 M1012 812 H1063" fill="none" strokeWidth="8"/>
        </g>

        <g className="pillows" stroke="#111" strokeWidth="4" strokeLinejoin="round">
          <path d="M470 446 Q466 423 493 419 H622 Q650 422 646 452 L639 511 Q635 531 608 527 L493 515 Q467 512 470 446Z" fill="#fff"/>
          <path d="M655 447 Q650 423 678 419 H808 Q836 422 832 452 L825 511 Q821 531 794 527 L678 515 Q652 512 655 447Z" fill="#fff"/>
          <path d="M490 443 Q552 431 622 447 M676 443 Q740 431 810 447" fill="none" strokeWidth="1.8"/>
        </g>

        <g className="bed-cover" stroke="#111" strokeLinejoin="round">
          <path d="M430 545 Q720 512 1050 550 L1060 704 Q745 741 414 704Z" fill="#dfe9e3" strokeWidth="4"/>
          <path d="M438 560 Q730 531 1044 564 L1048 690 Q739 721 428 690Z" fill="url(#fabric)" strokeWidth="1.5"/>
          <path d="M450 579 Q720 552 1036 582 M445 667 Q740 698 1044 665" fill="none" strokeWidth="2" opacity=".55"/>
        </g>

        <g className="bedside-right" stroke="#111" strokeLinejoin="round">
          <path d="M1090 555 H1190 V665 H1090Z" fill="#eee8df" strokeWidth="5"/>
          <path d="M1103 570 H1177 V638 H1103Z" fill="url(#fabric)" strokeWidth="2"/>
          <path d="M1105 665 V700 M1175 665 V700" fill="none" strokeWidth="8"/>
          <path d="M1125 558 V505" fill="none" strokeWidth="5"/>
          <path d="M1098 505 Q1125 452 1152 505Z" fill="#f3e7c9" strokeWidth="4"/>
        </g>

        <g className="plant" stroke="#111" strokeLinejoin="round">
          <path d="M95 652 H160 L151 715 H105Z" fill="#d9d0c3" strokeWidth="4"/>
          <path d="M127 652 Q100 590 80 600 Q78 626 127 652Z M128 650 Q135 578 163 581 Q171 613 128 650Z M125 652 Q110 613 124 580 Q144 597 125 652Z" fill="#b9cbb8" strokeWidth="3"/>
          <path d="M127 650 V598 M126 633 L96 609 M129 625 L151 595" fill="none" strokeWidth="2"/>
        </g>

        <g className="rug" stroke="#111" strokeWidth="2.5">
          <path d="M260 735 Q715 700 1190 740 L1240 870 Q720 842 220 875Z" fill="#f1ede5"/>
          <path d="M280 752 Q715 722 1170 754 L1208 849 Q720 824 252 852Z" fill="url(#fabric)" strokeWidth="1.5"/>
          <path d="M300 766 Q710 740 1150 769 M273 835 Q720 810 1189 839" fill="none" opacity=".5"/>
        </g>

        <g fill="none" stroke="#111" strokeWidth="2" opacity=".28">
          <path d="M0 890 Q350 860 700 890 T1400 888"/>
          <path d="M15 896 Q360 872 705 896 T1415 894"/>
        </g>
      </svg>
      <div className="environment-caption">BEDROOM · ENVIRONMENT DESIGN</div>
    </main>
  )
}
