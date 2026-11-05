export interface ChallengeItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  problem: string;
  solution: string;
  impact: string;
  tags: string[];
}

export interface MetricItem {
  label: string;
  before: string;
  after: string;
  change: string;
  description: string;
  highlight?: boolean;
}

export interface ArchitectureNode {
  id: string;
  layer: string;
  title: string;
  subtitle: string;
  technologies: string[];
  responsibilities: string[];
  protocols: string[];
}

export interface ProcessStep {
  step: string;
  title: string;
  duration: string;
  description: string;
  deliverables: string[];
}

export interface ColorSwatch {
  name: string;
  hex: string;
  role: string;
  textColor: string;
  border?: boolean;
}
