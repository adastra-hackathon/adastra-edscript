export interface Banner {
  id: string;
  title: string | null;
  subtitle: string | null;
  imageUrl: string;
  mobileImageUrl: string | null;
  redirectType: string | null;
  redirectValue: string | null;
  sortOrder: number;
}

export interface HomeShortcut {
  id: string;
  title: string;
  imageUrl: string | null;
  redirectType: string | null;
  redirectValue: string | null;
  sortOrder: number;
}

export interface HomeData {
  banners: Banner[];
  shortcuts: HomeShortcut[];
}
