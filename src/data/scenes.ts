export type SceneId = 'bedroom' | 'garden' | 'kitchen' | 'office' | 'bathroom' | 'living'
export type InteractiveId = 'lamp' | 'alarm' | 'bed' | 'window' | 'curtains' | 'pillow' | 'blanket' | 'fan' | 'phone' | 'door' | 'mosquito' | 'clock' | 'plant' | 'switch2'

export const scenes: { id: SceneId; name: string; subtitle: string; available: boolean; icon: string }[] = [
  { id: 'bedroom', name: 'Bedroom', subtitle: 'Let him sleep. Or don’t.', available: true, icon: '☾' },
  { id: 'garden', name: 'Garden', subtitle: 'His little patch of peace.', available: false, icon: '❀' },
  { id: 'kitchen', name: 'Kitchen', subtitle: 'Breakfast is at risk.', available: false, icon: '⌁' },
  { id: 'office', name: 'Office', subtitle: 'Productivity will suffer.', available: false, icon: '▤' },
  { id: 'bathroom', name: 'Bathroom', subtitle: 'A slippery situation.', available: false, icon: '◌' },
  { id: 'living', name: 'Living room', subtitle: 'He just wants to relax.', available: false, icon: '▱' },
]
export const bedroomObjects = [
  { id: 'lamp', name: 'Bedside lamp', hint: 'Click to wake him up', action: 'toggle' },
  { id: 'alarm', name: 'Alarm clock', hint: 'Make his alarm ring', action: 'alarm' },
  { id: 'bed', name: 'Bed frame', hint: 'Give the bed a shake', action: 'shake' },
  { id: 'window', name: 'Window', hint: 'Let the cold air in', action: 'toggle' },
  { id: 'curtains', name: 'Curtains', hint: 'Let the sunshine in', action: 'toggle' },
  { id: 'pillow', name: 'Pillow', hint: 'Steal his pillow', action: 'drag' },
  { id: 'blanket', name: 'Blanket', hint: 'Pull the blanket away', action: 'drag' },
  { id: 'fan', name: 'Ceiling fan', hint: 'Change the fan speed', action: 'cycle' },
  { id: 'phone', name: 'Phone', hint: 'Make his phone ring', action: 'ring' },
  { id: 'door', name: 'Bedroom door', hint: 'Knock on the door', action: 'knock' },
  { id: 'mosquito', name: 'Mosquito', hint: 'Buzz around his head', action: 'buzz' },
  { id: 'clock', name: 'Wall clock', hint: 'Mess with the time', action: 'clock' },
] as const