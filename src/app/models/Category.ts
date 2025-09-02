export interface Category{
  id: number;
  name: string;
  slug: string;
  image: string;
}

export interface ICategoryCreate {
  name: string;
  slug: string;
  imageFile?: File | null;
}
