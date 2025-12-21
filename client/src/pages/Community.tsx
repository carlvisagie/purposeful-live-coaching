/**
 * COMMUNITY PAGE - Stupid Simple, Frictionless Design
 * 
 * Design Principles:
 * - One-tap posting (no forms, no friction)
 * - Card-based feed (scannable, not overwhelming)
 * - Big friendly buttons
 * - Mobile-first
 * - Anonymous option for sensitive shares
 */

import { useState } from "react";
import { trpc } from "../lib/trpc";
import { 
  Trophy, 
  Heart, 
  HelpCircle, 
  TrendingUp, 
  Send,
  MessageCircle,
  Sparkles,
  Users,
  Eye,
  EyeOff,
  Loader2,
  RefreshCw
} from "lucide-react";

// Post type configurations
const POST_TYPES = {
  win: {
    icon: Trophy,
    label: "Share a Win",
    emoji: "🎉",
    color: "bg-gradient-to-r from-yellow-400 to-orange-500",
    placeholder: "What are you celebrating today?",
    description: "Celebrate your victories, big or small!",
  },
  support: {
    icon: Heart,
    label: "Need Support",
    emoji: "💙",
    color: "bg-gradient-to-r from-blue-400 to-purple-500",
    placeholder: "What's on your mind?",
    description: "We're here for you. Share what you're going through.",
  },
  question: {
    icon: HelpCircle,
    label: "Ask a Question",
    emoji: "❓",
    color: "bg-gradient-to-r from-green-400 to-teal-500",
    placeholder: "What would you like to know?",
    description: "No question is too small. We're all learning together.",
  },
  progress: {
    icon: TrendingUp,
    label: "Share Progress",
    emoji: "📈",
    color: "bg-gradient-to-r from-purple-400 to-pink-500",
    placeholder: "What progress have you made?",
    description: "Every step forward counts!",
  },
};

type PostType = keyof typeof POST_TYPES;

