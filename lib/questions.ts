export interface Question {
  q: string
  A: string
  B: string
  C: string
  D: string
  correct: "A" | "B" | "C" | "D"
  money: number
}

export const allQuestions: Question[] = [
  {
    q: "Ki lwa ki te aboli esklavaj an 1793?",
    A: "Code Noir",
    B: "Dekrè Sonthonax",
    C: "Akò Bâle",
    D: "Lwa Masèl",
    correct: "B",
    money: 1000,
  },
  {
    q: "Ki òganit ki pwodui enèji nan selil la?",
    A: "Nwayo",
    B: "Mitokondri",
    C: "Ribozòm",
    D: "Po",
    correct: "B",
    money: 5000,
  },
  {
    q: "Ki kote Dessalines te pwoklame endepandans lan?",
    A: "Gonayiv",
    B: "Okap",
    C: "Milo",
    D: "Pòtoprens",
    correct: "A",
    money: 10000,
  },
  {
    q: "Ki molekil ki pote kòd jenetik la?",
    A: "ADN",
    B: "ARN",
    C: "Vitamin",
    D: "Sèl",
    correct: "A",
    money: 50000,
  },
  {
    q: "Ki batay ki te fèt 18 novanm 1803?",
    A: "Vètyè",
    B: "Milo",
    C: "Sereine",
    D: "Bulto",
    correct: "A",
    money: 100000,
  },
  {
    q: "Ki sa ki inite de baz lavi a?",
    A: "Selil",
    B: "Atòm",
    C: "Tisi",
    D: "Zo",
    correct: "A",
    money: 250000,
  },
  {
    q: "Ki premye non Ayiti te genyen?",
    A: "Ayiti",
    B: "Quisqueya",
    C: "Sen Domeng",
    D: "Bohio",
    correct: "B",
    money: 500000,
  },
  {
    q: "Konbyen kwomozòm yon moun nòmal genyen?",
    A: "46",
    B: "23",
    C: "48",
    D: "50",
    correct: "A",
    money: 1000000,
  },
]
