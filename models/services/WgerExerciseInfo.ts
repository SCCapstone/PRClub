export default interface WgerExerciseInfo {
  id: number;
  name: string;
  uuid: string;
  description: string;
  creationDate: string;
  category: Category;
  muscles: Muscle[];
  musclesSecondary: MuscleSecondary[];
  equipment: Equipment[];
  language: Language;
  license: License;
  licenseAuthor: string;
  images: Image[];
  comments: Comment[];
  variations: number[];
}

interface Category {
  id: number;
  name: string;
}

interface Muscle {
  id: number;
  name: string;
  isFront: boolean;
  imageUrlMain: string;
  imageUrlSecondary: string;
}

interface MuscleSecondary {
  id: number;
  name: string;
  isFront: boolean;
  iamgeUrlMain: string;
  imageUrlSecondary: string;
}

interface Equipment {
  id: number;
  name: string;
}

interface Language {
  id: number;
  shortName: string;
  fullName: string;
}

interface License {
  id: number;
  fullName: string;
  shortName: string;
  url: string;
}

interface Image {
  id: number;
  uuid: string;
  exerciseBase: number;
  image: string;
  isMain: boolean;
  status: string;
  style: string;
}

interface Comment {
  id: number;
  exercise: number;
  comment: string;
}
