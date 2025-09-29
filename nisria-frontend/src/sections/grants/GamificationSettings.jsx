import React from 'react';
import { Award, CheckCircle, PlusCircle, Star, Sparkles, ShieldCheck, Zap, Target, Rocket, Crown, Users, FilePlus, Clock, CalendarCheck2, Trophy, MessageSquare, Sunrise, UserCheck, UploadCloud, TrendingUp } from 'lucide-react';
import { useTheme } from '../../context/ThemeProvider';

const Badge = ({ icon: Icon, title, description, earned, highlight, isDark }) => {
  const baseClasses = "flex flex-col items-center p-6 rounded-2xl border transition-all duration-300 transform";
  const earnedClasses = isDark
    ? "bg-yellow-900/20 border-yellow-400/30 shadow-lg shadow-yellow-500/10"
    : "bg-yellow-50 border-yellow-300 shadow-lg shadow-yellow-500/10";
  const notEarnedClasses = isDark
    ? "bg-gray-800/50 border-gray-700 opacity-60"
    : "bg-gray-100 border-gray-200 opacity-60";
  const highlightClasses = earned ? "ring-2 ring-offset-2 ring-yellow-400" : "";

  return (
    <div className={`${baseClasses} ${earned ? earnedClasses : notEarnedClasses} ${highlight ? highlightClasses : ''}`}>
      <div className={`relative mb-4`}>
        <Icon className={`w-12 h-12 ${earned ? (isDark ? 'text-yellow-300' : 'text-yellow-500') : (isDark ? 'text-gray-500' : 'text-gray-400')}`} />
        {highlight && (
          <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-yellow-400 animate-pulse" />
        )}
      </div>
      <h4 className={`font-bold text-md mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>{title}</h4>
      <p className={`text-xs text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
    </div>
  );
};

const GamificationSettings = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Mock data for demonstration. In a real app, this would come from user data.
  const userStats = {
    accountAgeDays: 15,
    tasksCreated: 8,
    tasksCompleted: 22,
    tasksAssignedToUser: 15,
    grantsCreated: 2,
    grantsWon: 1,
    commentsMade: 25,
    profileCompletion: 100,
    documentsUploaded: 12,
  };

  const badges = [
    {
      id: 'newcomer',
      icon: Award,
      title: 'Newcomer',
      description: 'Awarded for creating an account within the last 30 days.',
      earned: userStats.accountAgeDays <= 30,
      highlight: false,
    },
    {
      id: 'initiator',
      icon: Zap,
      title: 'Initiator',
      description: 'Create your very first task.',
      earned: userStats.tasksCreated >= 1,
      highlight: false,
    },
    {
      id: 'task-creator-bronze',
      icon: PlusCircle,
      title: 'Task Creator',
      description: 'Create 5 or more tasks.',
      earned: userStats.tasksCreated >= 5,
      highlight: true, // Example of a highlighted badge
    },
    {
      id: 'task-completer',
      icon: CheckCircle,
      title: 'Task Completer',
      description: 'Complete 20 or more tasks to prove your diligence.',
      earned: userStats.tasksCompleted >= 20,
      highlight: false,
    },
    {
      id: 'master-delegator',
      icon: ShieldCheck,
      title: 'Master Delegator',
      description: 'Assign tasks to 10 different team members.',
      earned: false, // Not earned yet
      highlight: false,
    },
    {
      id: 'task-master',
      icon: Target,
      title: 'Task Master',
      description: 'Complete 50 tasks. A true sign of productivity!',
      earned: userStats.tasksCompleted >= 50,
      highlight: false,
    },
    {
      id: 'task-legend',
      icon: Crown,
      title: 'Task Legend',
      description: 'Complete 100 tasks. Your dedication is legendary.',
      earned: userStats.tasksCompleted >= 100,
      highlight: false,
    },
    {
      id: 'architect',
      icon: Rocket,
      title: 'Architect',
      description: 'Create 50 or more tasks, shaping the team\'s work.',
      earned: userStats.tasksCreated >= 50,
      highlight: false,
    },
    {
      id: 'team-player',
      icon: Users,
      title: 'Team Player',
      description: 'Be assigned to and participate in 10 tasks.',
      earned: userStats.tasksAssignedToUser >= 10,
      highlight: false,
    },
    {
      id: 'grant-writer',
      icon: FilePlus,
      title: 'Grant Writer',
      description: 'Create your first grant application.',
      earned: userStats.grantsCreated >= 1,
      highlight: false,
    },
    {
      id: 'on-time',
      icon: CalendarCheck2,
      title: 'Punctual',
      description: 'Complete 10 tasks before their due date.',
      earned: false, // Needs backend logic
      highlight: false,
    },
    {
      id: 'night-owl',
      icon: Clock,
      title: 'Night Owl',
      description: 'Complete a task between 10 PM and 6 AM.',
      earned: false, // Needs backend logic
      highlight: false,
    },
    {
      id: 'grant-winner',
      icon: Trophy,
      title: 'Grant Winner',
      description: 'Successfully secure a grant for the organization.',
      earned: userStats.grantsWon >= 1,
      highlight: false,
    },
    {
      id: 'communicator',
      icon: MessageSquare,
      title: 'Communicator',
      description: 'Leave more than 20 comments on tasks or grants.',
      earned: userStats.commentsMade > 20,
      highlight: false,
    },
    {
      id: 'early-bird',
      icon: Sunrise,
      title: 'Early Bird',
      description: 'Complete a task before 8 AM.',
      earned: false, // Needs backend logic
      highlight: false,
    },
    {
      id: 'profile-perfect',
      icon: UserCheck,
      title: 'Profile Perfect',
      description: 'Complete 100% of your user profile.',
      earned: userStats.profileCompletion === 100,
      highlight: false,
    },
    {
      id: 'documentarian',
      icon: UploadCloud,
      title: 'Documentarian',
      description: 'Upload 10 or more documents.',
      earned: userStats.documentsUploaded >= 10,
      highlight: false,
    },
    {
      id: 'streak-starter',
      icon: TrendingUp,
      title: 'Streak Starter',
      description: 'Log in for 7 consecutive days.',
      earned: false, // Needs backend logic
      highlight: false,
    },
  ];

  const badgeOfTheMonth = {
    icon: Star,
    title: 'Badge of the Month: Diligent Achiever',
    description: 'This month, we celebrate users who have completed the most tasks. Keep up the great work!',
  };

  return (
    <div className={`p-6 md:p-8 rounded-2xl shadow-lg border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'} backdrop-blur-sm`}>
      <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Gamification & Badges</h3>
      <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        Earn badges by contributing and staying active. Here's your current progress.
      </p>

      {/* Badge of the Month */}
      <div className={`relative p-6 mb-8 rounded-2xl border-2 overflow-hidden ${isDark ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-500/50' : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200'}`}>
        <div className="flex items-center">
          <div className={`p-3 rounded-full mr-4 ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
            <badgeOfTheMonth.icon className={`w-8 h-8 ${isDark ? 'text-blue-300' : 'text-blue-600'}`} />
          </div>
          <div>
            <h4 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>{badgeOfTheMonth.title}</h4>
            <p className={`text-sm mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{badgeOfTheMonth.description}</p>
          </div>
        </div>
        <Sparkles className="absolute -top-4 -right-4 w-16 h-16 text-yellow-400/30" />
        <Sparkles className="absolute bottom-2 left-4 w-8 h-8 text-purple-400/20" />
      </div>

      {/* User's Badges */}
      <h4 className={`text-lg font-semibold mb-4 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Your Badge Collection</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {badges.map((badge) => (
          <Badge
            key={badge.id}
            icon={badge.icon}
            title={badge.title}
            description={badge.description}
            earned={badge.earned}
            highlight={badge.highlight}
            isDark={isDark}
          />
        ))}
      </div>

      {/* User Stats Section */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h4 className={`text-lg font-semibold mb-4 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Your Stats</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{userStats.tasksCreated}</p>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Tasks Created</p>
          </div>
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{userStats.tasksCompleted}</p>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Tasks Completed</p>
          </div>
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{userStats.grantsCreated}</p>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Grants Created</p>
          </div>
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{30 - userStats.accountAgeDays}</p>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Days Until Newcomer Badge Expires</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamificationSettings;