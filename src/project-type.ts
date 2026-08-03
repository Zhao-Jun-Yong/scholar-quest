export function detectProjectType(tags: string[], projectTags: Record<string, string>): string | null {
  for (const [type, tag] of Object.entries(projectTags)) {
    if (tags.includes(tag) || tags.includes('#' + tag)) return type;
  }
  return null;
}
