export type Tech = {
  id: number;
  name: string;
  level: number;
  description: string;
}

export type TimelineItem = {
  id: number;
  year: string;
  month: number;
  category: string;
  title: string;
  detail: string;
}

export type Project = {
  id: number;
  title: string;
  description: string;
  techs: string[];
  github?: string;
  url?: string;
  image?: string;
  category: "ai" | "udemy" | "self";
}


export type Links = {
  id: number;
  topic: string;
  link: string;
}

  