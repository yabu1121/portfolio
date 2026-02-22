export interface Tech {
  id: number
  name: string
  level: number
  description: string
}

export interface TimelineItem {
  id: number
  year: string
  month: number
  category: string
  title: string
  detail: string
}

export interface Project {
  id: number
  title: string
  description: string
  techs: string[]
  github?: string
  url?: string
  image?: string
  category: "ai" | "udemy" | "self"
}


export interface Links {
  id: number;
  topic: string;
  link: string;
}

  