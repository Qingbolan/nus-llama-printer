/**
 * Type definitions for AuthCheck data models
 */

export interface Author {
  name: string;
  email: string | null;
  affiliation: string | null;
  displayKey: string;
  canonicalId: string | null;
  hasWarning?: boolean;
}

export interface Paper {
  paperId: string;
  title: string;
  authors: Author[];
  submissionDate: string | null;
  status: string | null;
}

export interface AuthorStatistics {
  author: Author;
  submissionCount: number;
  exceedsLimit: boolean;
  submissions: Paper[];
  paperIds: string[];
}

export interface DuplicateGroup {
  authors: Author[];
  count: number;
}

export interface UploadResponse {
  success: boolean;
  totalSubmissions: number;
  totalAuthors: number;
  violations: number;
}

export interface PapersResponse {
  papers: Paper[];
  total: number;
}

export interface AuthorsResponse {
  authors: AuthorStatistics[];
  total: number;
}

export interface PotentialDuplicatesResponse {
  groups: DuplicateGroup[];
  total: number;
}

export interface StatisticsResponse {
  totalSubmissions: number;
  totalAuthors: number;
  submissionLimit: number;
  violations: number;
  violatingAuthors: AuthorStatistics[];
}

export interface MergeAuthorsRequest {
  authorKeys: string[];
  canonicalAuthor: {
    name: string;
    email: string | null;
    affiliation: string | null;
  };
}

export interface MergeAuthorsResponse {
  success: boolean;
  mergedCount: number;
  canonicalAuthor: Author;
}
