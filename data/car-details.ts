export interface CarDetailImage {
  src: string;
  alt: string;
}

export type FeatureIconKey = "engine" | "comfort" | "tech";

export interface CarFeatureGroup {
  category: string;
  icon: FeatureIconKey;
  items: string[];
}

export interface CarDetail {
  images: CarDetailImage[];
  editorial: {
    headline: string;
    dek: string;
    paragraphs: string[];
  };
  features: CarFeatureGroup[];
}

const SUPPLEMENT_POOL = [
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1541447271487-09612b3f49f7?auto=format&fit=crop&w=1600&q=80",
];

function galleryFor(primary: string, offset: number): CarDetailImage[] {
  return [
    { src: primary, alt: "Front three-quarter view" },
    {
      src: SUPPLEMENT_POOL[offset % 4],
      alt: "Side profile in motion",
    },
    {
      src: SUPPLEMENT_POOL[(offset + 1) % 4],
      alt: "Cabin and interior detail",
    },
    {
      src: SUPPLEMENT_POOL[(offset + 2) % 4],
      alt: "Rear three-quarter view",
    },
  ];
}

export const carDetails: Record<string, CarDetail> = {
  "range-rover-sport-2023": {
    images: galleryFor(
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=80",
      0,
    ),
    editorial: {
      headline: "Command Every Terrain, Without Raising Your Pulse",
      dek: "The Range Rover Sport Autobiography pairs off-road serenity with true on-road urgency — a rare and deliberate balance.",
      paragraphs: [
        "There's a particular kind of quiet that only comes from engineering excess wrapped in restraint. Behind the wheel of the Range Rover Sport Autobiography, that quiet arrives instantly — cabin noise smothered by acoustic glass, road imperfections dissolved by adaptive air suspension that reads the surface a fraction of a second before your wheels do.",
        "Underneath the composure sits real capability. Terrain Response 2 shuffles power and damping automatically across mud, sand, and rock, while the twin-turbocharged inline-six delivers effortless overtaking torque without ever sounding strained. This is a vehicle built to be driven hard in a school pickup line and harder still down a fire road.",
        "Inside, Santorini Black paint gives way to a cabin trimmed in quilted leather and open-pore wood — details that reward a second look rather than announcing themselves. It is luxury measured in restraint, not volume.",
      ],
    },
    features: [
      {
        category: "Performance & Engine",
        icon: "engine",
        items: [
          "3.0L twin-turbo inline-six, 395 hp",
          "8-speed automatic transmission",
          "Terrain Response 2 all-terrain system",
          "Adaptive air suspension with dynamic response",
        ],
      },
      {
        category: "Luxury & Comfort",
        icon: "comfort",
        items: [
          "Quilted leather heated & ventilated seats",
          "Panoramic sliding glass roof",
          "Four-zone climate control",
          "Configurable ambient lighting, 30 colors",
        ],
      },
      {
        category: "Technology & Safety",
        icon: "tech",
        items: [
          "13.1-inch Pivi Pro touchscreen",
          "360-degree camera with ClearSight ground view",
          "Adaptive cruise control with lane keep assist",
          "Wade sensing for water crossings up to 900mm",
        ],
      },
    ],
  },
  "bmw-m5-2023": {
    images: galleryFor(
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1600&q=80",
      1,
    ),
    editorial: {
      headline: "The Business Sedan That Lies About Its Day Job",
      dek: "Four doors, a back seat, and 617 horsepower conspiring to make every commute feel like a dare.",
      paragraphs: [
        "The M5 Competition has always played a trick on onlookers — a sedan silhouette hiding a chassis tuned by people who clearly wanted to build a supercar and settled for practicality as a compromise. Brooklyn Grey paint only sharpens the disguise.",
        "Twin-turbo V8 power routes through an eight-speed automatic and an all-wheel-drive system that can, at the press of a button, send everything to the rear wheels alone. It's an unusually honest performance envelope: composed at nine-tenths, genuinely wild at ten.",
        "Inside, the carbon-backed M seats hold you the way a proper sports car should, and the cabin's restraint — real metal, real stitching, no unnecessary flourish — makes it clear this is a driver's tool first, a luxury statement second.",
      ],
    },
    features: [
      {
        category: "Performance & Engine",
        icon: "engine",
        items: [
          "4.4L twin-turbo V8, 617 hp",
          "8-speed M Steptronic automatic",
          "M xDrive all-wheel drive with 2WD mode",
          "Adaptive M suspension",
        ],
      },
      {
        category: "Luxury & Comfort",
        icon: "comfort",
        items: [
          "Carbon-backed M sport seats, heated & ventilated",
          "Merino leather upholstery",
          "Bowers & Wilkins Diamond surround sound",
          "Configurable drive-mode memory presets",
        ],
      },
      {
        category: "Technology & Safety",
        icon: "tech",
        items: [
          "12.3-inch BMW Curved Display",
          "Head-up display",
          "M Drift Analyzer & Laptimer",
          "Active blind spot & lane departure warning",
        ],
      },
    ],
  },
  "porsche-panamera-2024": {
    images: galleryFor(
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
      2,
    ),
    editorial: {
      headline: "Precision Engineering, Dressed for Any Occasion",
      dek: "The Panamera 4S proves that a grand tourer and a sports car were never meant to be different vehicles.",
      paragraphs: [
        "Porsche built the Panamera to answer a question nobody quite believed had a good answer: could a four-door with real rear-seat space still feel like a 911 when the road turned interesting? The 4S answers with a twin-turbo V6 and air suspension calibrated with genuine sporting intent.",
        "Carrara White exterior paint keeps the design's tension visible — the long hood, the fastback roofline, the wide rear haunches — while Porsche Active Suspension Management quietly firms and softens the ride to match your mood rather than the road's.",
        "Step inside and the cabin reads like a cockpit: analog tachometer at center, surrounded by digital displays that never feel like a concession. Every surface is finished with the kind of consistency you only get from a manufacturer that has been building interiors this way for decades.",
      ],
    },
    features: [
      {
        category: "Performance & Engine",
        icon: "engine",
        items: [
          "2.9L twin-turbo V6, 440 hp",
          "8-speed PDK dual-clutch transmission",
          "Porsche Active Suspension Management",
          "All-wheel drive with rear-axle steering",
        ],
      },
      {
        category: "Luxury & Comfort",
        icon: "comfort",
        items: [
          "14-way power adaptive sport seats",
          "Four-zone climate control",
          "Bose Surround Sound System",
          "Panoramic fixed glass roof",
        ],
      },
      {
        category: "Technology & Safety",
        icon: "tech",
        items: [
          "12.3-inch Porsche Communication Management",
          "Porsche InnoDrive adaptive cruise",
          "Night Vision Assist",
          "Wireless Apple CarPlay integration",
        ],
      },
    ],
  },
  "tesla-roadster-2024": {
    images: galleryFor(
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1600&q=80",
      3,
    ),
    editorial: {
      headline: "The Future of Speed, Already Here",
      dek: "Zero emissions, zero compromise — the Roadster Founders Series redefines what a hypercar can be.",
      paragraphs: [
        "Numbers rarely tell the whole story, but the Roadster's do a lot of the talking: a sub-two-second sprint to 60 mph, a top speed north of 250 mph, and a 620-mile range that makes the idea of an electric hypercar feel less like a novelty and more like an inevitability.",
        "Red Multi-Coat paint over a carbon-fiber body keeps weight low and presence high. There's no engine note to announce the car's intentions — just a silent, immediate surge that reorders your sense of what acceleration feels like.",
        "The Founders Series cabin is deliberately minimal: four seats, a glass roof, and a removable panel for genuine open-air driving. It's a hypercar that asks you to stop thinking about what a hypercar is supposed to sound like, and start thinking about what one should feel like.",
      ],
    },
    features: [
      {
        category: "Performance & Engine",
        icon: "engine",
        items: [
          "Tri-motor all-wheel-drive electric powertrain",
          "0-60 mph in under 2 seconds",
          "620-mile est. range",
          "SpaceX-inspired removable glass roof panel",
        ],
      },
      {
        category: "Luxury & Comfort",
        icon: "comfort",
        items: [
          "4-passenger carbon-fiber cabin",
          "Heated & ventilated sport seats",
          "Premium audio with active noise cancellation",
          "Panoramic glass roof",
        ],
      },
      {
        category: "Technology & Safety",
        icon: "tech",
        items: [
          "17-inch center touchscreen",
          "Over-the-air software updates",
          "Autopilot advanced driver assistance",
          "Track Mode telemetry display",
        ],
      },
    ],
  },
  "honda-crv-2022": {
    images: galleryFor(
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1600&q=80",
      0,
    ),
    editorial: {
      headline: "The Quiet Confidence of Doing Everything Right",
      dek: "No drama, no compromise — the CR-V Touring Hybrid is engineered for the life you actually live.",
      paragraphs: [
        "Not every vehicle needs to announce itself. The CR-V Touring Hybrid earns its keep through consistency: a hybrid powertrain that returns exceptional efficiency without asking you to think about it, and a cabin built around genuine, unglamorous usefulness.",
        "Platinum White Pearl paint suits a design that values proportion over flash. Inside, Honda's two-motor hybrid system pairs a 2.0L engine with electric motors for smooth, quiet power delivery that rarely calls attention to the transition between gas and electric assist.",
        "This is a vehicle built by people who understand that most driving happens in ordinary moments — school runs, grocery trips, long highway stretches — and who decided those moments deserved real engineering effort too.",
      ],
    },
    features: [
      {
        category: "Performance & Engine",
        icon: "engine",
        items: [
          "2.0L 4-cylinder hybrid powertrain, 204 hp combined",
          "e-CVT automatic transmission",
          "Real-time all-wheel drive",
          "Up to 40 MPG combined",
        ],
      },
      {
        category: "Luxury & Comfort",
        icon: "comfort",
        items: [
          "Heated leather front & rear seats",
          "Power tailgate with hands-free access",
          "Dual-zone automatic climate control",
          "Panoramic moonroof",
        ],
      },
      {
        category: "Technology & Safety",
        icon: "tech",
        items: [
          "9-inch touchscreen with wireless Apple CarPlay",
          "Honda Sensing safety suite",
          "Wireless phone charger",
          "Head-up display",
        ],
      },
    ],
  },
  "nissan-gtr-2023": {
    images: galleryFor(
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1600&q=80",
      1,
    ),
    editorial: {
      headline: "Godzilla, Still Undefeated",
      dek: "Two decades of relentless refinement have only sharpened the GT-R's singular purpose: speed without apology.",
      paragraphs: [
        "The GT-R has never chased trends. Its hand-built twin-turbo V6 and ATTESA E-TS all-wheel-drive system exist for one reason — to put every one of its 565 horsepower onto the road with a violence that feels almost mechanical in its precision.",
        "Pearl White paint over the familiar wide-body silhouette announces the car's intent honestly: this is a machine built around a Nürburgring lap time, not a boardroom mood board. The dual-clutch transmission snaps through gears with a physicality that automatic gearboxes rarely offer.",
        "The cabin has grown more refined over the years — nicer materials, a cleaner dashboard — but the driving position and the sound of that engine remain unmistakably, defiantly GT-R. Some cars evolve by softening. This one evolves by getting better at doing exactly what it always did.",
      ],
    },
    features: [
      {
        category: "Performance & Engine",
        icon: "engine",
        items: [
          "3.8L twin-turbo V6, 565 hp",
          "6-speed dual-clutch transmission",
          "ATTESA E-TS all-wheel drive",
          "Launch control with 2.9s 0-60 mph",
        ],
      },
      {
        category: "Luxury & Comfort",
        icon: "comfort",
        items: [
          "Semi-aniline leather sport seats",
          "Heated front seats",
          "Bose premium audio system",
          "Dual-zone automatic climate control",
        ],
      },
      {
        category: "Technology & Safety",
        icon: "tech",
        items: [
          "8-inch multifunction touchscreen",
          "Nissan Navigation with GT-R performance data logger",
          "Rearview camera with parking sensors",
          "Bluetooth hands-free with streaming audio",
        ],
      },
    ],
  },
  "ford-expedition-2023": {
    images: galleryFor(
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1600&q=80",
      2,
    ),
    editorial: {
      headline: "Room for Everyone, Without Giving Up an Inch of Capability",
      dek: "The Expedition Platinum is proof that full-size doesn't have to mean full compromise.",
      paragraphs: [
        "Three rows of genuinely usable space, a twin-turbo V6 that tows with authority, and a ride quality smoothed by adaptive suspension — the Expedition Platinum was built for families who also expect their vehicle to work for a living.",
        "Agate Black paint gives the Expedition's imposing proportions a sense of occasion, while the independent rear suspension — unusual for the segment — keeps the third row livable on long trips rather than merely present.",
        "Inside, Platinum trim brings quilted leather, real wood accents, and a 12-inch touchscreen that makes the cabin feel closer to a flagship sedan than a traditional body-on-frame SUV. It manages the rare trick of feeling both rugged and genuinely upscale.",
      ],
    },
    features: [
      {
        category: "Performance & Engine",
        icon: "engine",
        items: [
          "3.5L twin-turbo EcoBoost V6, 440 hp",
          "10-speed automatic transmission",
          "Independent rear suspension",
          "Up to 9,300 lbs towing capacity",
        ],
      },
      {
        category: "Luxury & Comfort",
        icon: "comfort",
        items: [
          "Quilted leather heated & ventilated seats",
          "Power-folding third row",
          "Panoramic vista roof",
          "Massaging front seats",
        ],
      },
      {
        category: "Technology & Safety",
        icon: "tech",
        items: [
          "12-inch SYNC 4 touchscreen",
          "Pro Trailer Backup Assist",
          "360-degree camera system",
          "Adaptive cruise control with stop-and-go",
        ],
      },
    ],
  },
  "mercedes-amg-gtr-2023": {
    images: galleryFor(
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1600&q=80",
      3,
    ),
    editorial: {
      headline: "Built on a Track, Refined for the Road",
      dek: "The GT R Pro was tuned at the Nürburgring before it was ever tuned for comfort — and it shows.",
      paragraphs: [
        "Green Hell Magno paint is not a color choice so much as a statement of origin: named for the Nürburgring's Green Hell nickname, it marks a car whose suspension geometry, aero package, and roll cage were all shaped by lap times, not showroom appeal.",
        "The handcrafted twin-turbo V8 sends power through a rear-mounted transaxle for near-perfect weight distribution, while an active rear-wheel steering system sharpens turn-in at speed and stabilizes the car at a standstill in ways that feel almost unfair.",
        "AMG didn't soften the Pro package to make it livable — they simply made sure the two things it does best, going fast and stopping fast, never had to compromise for anything else. This is track engineering with license plates.",
      ],
    },
    features: [
      {
        category: "Performance & Engine",
        icon: "engine",
        items: [
          "4.0L twin-turbo V8, 577 hp",
          "7-speed AMG SPEEDSHIFT DCT",
          "Active rear-wheel steering",
          "Adjustable coilover suspension",
        ],
      },
      {
        category: "Luxury & Comfort",
        icon: "comfort",
        items: [
          "AMG carbon-fiber performance seats",
          "Nappa leather & DINAMICA upholstery",
          "Burmester surround sound system",
          "Carbon-fiber trim package",
        ],
      },
      {
        category: "Technology & Safety",
        icon: "tech",
        items: [
          "AMG Track Pace telemetry",
          "12.3-inch digital instrument cluster",
          "AMG Dynamic Select drive programs",
          "Reversing camera with parking guidance",
        ],
      },
    ],
  },
  "lamborghini-aventador-2023": {
    images: galleryFor(
      "https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?auto=format&fit=crop&w=1600&q=80",
      0,
    ),
    editorial: {
      headline: "The Last of an Era, Loud About It",
      dek: "The naturally aspirated V12 Aventador SVJ is a farewell letter written at 8,700 RPM.",
      paragraphs: [
        "There is nothing subtle about the Aventador SVJ, and it has no interest in becoming subtle. Arancio Xanto paint, a naturally aspirated V12 that revs to 8,700 RPM, and an active aerodynamics system that visibly reshapes itself under hard cornering — this is a car built entirely without compromise.",
        "ALA 2.0 active aero pulls air through the car's body to generate downforce exactly where and when it's needed, a system so effective the SVJ once held the production-car lap record at the Nürburgring. It is motorsport technology wearing license plates.",
        "Inside, the cabin is unapologetically driver-focused — a start button under a fighter-jet-style red cover, a carbon-fiber-forward dashboard, and almost nothing to distract from the engine note filling the cabin behind you. Some cars are transportation. This one is an event.",
      ],
    },
    features: [
      {
        category: "Performance & Engine",
        icon: "engine",
        items: [
          "6.5L naturally aspirated V12, 759 hp",
          "7-speed ISR automated manual transmission",
          "ALA 2.0 active aerodynamics",
          "0-60 mph in 2.8 seconds",
        ],
      },
      {
        category: "Luxury & Comfort",
        icon: "comfort",
        items: [
          "Carbon-fiber racing seats",
          "Alcantara & leather upholstery",
          "Dual-zone climate control",
          "Lifting system for high-clearance situations",
        ],
      },
      {
        category: "Technology & Safety",
        icon: "tech",
        items: [
          "8.4-inch touchscreen infotainment",
          "Reversing camera with parking sensors",
          "Lamborghini Telemetry system",
          "Drive mode selector (Strada, Sport, Corsa, Ego)",
        ],
      },
    ],
  },
};
