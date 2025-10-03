class GitHubService {
    constructor() {
        this.baseURL = 'https://api.github.com';
        this.token = process.env.GITHUB_API_KEY;
    }

    async searchIssues(language = 'javascript', page = 1, perPage = 10) {
        try {
            if (!this.token) {
                throw new Error('GitHub API key not configured');
            }

            const sinceDate = new Date();
            sinceDate.setDate(sinceDate.getDate() - 7);
            const formattedDate = sinceDate.toISOString().split('T')[0];

            // Build search query for hackathon-friendly issues
            const query = `label:"good first issue"+label:"help wanted"+language:${language}+created:>${formattedDate}+state:open`;

            const url = `${this.baseURL}/search/issues?q=${encodeURIComponent(query)}&sort=created&order=desc&page=${page}&per_page=${perPage}`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'GitHub-Clone-Hackathon-Finder'
                },
                timeout: 10000
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const status = response.status;
                let message = 'GitHub API error';

                switch (status) {
                    case 403:
                        message = 'GitHub API rate limit exceeded. Please try again later.';
                        break;
                    case 404:
                        message = 'GitHub resource not found';
                        break;
                    case 422:
                        message = 'GitHub validation failed';
                        break;
                    case 503:
                        message = 'GitHub service unavailable';
                        break;
                    default:
                        message = `GitHub API returned ${status}`;
                }

                if (errorData.message) {
                    message = errorData.message;
                }

                const error = new Error(message);
                error.statusCode = status;
                throw error;
            }

            const data = await response.json();

            if (!data.items) {
                throw new Error('Invalid response from GitHub API');
            }

            return this.transformIssues(data.items);

        } catch (error) {
            if (error.name === 'TimeoutError' || error.code === 'REQUEST_TIMEOUT') {
                const timeoutError = new Error('GitHub API request timeout');
                timeoutError.statusCode = 504;
                throw timeoutError;
            }

            if (!error.statusCode) {
                error.statusCode = 502;
            }
            throw error;
        }
    }

    transformIssues(issues) {
        return issues.map(issue => ({
            id: issue.id,
            title: issue.title,
            url: issue.html_url,
            repository: {
                name: issue.repository_url.split('/').pop(),
                full_name: issue.repository_full_name,
                url: issue.repository_url.replace('api.github.com/repos', 'github.com')
            },
            user: {
                login: issue.user?.login,
                avatar_url: issue.user?.avatar_url
            },
            labels: issue.labels?.map(label => ({
                name: label.name,
                color: label.color
            })),
            state: issue.state,
            created_at: issue.created_at,
            updated_at: issue.updated_at,
            comments: issue.comments,
            difficulty: this.calculateDifficulty(issue.labels || [])
        }));
    }

    calculateDifficulty(labels) {
        const labelNames = labels.map(l => l.name.toLowerCase());

        if (labelNames.includes('good first issue')) return 'Beginner';
        if (labelNames.includes('help wanted')) return 'Intermediate';
        if (labelNames.some(l => l.includes('hard') || l.includes('expert'))) return 'Advanced';

        return 'Intermediate';
    }
}

const githubService = new GitHubService();

export const findHackathons = async (req, res, next) => {
    try {
        const { language = 'javascript', page = 1, per_page = 10 } = req.query;

        // Basic validation
        const allowedLanguages = ['javascript', 'python', 'java', 'cpp', 'c', 'csharp', 'php', 'ruby', 'go', 'rust', 'typescript', 'swift', 'kotlin'];
        if (!allowedLanguages.includes(language.toLowerCase())) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid language. Supported: javascript, python, java, cpp, c, csharp, php, ruby, go, rust, typescript, swift, kotlin'
            });
        }

        const issues = await githubService.searchIssues(language, parseInt(page), parseInt(per_page));

        res.json({
            status: 'success',
            data: {
                hackathons: issues,
                pagination: {
                    page: parseInt(page),
                    per_page: parseInt(per_page),
                    has_more: issues.length === parseInt(per_page),
                    total_found: issues.length
                }
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        // Handle different error types
        const statusCode = error.statusCode || 500;
        const message = error.message || 'Internal server error';

        res.status(statusCode).json({
            status: 'error',
            message: message,
            timestamp: new Date().toISOString()
        });
    }
};

export const getHealth = async (req, res) => {
    res.json({
        status: 'healthy',
        service: 'Mini Hackathon Finder',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV
    });
};