export default function Community() {
  const [selectedType, setSelectedType] = useState<PostType | null>(null);
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [filter, setFilter] = useState<"all" | PostType>("all");

  // Queries
  const { data: feedData, isLoading: feedLoading, refetch: refetchFeed } = trpc.community.getFeed.useQuery({
    limit: 20,
    postType: filter,
  });

  const { data: stats } = trpc.community.getStats.useQuery();
  const { data: profile } = trpc.community.getMyProfile.useQuery();

  // Mutations
  const createPost = trpc.community.createPost.useMutation({
    onSuccess: (data) => {
      setContent("");
      setSelectedType(null);
      setIsAnonymous(false);
      refetchFeed();
      if (data.moderated) {
        // Show gentle message if moderated
        alert("Your post is being reviewed. Thanks for sharing! 💙");
      }
    },
  });

  const sendSupport = trpc.community.sendSupport.useMutation({
    onSuccess: () => refetchFeed(),
  });

  const handlePost = () => {
    if (!selectedType || !content.trim()) return;
    
    createPost.mutate({
      postType: selectedType,
      content: content.trim(),
      isAnonymous,
    });
  };

  const handleSupport = (postId: string) => {
    sendSupport.mutate({ postId });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-600" />
              <h1 className="text-xl font-bold text-gray-800">Community</h1>
            </div>
            <button 
              onClick={() => refetchFeed()}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <RefreshCw className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          {/* Quick Stats */}
          {stats && (
            <div className="mt-2 text-sm text-gray-500 flex items-center gap-4">
              <span>{stats.todayPosts} posts today</span>
              <span>•</span>
              <span>{stats.todaySupports} 💙 given</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Quick Post Buttons - One Tap to Start */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-3">What would you like to share?</p>
          <div className="grid grid-cols-2 gap-3">
            {(Object.entries(POST_TYPES) as [PostType, typeof POST_TYPES.win][]).map(([type, config]) => {
              const Icon = config.icon;
              const isSelected = selectedType === type;
              
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(isSelected ? null : type)}
                  className={`
                    p-4 rounded-xl transition-all duration-200 text-left
                    ${isSelected 
                      ? `${config.color} text-white shadow-lg scale-[1.02]` 
                      : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-sm'
                    }
                  `}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{config.emoji}</span>
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <span className={`font-medium ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                    {config.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Compose Area - Shows when type selected */}
        {selectedType && (
          <div className="bg-white rounded-xl shadow-lg p-4 mb-6 border border-gray-100 animate-in slide-in-from-top duration-200">
            <p className="text-sm text-gray-500 mb-2">
              {POST_TYPES[selectedType].description}
            </p>
            
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={POST_TYPES[selectedType].placeholder}
              className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={3}
              maxLength={2000}
              autoFocus
            />
            
            <div className="flex items-center justify-between mt-3">
              {/* Anonymous Toggle */}
              <button
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition
                  ${isAnonymous 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                {isAnonymous ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {isAnonymous ? "Posting anonymously" : "Post as me"}
              </button>
              
              {/* Post Button */}
              <button
                onClick={handlePost}
                disabled={!content.trim() || createPost.isPending}
                className={`
                  flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition
                  ${content.trim() 
                    ? `${POST_TYPES[selectedType].color} text-white hover:opacity-90` 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                {createPost.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Share
              </button>
            </div>
            
            <p className="text-xs text-gray-400 mt-2">
              {content.length}/2000 characters
            </p>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <FilterButton 
            active={filter === "all"} 
            onClick={() => setFilter("all")}
            label="All"
          />
          {(Object.entries(POST_TYPES) as [PostType, typeof POST_TYPES.win][]).map(([type, config]) => (
            <FilterButton
              key={type}
              active={filter === type}
              onClick={() => setFilter(type)}
              label={config.emoji + " " + config.label.split(" ")[0]}
            />
          ))}
        </div>

        {/* Feed */}
        <div className="space-y-4">
          {feedLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
          ) : feedData?.posts.length === 0 ? (
            <EmptyState />
          ) : (
            feedData?.posts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                onSupport={() => handleSupport(post.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Filter Button Component
function FilterButton({ 
  active, 
  onClick, 
  label 
}: { 
  active: boolean; 
  onClick: () => void; 
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition
        ${active 
          ? 'bg-purple-600 text-white' 
          : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
        }
      `}
    >
      {label}
    </button>
  );
}

// Post Card Component
function PostCard({ 
  post, 
  onSupport 
}: { 
  post: any; 
  onSupport: () => void;
}) {
  const [showComments, setShowComments] = useState(false);
  const config = POST_TYPES[post.postType as PostType] || POST_TYPES.progress;
  
  // Format time ago
  const timeAgo = getTimeAgo(new Date(post.createdAt));
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Post Type Badge */}
      <div className={`${config.color} px-4 py-2 flex items-center gap-2`}>
        <span className="text-lg">{config.emoji}</span>
        <span className="text-white text-sm font-medium">{config.label}</span>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Author */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-medium">
            {post.author.displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-800 text-sm">
              {post.author.displayName}
            </p>
            <p className="text-xs text-gray-400">{timeAgo}</p>
          </div>
          {post.isOwn && (
            <span className="ml-auto text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
              You
            </span>
          )}
        </div>
        
        {/* Post Content */}
        <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
        
        {/* Engagement */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={onSupport}
            className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition"
          >
            <Heart className="w-5 h-5" />
            <span className="text-sm">{post.supportsCount || 0}</span>
          </button>
          
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1 text-gray-500 hover:text-purple-500 transition"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">{post.commentsCount || 0}</span>
          </button>
          
          {post.postType === "support" && (
            <button className="ml-auto flex items-center gap-1 bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition">
              <Sparkles className="w-4 h-4" />
              You got this! 💙
            </button>
          )}
        </div>
      </div>
      
      {/* Comments Section (simplified) */}
      {showComments && (
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          <p className="text-sm text-gray-500">Comments coming soon...</p>
        </div>
      )}
    </div>
  );
}

// Empty State Component
function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Users className="w-8 h-8 text-purple-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-800 mb-2">
        Be the first to share!
      </h3>
      <p className="text-gray-500 max-w-sm mx-auto">
        This community is just getting started. Share a win, ask a question, or let us know how you're doing.
      </p>
    </div>
  );
}

// Helper function for time ago
function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  
  return date.toLocaleDateString();
}
