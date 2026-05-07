// githubService.js - GitHub integration for MIKE OS
let Octokit = null;
let octokit = null;

async function initGithub() {
  if (Octokit) return true;
  const token = process.env.GITHUB_TOKEN;
  if (!token || token.length < 20 || token === 'your_github_token') return false;
  try {
    const mod = await import('@octokit/rest');
    Octokit = mod.Octokit;
    octokit = new Octokit({ auth: token, userAgent: 'MIKE-OS/1.0' });
    return true;
  } catch (error) {
    console.error('GitHub init error:', error.message);
    return false;
  }
}

async function getRepoInfo(owner = 'ankit-rv-08', repo = 'mike-os') {
  if (!await initGithub()) return { error: 'GitHub token not configured' };
  try {
    const { data } = await octokit.repos.get({ owner, repo });
    return {
      name: data.name, fullName: data.full_name, description: data.description,
      stars: data.stargazers_count, forks: data.forks_count, language: data.language,
      url: data.html_url, lastUpdated: data.updated_at
    };
  } catch (error) {
    return { error: error.message };
  }
}

async function searchRepos(query, owner = 'ankit-rv-08') {
  if (!await initGithub()) return { error: 'GitHub token not configured' };
  try {
    const { data } = await octokit.search.repos({ q: `${query} user:${owner}`, sort: 'updated', per_page: 10 });
    return { total: data.total_count, repos: data.items.map(r => ({ name: r.name, description: r.description, stars: r.stargazers_count, url: r.html_url })) };
  } catch (error) {
    return { error: error.message };
  }
}

async function getRecentCommits(owner = 'ankit-rv-08', repo = 'mike-os', count = 5) {
  if (!await initGithub()) return { error: 'GitHub token not configured' };
  try {
    const { data } = await octokit.repos.listCommits({ owner, repo, per_page: count });
    return data.map(c => ({ message: c.commit.message, author: c.commit.author.name, date: c.commit.author.date, sha: c.sha.substring(0, 7), url: c.html_url }));
  } catch (error) {
    return { error: error.message };
  }
}

async function checkRateLimit() {
  if (!await initGithub()) return null;
  try {
    const { data } = await octokit.rateLimit.get();
    return { remaining: data.resources.core.remaining, limit: data.resources.core.limit };
  } catch { return null; }
}

module.exports = { getRepoInfo, searchRepos, getRecentCommits, checkRateLimit };