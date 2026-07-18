export interface SampleHomework {
  id: string;
  title: string;
  subject: string;
  question: string;
  imageUrl?: string;
}

export const SAMPLE_HOMEWORK_LIST: SampleHomework[] = [
  {
    id: "math_quadratic",
    title: "Quadratic Equation Solvability",
    subject: "Mathematics",
    question: "Find the roots of the equation 3x^2 - 5x + 2 = 0 using the quadratic formula. State the discriminant and explain if roots are real or complex."
  },
  {
    id: "math_derivative",
    title: "Calculus: Rate of Change",
    subject: "Mathematics",
    question: "A ball is thrown upward with velocity v(t) = -32t + 96. Find the maximum height reached by the ball if it is thrown from an initial height of 10 feet. Show the integration steps."
  },
  {
    id: "phys_circuits",
    title: "Physics: Parallel Resistors",
    subject: "Physics",
    question: "A circuit has three resistors connected in parallel with resistances of 4 ohms, 6 ohms, and 12 ohms. The battery provides a voltage of 24V. What is the total equivalent resistance of the circuit, and what is the current passing through the 6-ohm resistor?"
  },
  {
    id: "chem_equations",
    title: "Chemistry: Balancing Reaction",
    subject: "Chemistry",
    question: "Balance the chemical equation: C3H8 + O2 -> CO2 + H2O. Explain the conservation of mass and how to determine the stoichiometric coefficients step-by-step."
  },
  {
    id: "essay_narrative",
    title: "Essay Grammar & Flow Polish",
    subject: "English",
    question: "The young boy runned as fast as he can but the big bus already leaved. He felt very sad and disappointed because he was going to be late to school. He didn't knew what to do next."
  },
  {
    id: "cs_recursion",
    title: "CS: Binary Tree Search",
    subject: "Computer Science",
    question: "Explain the difference between Breadth-First Search (BFS) and Depth-First Search (DFS) in a binary tree. When would you prefer one over the other in terms of space complexity?"
  }
];
