// githubService.js - GitHub integration for MIKE OS
const { Octokit } = require("@octokit/rest");

let octokit = null;
let rateLimitRemaining = null;

function initGithub() {
  const token = process.env.GITHUB_TOKEN;
  
  if (token && token.length > 20 && token !== 'your_github_token') {
    octokit = new Octokit({ 
      auth: token,
      userAgent: 'MIKE-OS/1.0'
    });
    return true;
  }
  return false;
}

async function checkRateLimit() {
  if (!octokit && !initGithub()) return null;
  
  try {
    const { data } = await octokit.rateLimit.get();
    rateLimitRemaining = data.resources.core.remaining;
    return {
      remaining: data.resources.core.remaining,
      limit: data.resources.core.limit,
      reset: new Date(data.resources.core.reset * 1000)
    };
  } catch {
    return null;
  }
}

async function getRepoInfo(owner = 'ankit-rv-08', repo = 'mike-os') {
  if (!octokit && !initGithub()) {
    return { error: 'GitHub token not configured' };
  }

  try {
    const { data } = await octokit.repos.get({ owner, repo });
    
    return {
      name: data.name,
      fullName: data.full_name,
      description: data.description,
      stars: data.stargazers_count,
      forks: data.forks_count,
      openIssues: data.open_issues_count,
      language: data.language,
      topics: data.topics,
      lastUpdated: data.updated_at,
      createdAt: data.created_at,
      url: data.html_url,
      defaultBranch: data.default_branch,
      visibility: data.visibility
    };
  } catch (error) {
    if (error.status === 404) {
      return { error: `Repository ${owner}/${repo} not found` };
    }
    return { error: `GitHub API error: ${error.message}` };
  }
}

async function searchRepos(query, owner = 'ankit-rv-08') {
  if (!octokit && !initGithub()) {
    return { error: 'GitHub token not configured' };
  }

  try {
    const { data } = await octokit.search.repos({
      q: `${query} user:${owner}`,
      sort: 'updated',
      per_page: 10
    });
    
    return {
      total: data.total_count,
      repos: data.items.map(repo => ({
        name: repo.name,
        description: repo.description,
        stars: repo.stargazers_count,
        language: repo.language,
        updated: repo.updated_at,
        url: repo.html_url
      }))
    };
  } catch (error) {
    return { error: `Search failed: ${error.message}` };
  }
}

// New: Get latest commits
async function getRecentCommits(owner = 'ankit-rv-08', repo = 'mike-os', count = 5) {
  if (!octokit && !initGithub()) {
    return { error: 'GitHub token not configured' };
  }

  try {
    const { data } = await octokit.repos.listCommits({
      owner,
      repo,
      per_page: count
    });
    
    return data.map(commit => ({
      message: commit.commit.message,
      author: commit.commit.author.name,
      date: commit.commit.author.date,
      sha: commit.sha.substring(0, 7),
      url: commit.html_url
    }));
  } catch (error) {
    return { error: `Cannot fetch commits: ${error.message}` };
  }
}

module.exports = { 
  getRepoInfo, 
  searchRepos, 
  getRecentCommits,
  checkRateLimit 
};