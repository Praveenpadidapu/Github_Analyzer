export interface ScoreFactor {
  name: string;
  value: number;
  weight: number;
  contribution: number;
  description: string;
}

export interface ScoreResult {
  totalScore: number;
  factors: ScoreFactor[];
  tier: string;
  explanation: string;
}

export function calculateAIAssistedScore(
  totalContributions: number,
  totalStars: number,
  totalRepos: number,
  followers: number
): ScoreResult {
  // Define expected baselines for a "100" score
  const BASELINE_CONTRIBUTIONS = 1000;
  const BASELINE_STARS = 100;
  const BASELINE_REPOS = 50;
  const BASELINE_FOLLOWERS = 50;

  // Calculate individual raw scores (capped at 1.0)
  const activityRaw = Math.min(totalContributions / BASELINE_CONTRIBUTIONS, 1.0);
  const impactRaw = Math.min(totalStars / BASELINE_STARS, 1.0);
  const experienceRaw = Math.min(totalRepos / BASELINE_REPOS, 1.0);
  const communityRaw = Math.min(followers / BASELINE_FOLLOWERS, 1.0);

  // Weights
  const WEIGHT_ACTIVITY = 40; // 40% of score
  const WEIGHT_IMPACT = 30; // 30% of score
  const WEIGHT_EXPERIENCE = 20; // 20% of score
  const WEIGHT_COMMUNITY = 10; // 10% of score

  const factors: ScoreFactor[] = [
    {
      name: "Activity & Consistency",
      value: totalContributions,
      weight: WEIGHT_ACTIVITY,
      contribution: Math.round(activityRaw * WEIGHT_ACTIVITY),
      description: `Measures total commits, PRs, and issues over the past year. (${totalContributions} / ${BASELINE_CONTRIBUTIONS} target)`
    },
    {
      name: "Code Impact",
      value: totalStars,
      weight: WEIGHT_IMPACT,
      contribution: Math.round(impactRaw * WEIGHT_IMPACT),
      description: `Measures stars earned across your repositories. (${totalStars} / ${BASELINE_STARS} target)`
    },
    {
      name: "Experience & Breadth",
      value: totalRepos,
      weight: WEIGHT_EXPERIENCE,
      contribution: Math.round(experienceRaw * WEIGHT_EXPERIENCE),
      description: `Measures the volume of public repositories you maintain. (${totalRepos} / ${BASELINE_REPOS} target)`
    },
    {
      name: "Community Reach",
      value: followers,
      weight: WEIGHT_COMMUNITY,
      contribution: Math.round(communityRaw * WEIGHT_COMMUNITY),
      description: `Measures the number of developers following your work. (${followers} / ${BASELINE_FOLLOWERS} target)`
    }
  ];

  const totalScore = factors.reduce((sum, factor) => sum + factor.contribution, 0);

  let tier = "Top 50%";
  if (totalScore >= 90) tier = "Top 1%";
  else if (totalScore >= 75) tier = "Top 5%";
  else if (totalScore >= 60) tier = "Top 10%";
  else if (totalScore >= 40) tier = "Top 25%";

  const explanation = "The AI Productivity Score is calculated using a weighted formula based on your past year's GitHub activity, the impact of your repositories (stars), your experience (repo count), and your community reach (followers). A score of 100 represents a highly active and widely impactful developer baseline.";

  return {
    totalScore,
    factors,
    tier,
    explanation
  };
}
