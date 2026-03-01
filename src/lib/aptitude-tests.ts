export interface Question {
  id: number
  question: string
  options: string[]
  correctIndex: number
}

export interface AptitudeTest {
  id: string
  title: string
  description: string
  category: 'logical' | 'math' | 'mixed'
  questions: Question[]
  timeLimitMinutes: number
  icon: string
  color: string
}

export interface TestResult {
  testId: string
  score: number
  correctAnswers: number
  totalQuestions: number
  completedAt: string
}

export const APTITUDE_TESTS: AptitudeTest[] = [
  {
    id: 'logical-reasoning',
    title: 'Logical Reasoning',
    description: 'Test your pattern recognition, deductive reasoning, and analytical problem-solving skills.',
    category: 'logical',
    timeLimitMinutes: 15,
    icon: '🧠',
    color: '#6366f1',
    questions: [
      {
        id: 1,
        question: 'Find the next number in the series: 2, 6, 12, 20, 30, ?',
        options: ['36', '40', '42', '44'],
        correctIndex: 2,
      },
      {
        id: 2,
        question: 'If CAT is coded as ECV (each letter +2), how is DOG coded?',
        options: ['FQI', 'EPI', 'FPI', 'GQJ'],
        correctIndex: 0,
      },
      {
        id: 3,
        question: 'Which word does NOT belong to the group?',
        options: ['Apple', 'Mango', 'Carrot', 'Orange'],
        correctIndex: 2,
      },
      {
        id: 4,
        question: 'Find the next number in the Fibonacci series: 1, 1, 2, 3, 5, 8, 13, ?',
        options: ['18', '21', '24', '25'],
        correctIndex: 1,
      },
      {
        id: 5,
        question: 'A is taller than B. D is taller than C but shorter than B. Who is the shortest?',
        options: ['A', 'B', 'C', 'D'],
        correctIndex: 2,
      },
      {
        id: 6,
        question: 'Doctor is to Hospital as Teacher is to?',
        options: ['Student', 'School', 'Book', 'Knowledge'],
        correctIndex: 1,
      },
      {
        id: 7,
        question: 'A man walks 5 km North, then 3 km East, then 5 km South. How far is he from his starting point?',
        options: ['1 km', '2 km', '3 km', '5 km'],
        correctIndex: 2,
      },
      {
        id: 8,
        question: 'If 3 cats can catch 3 mice in 3 minutes, how many cats are needed to catch 9 mice in 9 minutes?',
        options: ['1', '3', '6', '9'],
        correctIndex: 1,
      },
      {
        id: 9,
        question: 'Odd one out: 2, 3, 5, 7, 9, 11',
        options: ['2', '5', '9', '11'],
        correctIndex: 2,
      },
      {
        id: 10,
        question: 'Statement: All roses are flowers. Some flowers fade quickly. Conclusion: Some roses fade quickly.',
        options: ['True', 'False', 'Cannot be determined', 'Partially true'],
        correctIndex: 2,
      },
    ],
  },
  {
    id: 'mathematics',
    title: 'Mathematics',
    description: 'Evaluate your numerical ability, arithmetic, algebra, and quantitative reasoning skills.',
    category: 'math',
    timeLimitMinutes: 20,
    icon: '📐',
    color: '#10b981',
    questions: [
      {
        id: 1,
        question: 'What is 25% of 480?',
        options: ['100', '110', '120', '130'],
        correctIndex: 2,
      },
      {
        id: 2,
        question: 'A train covers 360 km in 4 hours. What is its speed in km/h?',
        options: ['80', '85', '90', '95'],
        correctIndex: 2,
      },
      {
        id: 3,
        question: 'If 2x + 3 = 11, what is the value of x?',
        options: ['3', '4', '5', '6'],
        correctIndex: 1,
      },
      {
        id: 4,
        question: 'Simple Interest on ₹5000 at 8% per annum for 3 years is?',
        options: ['₹1000', '₹1200', '₹1500', '₹1800'],
        correctIndex: 1,
      },
      {
        id: 5,
        question: 'What is the LCM of 12 and 18?',
        options: ['24', '30', '36', '72'],
        correctIndex: 2,
      },
      {
        id: 6,
        question: '√144 + √81 = ?',
        options: ['18', '19', '21', '25'],
        correctIndex: 2,
      },
      {
        id: 7,
        question: 'A rectangle has length 12 cm and width 8 cm. What is its area?',
        options: ['40 cm²', '80 cm²', '96 cm²', '100 cm²'],
        correctIndex: 2,
      },
      {
        id: 8,
        question: '15% of what number equals 45?',
        options: ['200', '250', '300', '350'],
        correctIndex: 2,
      },
      {
        id: 9,
        question: 'A product priced at ₹500 gets a 20% discount. What is the selling price?',
        options: ['₹350', '₹380', '₹400', '₹420'],
        correctIndex: 2,
      },
      {
        id: 10,
        question: '2³ × 2² = ?',
        options: ['16', '32', '64', '128'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'mixed-aptitude',
    title: 'Mixed Aptitude',
    description: 'A comprehensive challenge combining logical reasoning and mathematical problem-solving.',
    category: 'mixed',
    timeLimitMinutes: 20,
    icon: '⚡',
    color: '#f59e0b',
    questions: [
      {
        id: 1,
        question: 'Which number is NOT prime: 2, 3, 7, 9, 11?',
        options: ['2', '3', '9', '11'],
        correctIndex: 2,
      },
      {
        id: 2,
        question: 'Series: 3, 9, 27, 81, ?',
        options: ['162', '243', '256', '324'],
        correctIndex: 1,
      },
      {
        id: 3,
        question: 'Fish is to Water as Bird is to?',
        options: ['Nest', 'Tree', 'Air', 'Feather'],
        correctIndex: 2,
      },
      {
        id: 4,
        question: 'A walks 10 km North, 5 km East, then 10 km South. How far from start?',
        options: ['5 km North', '5 km East', '5 km West', '10 km South'],
        correctIndex: 1,
      },
      {
        id: 5,
        question: 'Odd one out: 3, 6, 9, 12, 16, 18',
        options: ['6', '9', '16', '18'],
        correctIndex: 2,
      },
      {
        id: 6,
        question: 'Compound Interest on ₹1000 at 10% per annum for 2 years?',
        options: ['₹200', '₹210', '₹220', '₹250'],
        correctIndex: 1,
      },
      {
        id: 7,
        question: 'A person covers 60 km in 1.5 hours. What is his speed?',
        options: ['35 km/h', '40 km/h', '45 km/h', '50 km/h'],
        correctIndex: 1,
      },
      {
        id: 8,
        question: 'Average of 5, 10, 15, 20, 25?',
        options: ['12', '13', '15', '16'],
        correctIndex: 2,
      },
      {
        id: 9,
        question: '3/4 + 5/8 = ?',
        options: ['9/8', '10/8', '11/8', '12/8'],
        correctIndex: 2,
      },
      {
        id: 10,
        question: 'Cost price ₹200, selling price ₹250. What is the profit percentage?',
        options: ['20%', '25%', '30%', '35%'],
        correctIndex: 1,
      },
    ],
  },
]

export function getTestById(id: string): AptitudeTest | undefined {
  return APTITUDE_TESTS.find((t) => t.id === id)
}

export const STORAGE_KEY = 'hiremind_aptitude_results'

export function getStoredResults(): TestResult[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function saveResult(result: TestResult): void {
  const existing = getStoredResults()
  const filtered = existing.filter((r) => r.testId !== result.testId)
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...filtered, result]))
}
