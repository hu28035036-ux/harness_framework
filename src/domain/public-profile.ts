import type { PublicWorkerProfile, WorkerProfileRecord } from "@/types/profile";

export function toPublicWorkerProfile(profile: WorkerProfileRecord): PublicWorkerProfile {
  return {
    userId: profile.userId,
    workerName: profile.workerName,
    characterName: profile.characterName,
    intro: profile.intro,
    jobs: profile.jobs,
    huntingAreas: profile.huntingAreas,
    availableTime: profile.availableTime,
    priceText: profile.priceText,
    contacts: {
      ...(profile.openKakaoUrl ? { openKakaoUrl: profile.openKakaoUrl } : {}),
      ...(profile.discordContact ? { discordContact: profile.discordContact } : {}),
    },
    averageRating: profile.averageRating,
    verificationPostCount: profile.verificationPostCount,
  };
}
