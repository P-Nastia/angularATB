export interface Category{
  id: number;
  name: string;
  slug: string;
  image: string;
}

export interface CreateCategory {
  name: string;
  image: string;
  slug: string;
}
