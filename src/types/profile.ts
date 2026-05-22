export type WorkerProfileRecord = {
  userId: string;
  email: string;
  phone: string | null;
  realName: string | null;
  workerName: string;
  characterName: string;
  intro: string;
  jobs: readonly string[];
  huntingAreas: readonly string[];
  availableTime: string;
  priceText: string;
  openKakaoUrl: string | null;
  discordContact: string | null;
  averageRating: number;
  verificationPostCount: number;
};

export type PublicWorkerProfile = {
  userId: string;
  workerName: string;
  characterName: string;
  intro: string;
  jobs: readonly string[];
  huntingAreas: readonly string[];
  availableTime: string;
  priceText: string;
  contacts: {
    openKakaoUrl?: string;
    discordContact?: string;
  };
  averageRating: number;
  verificationPostCount: number;
};
