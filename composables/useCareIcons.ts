const symbolMap: Record<number, string> = {
  720: 'machine-wash-30-gentle-or-delicate',
  741: 'machine-wash-30-permanent-press',
  739: 'machine-wash-30',
  721: 'machine-wash-40-gentle-or-delicate',
  723: 'machine-wash-40-permanent-press',
  724: 'machine-wash-40',
  722: 'machine-wash-60-permanent-press',
  730: 'machine-wash-60',
  719: '', // 95 °C pflegeleichte Wäsche
  728: 'machine-wash-95',
  743: 'bleach-if-needed',
  736: 'oxygen-bleach-if-needed',
  731: 'iron',
  734: 'hand-wash',
  746: 'iron-high',
  725: 'dry-flat',
  738: 'iron-medium',
  // 744: '', // nicht auswringen
  757: 'do-not-bleach',
  750: 'do-not-iron',
  727: 'do-not-dry-clean',
  726: 'iron-low',
  // 729: '', //Nicht mit Dampf bügeln
  762: 'do-not-tumble-dry',
  733: 'do-not-wash',
  754: '', // Schonend reinigen mit Kohlenwasserstofflösungsmittel
  732: '', // Schonend reinigen mit Perchlorethylen
  758: '', // Trockenreinigung
  751: '', // Trockenreinigung mit Kohlenwasserstofflösungsmittel
  753: '', // Trockenreinigung mit Perchlorethylen
  737: 'tumble-dry-at-low-temperature',
  745: 'tumble-dry-at-normal-temperature',
  768: 'tumble-dry',
  777: 'drip-dry',
}

export function useCareIcons() {
  return {
    iconComponent(iconId?: number): string | undefined {
      if (!iconId || !(iconId in symbolMap)) {
        return undefined
      }
      return `IconCare${usePascal(symbolMap[iconId])}`
    },
  }
}
