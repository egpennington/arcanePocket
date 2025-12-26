
export enum TrickType {
  GALLERY = 'GALLERY',
  ARTIFACTS = 'ARTIFACTS',
  THOUGHT_LOCK = 'THOUGHT_LOCK',
  CARD_MASTER = 'CARD_MASTER',
  CHAOS_PROTOCOL = 'CHAOS_PROTOCOL'
}

export interface Trick {
  id: TrickType;
  title: string;
  description: string;
  icon: string;
  category: 'Digital' | 'Mentalism' | 'Physical';
}
