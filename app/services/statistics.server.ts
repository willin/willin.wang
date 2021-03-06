import { decode } from 'js-base64';
import { GithubRepo, GithubStats } from '~/types';
import { fetcher, JSONObject } from './content.server';

export type NpmStats = {
  sum: number;
  stats: [string, number][];
};

const expirationTtl = 60 * 60;
const GITHUB_ID = 'willin';
const NPM_STATS_URL =
  'https://api.github.com/repos/wshow/github-readme-npm-downloads/contents/npm.json';

export const npmStat = async (kv: KVNamespace): Promise<NpmStats> => {
  const key = '$$npm';

  const npm = await kv.get<NpmStats>(key, 'json');
  if (npm) {
    return npm;
  }
  const raw = await fetcher<{ content: string }>(NPM_STATS_URL);
  const npmStr = decode(raw.content);
  await kv.put(key, npmStr, {
    expirationTtl
  });
  return JSON.parse(npmStr) as NpmStats;
};

export const githubStat = async <T = GithubStats | GithubRepo[]>(
  kv: KVNamespace,
  key: 'repos' | 'meta'
): Promise<T> => {
  const keyPrefix = '$$github:';
  const data = await kv.get(keyPrefix + key, 'json');
  if (data) {
    return data;
  }
  const user = await fetcher(`https://api.github.com/users/${GITHUB_ID}`);
  const events = await fetcher(
    `https://api.github.com/users/${GITHUB_ID}/events`
  );
  // statistics
  const statistics = {
    size: 0,
    followers: user.followers,
    stars: 0,
    forks: 0,
    open_issues: 0,
    languages: [],
    topics: [],
    events
  };
  const repositories = await fetcher(
    `https://api.github.com/users/${GITHUB_ID}/repos?per_page=1000`
  );
  repositories.forEach((repository: JSONObject) => {
    statistics.stars += repository.stargazers_count;
    statistics.forks += repository.forks_count;
    statistics.open_issues += repository.open_issues;
    // owner only
    if (!repository.fork && repository.owner.login === 'willin') {
      statistics.size += repository.size;
      statistics.topics.push(...repository.topics);
      if (repository.language) {
        statistics.languages.push(repository.language);
      }
    }
  });
  statistics.topics = Array.from(new Set([...statistics.topics]));
  statistics.languages = Array.from(new Set([...statistics.languages]));
  await kv.put(`${keyPrefix}meta`, JSON.stringify(statistics), {
    expirationTtl
  });
  await kv.put(`${keyPrefix}repos`, JSON.stringify(repositories), {
    expirationTtl
  });
  if (key === 'repos') {
    return repositories as GithubRepo[];
  }
  return statistics as GithubStats;
};
