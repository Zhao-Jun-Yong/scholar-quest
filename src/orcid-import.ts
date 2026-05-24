import { requestUrl } from 'obsidian';
import { OnboardingData } from './types';

export interface OrcidImportResult {
  data: Partial<Omit<OnboardingData, 'avatarTheme'>>;
  filled: (keyof OnboardingData)[];
  warnings: string[];
}

const ORCID_BASE = 'https://pub.orcid.org/v3.0';

const NS_ACTIVITIES   = 'http://www.orcid.org/ns/activities';
const NS_COMMON       = 'http://www.orcid.org/ns/common';
const NS_PERSONAL     = 'http://www.orcid.org/ns/personal-details';
const NS_WORK         = 'http://www.orcid.org/ns/work';
const NS_FUNDING      = 'http://www.orcid.org/ns/funding';
const NS_EMPLOYMENT   = 'http://www.orcid.org/ns/employment';
const NS_EDUCATION    = 'http://www.orcid.org/ns/education';
const NS_QUALIFICATION = 'http://www.orcid.org/ns/qualification';
const NS_DISTINCTION  = 'http://www.orcid.org/ns/distinction';
const NS_SERVICE      = 'http://www.orcid.org/ns/service';
const NS_PEER_REVIEW  = 'http://www.orcid.org/ns/peer-review';
const NS_INVITED      = 'http://www.orcid.org/ns/invited-position';

// Work types that map to journal articles / book chapters / papers
const PAPER_TYPES = new Set([
  'journal-article', 'book-chapter', 'preprint', 'review',
  'book-review', 'working-paper', 'report', 'dissertation-thesis',
  'magazine-article', 'newsletter-article',
]);

const CONFERENCE_TYPES = new Set([
  'conference-paper', 'conference-presentation', 'conference-output',
  'conference-abstract', 'conference-poster', 'conference-proceedings',
]);

// ── XML helpers ─────────────────────────────────────────────────────────────

function getEls(parent: Document | Element, ns: string, local: string): Element[] {
  return Array.from(parent.getElementsByTagNameNS(ns, local));
}

function getEl(parent: Document | Element, ns: string, local: string): Element | null {
  return parent.getElementsByTagNameNS(ns, local)[0] ?? null;
}

function getText(parent: Document | Element, ns: string, local: string): string {
  return getEl(parent, ns, local)?.textContent?.trim() ?? '';
}

async function fetchXml(url: string): Promise<Document> {
  const res = await requestUrl({ url, headers: { Accept: 'application/xml' } });
  const doc = new DOMParser().parseFromString(res.text, 'text/xml');
  const parseError = doc.querySelector('parsererror');
  if (parseError) throw new Error('ORCID returned invalid XML.');
  return doc;
}

// ── Public helpers ───────────────────────────────────────────────────────────

