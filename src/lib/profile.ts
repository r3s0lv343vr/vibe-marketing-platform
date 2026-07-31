export type StudentProject = {
  id: string;
  title: string;
  websiteUrl: string;
  githubUrl: string;
  imageDataUrl: string;
};

export type StudentProfile = {
  displayName: string;
  bio: string;
  universities: string[];
  skills: string[];
  avatarDataUrl: string;
  projects: StudentProject[];
  updatedAt: string;
};

export type ProfileSearchIndex = {
  email: string;
  displayName: string;
  bio: string;
  universities: string[];
  skills: string[];
  projectTitles: string[];
  githubUrls: string[];
  websiteUrls: string[];
  complete: boolean;
};

export const PROFILE_STORAGE_KEY = "pixie_student_profile";
export const PROFILE_COMPLETE_COOKIE = "pixie_profile_complete";
export const PROFILE_INDEX_COOKIE = "pixie_profile_index";

export function emptyProfile(displayName = ""): StudentProfile {
  return {
    displayName,
    bio: "",
    universities: [],
    skills: [],
    avatarDataUrl: "",
    projects: [
      {
        id: cryptoRandomId(),
        title: "",
        websiteUrl: "",
        githubUrl: "",
        imageDataUrl: "",
      },
    ],
    updatedAt: new Date().toISOString(),
  };
}

export function cryptoRandomId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `p_${Math.random().toString(36).slice(2, 10)}`;
}

/** Split skills/universities on commas or semicolons; trim; drop empties. */
export function splitTags(input: string): string[] {
  return input
    .split(/[,;]+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function isProfileComplete(profile: StudentProfile): boolean {
  return (
    profile.displayName.trim().length >= 2 &&
    profile.bio.trim().length >= 40 &&
    profile.skills.length >= 1 &&
    profile.universities.length >= 1 &&
    profile.projects.some(
      (p) =>
        p.title.trim().length > 0 &&
        (p.websiteUrl.trim().length > 0 || p.githubUrl.trim().length > 0),
    )
  );
}

export function toSearchIndex(email: string, profile: StudentProfile): ProfileSearchIndex {
  return {
    email,
    displayName: profile.displayName.trim(),
    bio: profile.bio.trim(),
    universities: profile.universities,
    skills: profile.skills.map((s) => s.toLowerCase()),
    projectTitles: profile.projects.map((p) => p.title.trim()).filter(Boolean),
    githubUrls: profile.projects.map((p) => p.githubUrl.trim()).filter(Boolean),
    websiteUrls: profile.projects.map((p) => p.websiteUrl.trim()).filter(Boolean),
    complete: isProfileComplete(profile),
  };
}
