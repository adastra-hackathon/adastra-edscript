export interface FavoriteGame {
  id: string;
  gameId: string;
  createdAt: string;
  game: {
    id: string;
    name: string;
    slug: string;
    imageUrl: string | null;
    type: string;
    isPopular: boolean;
    isNew: boolean;
    provider: { id: string; name: string; slug: string };
  };
}

export interface RecentGame {
  id: string;
  gameId: string;
  lastPlayedAt: string;
  game: FavoriteGame['game'];
}