export function normalizeOrcidId(input: string): string {
  return input.replace(/^https?:\/\/orcid\.org\//, '').trim();
}

export function validateOrcidId(id: string): boolean {
  return /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(id);
}

// ── Main import ──────────────────────────────────────────────────────────────

export async function importFromOrcid(orcidInput: string): Promise<OrcidImportResult> {
  const orcid = normalizeOrcidId(orcidInput);
  if (!validateOrcidId(orcid)) throw new Error(`Invalid ORCID iD: "${orcid}"`);

  const record = await fetchXml(`${ORCID_BASE}/${orcid}/record`);
  const acts = getEl(record, NS_ACTIVITIES, 'activities-summary');
  if (!acts) throw new Error('ORCID profile appears to be empty or private.');

  const data: Partial<Omit<OnboardingData, 'avatarTheme'>> = {};
  const filled: (keyof OnboardingData)[] = [];
  const warnings: string[] = [];

  const set = <K extends keyof Omit<OnboardingData, 'avatarTheme'>>(
    key: K, value: OnboardingData[K],
  ) => {
    (data as Record<string, unknown>)[key] = value;
    filled.push(key);
  };

  // ── Credentials ────────────────────────────────────────────────────────────

  const eduSummaries = [
    ...getEls(acts, NS_EDUCATION, 'education-summary'),
    ...getEls(acts, NS_QUALIFICATION, 'qualification-summary'),
  ];

  let phd = false, masters = false;
  for (const s of eduSummaries) {
    const role = getText(s, NS_COMMON, 'role-title').toLowerCase();
    if (!phd && /ph\.?d|doctor(?:ate|al)?|d\.phil/i.test(role)) phd = true;
    if (!masters && /master|m\.sc|m\.a\b|m\.eng|m\.res|m\.phil/i.test(role)) masters = true;
  }
  if (phd) set('phd', true);
  if (masters) set('masters', true);

  // Postdocs — match only explicit "postdoc" titles to avoid false positives
  let postdocs = 0;
  for (const s of getEls(acts, NS_EMPLOYMENT, 'employment-summary')) {
    const role = getText(s, NS_COMMON, 'role-title').toLowerCase();
    if (/postdoc|post-doc|post doc/i.test(role)) postdocs++;
  }
  if (postdocs > 0) set('postdocs', postdocs);

  // ── Works ──────────────────────────────────────────────────────────────────

  const workSummaries = getEls(acts, NS_WORK, 'work-summary');

  let authoredBooks = 0, editedVolumes = 0, softwareDatasets = 0;
  let patents = 0, conferenceTalks = 0, invitedTalkWorks = 0;
  const paperPutCodes: number[] = [];

  for (const s of workSummaries) {
    const type = getText(s, NS_WORK, 'type').toLowerCase();
    const putCode = parseInt(s.getAttribute('put-code') ?? '0', 10);

    if (PAPER_TYPES.has(type)) {
      if (putCode) paperPutCodes.push(putCode);
    } else if (type === 'book') {
      authoredBooks++;
    } else if (type === 'edited-book') {
      editedVolumes++;
    } else if (type === 'software' || type === 'data-set' || type === 'data-management-plan') {
      softwareDatasets++;
    } else if (type === 'patent') {
      patents++;
    } else if (CONFERENCE_TYPES.has(type)) {
      conferenceTalks++;
    } else if (type === 'lecture-speech') {
      invitedTalkWorks++;
    }
  }

  if (authoredBooks > 0) set('authoredBooks', authoredBooks);
  if (editedVolumes > 0) set('editedVolumes', editedVolumes);
  if (softwareDatasets > 0) set('softwareDatasets', softwareDatasets);
  if (patents > 0) set('patents', patents);
  if (conferenceTalks > 0) set('conferenceTalks', conferenceTalks);

  // Bulk-fetch full work records for contributor-sequence (summaries omit it).
  // ORCID often omits contributor-sequence even in full records; fall back to
  // finding the owner by name or ORCID iD in the contributor list.
  let firstAuthorPapers = 0, coAuthorPapers = 0, unknownAuthorPapers = 0;

  if (paperPutCodes.length > 0) {
    // Extract owner's name for fallback matching
    const ownerGiven = getText(record, NS_PERSONAL, 'given-names').toLowerCase();
    const ownerFamily = getText(record, NS_PERSONAL, 'family-name').toLowerCase();

    for (let i = 0; i < paperPutCodes.length; i += 100) {
      const batch = paperPutCodes.slice(i, i + 100);
      const bulkDoc = await fetchXml(`${ORCID_BASE}/${orcid}/works/${batch.join(',')}`);

      for (const w of getEls(bulkDoc, NS_WORK, 'work')) {
        const contributors = getEls(w, NS_WORK, 'contributor');
        if (contributors.length === 0) {
          unknownAuthorPapers++;
          continue;
        }

        // Try contributor-sequence first (most explicit)
        const seq = getText(contributors[0], NS_WORK, 'contributor-sequence').toLowerCase();
        if (seq === 'first') { firstAuthorPapers++; continue; }
        if (seq === 'additional') { coAuthorPapers++; continue; }

        // contributor-sequence absent — find owner's position by name or ORCID iD
        const ownerIdx = contributors.findIndex(c => {
          const orcidPath = getEl(c, NS_COMMON, 'path')?.textContent?.trim() ?? '';
          if (orcidPath && orcidPath === orcid) return true;
          const name = getText(c, NS_WORK, 'credit-name').toLowerCase();
          return ownerFamily && name.includes(ownerFamily);
        });

        if (ownerIdx === -1) {
          unknownAuthorPapers++;
        } else if (ownerIdx === 0) {
          firstAuthorPapers++;
        } else {
          coAuthorPapers++;
        }
      }
    }

    if (unknownAuthorPapers > 0) {
      firstAuthorPapers += unknownAuthorPapers;
      warnings.push(
        `${unknownAuthorPapers} of ${paperPutCodes.length} paper(s): couldn't identify your position — counted as first-author. Adjust if needed.`,
      );
    }

    if (firstAuthorPapers > 0) set('firstAuthorPapers', firstAuthorPapers);
    if (coAuthorPapers > 0) set('coAuthorPapers', coAuthorPapers);
  }

  // ── Funding ────────────────────────────────────────────────────────────────

  let grantsPI = 0, grantsCoI = 0, grantsUnknown = 0;

  for (const s of getEls(acts, NS_FUNDING, 'funding-summary')) {
    const ftype = getText(s, NS_FUNDING, 'type').toLowerCase();
    if (ftype !== 'grant') continue;

    const contributors = getEls(s, NS_FUNDING, 'contributor');
    if (contributors.length === 0) {
      grantsUnknown++;
      continue;
    }
    let isPI = false;
    for (const c of contributors) {
      const role = getText(c, NS_FUNDING, 'contributor-role').toLowerCase();
      if (/lead|principal|pi\b/i.test(role)) { isPI = true; break; }
    }
    if (isPI) grantsPI++;
    else grantsCoI++;
  }

  if (grantsUnknown > 0) {
    grantsPI += grantsUnknown;
    warnings.push(
      `${grantsUnknown} grant(s) had no role info in ORCID — counted as PI. Adjust if you were co-I on any.`,
    );
  }

  if (grantsPI > 0) set('grantsPI', grantsPI);
  if (grantsCoI > 0) set('grantsCoI', grantsCoI);

  // ── Peer reviews ───────────────────────────────────────────────────────────

  const peerReviews = getEls(acts, NS_PEER_REVIEW, 'peer-review-summary').length;
  if (peerReviews > 0) set('peerReviews', peerReviews);

  // ── Invited talks ──────────────────────────────────────────────────────────

  const invitedTalks =
    getEls(acts, NS_INVITED, 'invited-position-summary').length + invitedTalkWorks;
  if (invitedTalks > 0) set('invitedTalks', invitedTalks);

  // ── Distinctions (awards) ──────────────────────────────────────────────────

  const majorAwards = getEls(acts, NS_DISTINCTION, 'distinction-summary').length;
  if (majorAwards > 0) set('majorAwards', majorAwards);

  // ── Editorial roles from services ─────────────────────────────────────────

  let editorialRoles = 0;
  for (const s of getEls(acts, NS_SERVICE, 'service-summary')) {
    const role = getText(s, NS_COMMON, 'role-title').toLowerCase();
    if (/editor|editorial/i.test(role)) editorialRoles++;
  }
  if (editorialRoles > 0) set('editorialRoles', editorialRoles);

  return { data, filled, warnings };
}
