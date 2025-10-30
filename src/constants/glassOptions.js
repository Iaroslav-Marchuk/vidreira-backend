export const glassOptions = {
  incolor: {
    label: 'Incolor',
    types: {
      vfc: {
        label: 'VFClaro',
        thickness: [4, 5, 6, 8, 10],
        temper: 'both',
      },
    },
  },

  impresso: {
    label: 'Impresso',
    types: {
      crepe: {
        label: 'Crepe Inc.',
        thickness: [4, 6],
        temper: 'both',
      },
      aramado: {
        label: 'Aramado Inc.',
        thickness: [6],
        temper: 'no',
      },
    },
  },

  fosco: {
    label: 'Novoglass',
    types: {
      fosco: {
        label: 'Novoglass',
        thickness: [4, 5, 6, 8],
        temper: 'both',
      },
    },
  },

  colorido: {
    label: 'Colorido',
    types: {
      vfb: {
        label: 'VFBronze',
        thickness: [4, 5, 6, 8, 10],
        temper: 'both',
      },
      vfv: {
        label: 'VFVerde',
        thickness: [4, 5, 6, 8, 10],
        temper: 'both',
      },
      vfg: {
        label: 'VFGris',
        thickness: [4, 5, 6, 8, 10],
        temper: 'both',
      },
    },
  },

  laminadoIncolor: {
    label: 'Laminado Incolor',
    types: {
      lamC: {
        label: 'V. Lam C.',
        thickness: ['3+3', '4+4', '5+5', '6+6'],
        temper: 'no',
      },
    },
  },

  laminadoSilence: {
    label: 'Laminado Silence',
    types: {
      lamS: {
        label: 'V. Lam Sil.',
        thickness: ['3+3', '4+4', '5+5', '6+6'],
        temper: 'no',
      },
    },
  },

  laminadoOpalino: {
    label: 'Laminado Opalino',
    types: {
      lamO: {
        label: 'V. Lam Opal.',
        thickness: ['3+3', '4+4', '5+5', '6+6'],
        temper: 'no',
      },
    },
  },

  laminadoCor: {
    label: 'Laminado Cor',
    types: {
      lamB: {
        label: 'V. Lam Bronze',
        thickness: ['3+3', '4+4', '5+5', '6+6'],
        temper: 'no',
      },
      lamV: {
        label: 'V. Lam Verde',
        thickness: ['3+3', '4+4', '5+5', '6+6'],
        temper: 'no',
      },
      lamG: {
        label: 'V. Lam Gris',
        thickness: ['3+3', '4+4', '5+5', '6+6'],
        temper: 'no',
      },
    },
  },

  laminadoCapa: {
    label: 'Laminado Baixo Emissivo',
    types: {
      lamPlXN: {
        label: 'V. Lam Planitherm XN',
        thickness: ['4+4', '6+6'],
        temper: 'no',
      },
      lamPl4s: {
        label: 'V. Lam Planitherm 4s',
        thickness: ['4+4'],
        temper: 'no',
      },
      lamCG: {
        label: 'V. Lam Climaguard Premium',
        thickness: ['4+4'],
        temper: 'no',
      },
      lamGS: {
        label: 'V. Lam Guardian Sun',
        thickness: ['4+4'],
        temper: 'no',
      },
    },
  },

  espelhado: {
    label: 'Control Solar / Espelhado',
    types: {
      stopSol: {
        label: 'Stop Sol Claro',
        thickness: ['5', '6'],
        temper: 'both',
      },
      mirastar: {
        label: 'Mirastar',
        thickness: ['6', '8'],
        temper: 'both',
      },
    },
  },

  capa: {
    label: 'Baixo Emissivo',
    types: {
      plXN: {
        label: 'Planitherm XN',
        thickness: [4, 6, 8],
        temper: 'both',
      },
      plU: {
        label: 'Planitherm ULTRA N',
        thickness: [4, 6, 8],
        temper: 'both',
      },
      CG: {
        label: 'Climaguard Premium',
        thickness: [4, 6],
        temper: 'both',
      },
    },
  },

  capaSolar: {
    label: 'Control Solar / Baixo Emissivo',
    types: {
      pl4s: {
        label: 'Planitherm 4S',
        thickness: [4, 6, 8],
        temper: 'both',
      },
      plOne: {
        label: 'Planitherm One',
        thickness: [6, 8],
        temper: 'both',
      },
      planistar: {
        label: 'Planistar',
        thickness: [6, 8],
        temper: 'both',
      },
      GS: {
        label: 'Guardian Sun',
        thickness: [4, 6, 8],
        temper: 'both',
      },
    },
  },

  coolLite: {
    label: 'Cool-Lite',
    types: {
      ST120: {
        label: 'ST 120 II',
        thickness: [6, 8],
        temper: 'yes',
      },
      ST136: {
        label: 'ST 136 II',
        thickness: [6, 8],
        temper: 'yes',
      },
      ST150: {
        label: 'ST 150 II',
        thickness: [6, 8],
        temper: 'yes',
      },
      SKN144: {
        label: 'SKN 144 II',
        thickness: [6, 8],
        temper: 'yes',
      },
      SKN154: {
        label: 'SKN 154 II',
        thickness: [6, 8],
        temper: 'yes',
      },
      SKN165: {
        label: 'SKN 165 II',
        thickness: [6, 8],
        temper: 'yes',
      },
      SKN176: {
        label: 'SKN 176 II',
        thickness: [6, 8],
        temper: 'yes',
      },
      SKN183: {
        label: 'SKN 183 II',
        thickness: [6, 8],
        temper: 'yes',
      },
      xtreme5022: {
        label: 'Xtreme 50/22 II',
        thickness: [6, 8],
        temper: 'yes',
      },
      xtreme6028: {
        label: 'Xtreme 60/28 II',
        thickness: [6, 8],
        temper: 'yes',
      },
      xtreme6129: {
        label: 'Xtreme 61/29 II',
        thickness: [6, 8],
        temper: 'yes',
      },
      xtreme7033: {
        label: 'Xtreme 70/33 II',
        thickness: [6, 8],
        temper: 'yes',
      },
    },
  },

  sunguard: {
    label: 'Sunguard',
    types: {
      SN2918: {
        label: 'SN 29/18 HT II',
        thickness: [6, 8],
        temper: 'yes',
      },
      SN4023: {
        label: 'SN 40/23 HT II',
        thickness: [6, 8],
        temper: 'yes',
      },
      SN51: {
        label: 'SN 51 HT II',
        thickness: [6, 8],
        temper: 'yes',
      },
      SN7035: {
        label: 'SN 70/35 HT II',
        thickness: [6, 8],
        temper: 'yes',
      },
      SN7037: {
        label: 'SN 70/37 HT II',
        thickness: [6, 8],
        temper: 'yes',
      },
      SN70S: {
        label: 'SN 70S HT II',
        thickness: [6, 8],
        temper: 'yes',
      },
      SNX50: {
        label: 'SNX 50 HT II',
        thickness: [6, 8],
        temper: 'yes',
      },
      SNX60: {
        label: 'SNX 60 HT II',
        thickness: [6, 8],
        temper: 'yes',
      },
      SNX70: {
        label: 'SNX 70 HT II',
        thickness: [6, 8],
        temper: 'yes',
      },
      HP5032: {
        label: 'HP 50/32 II',
        thickness: [6, 8],
        temper: 'yes',
      },
    },
  },
};
