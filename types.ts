
export interface BrandProfile {
  name: string;
  role: string;
  tagline: string;
  summary: string;
  skills: string[];
  projects: Array<{
    title: string;
    description: string;
    tags: string[];
    link?: string;
  }>;
  hueShift: number;
}
