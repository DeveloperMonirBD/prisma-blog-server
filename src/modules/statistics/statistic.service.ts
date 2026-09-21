import { prisma } from '../../lib/prisma';

// Get Statistics Overview
const getStatisticsOverview = async () => {
    const [
        totalUsers,
        adminUsers,
        normalUsers,
        activeUsers,
        inactiveUsers,
        verifiedUsers,
        unverifiedUsers,

        totalPosts,
        publishedPosts,
        draftPosts,
        archivedPosts,
        featuredPosts,

        totalComments,
        pendingComments,
        approvedComments,
        rejectedComments,

        totalViews
    ] = await Promise.all([
        // =========================
        // User Statistics
        // =========================
        prisma.user.count(),

        prisma.user.count({
            where: {
                role: 'ADMIN'
            }
        }),

        prisma.user.count({
            where: {
                role: 'USER'
            }
        }),

        prisma.user.count({
            where: {
                status: 'ACTIVE'
            }
        }),

        prisma.user.count({
            where: {
                status: 'INACTIVE'
            }
        }),

        prisma.user.count({
            where: {
                emailVerified: true
            }
        }),

        prisma.user.count({
            where: {
                emailVerified: false
            }
        }),

        // =========================
        // Post Statistics
        // =========================
        prisma.post.count(),

        prisma.post.count({
            where: {
                status: 'PUBLISHED'
            }
        }),

        prisma.post.count({
            where: {
                status: 'DRAFT'
            }
        }),

        prisma.post.count({
            where: {
                status: 'ARCHIVED'
            }
        }),

        prisma.post.count({
            where: {
                isFeatured: true
            }
        }),

        // =========================
        // Comment Statistics
        // =========================
        prisma.comment.count(),

        prisma.comment.count({
            where: {
                status: 'PENDING'
            }
        }),

        prisma.comment.count({
            where: {
                status: 'APPROVED'
            }
        }),

        prisma.comment.count({
            where: {
                status: 'REJECTED'
            }
        }),

        // =========================
        // Total Views
        // =========================
        prisma.post.aggregate({
            _sum: {
                views: true
            }
        })
    ]);

    return {
        users: {
            total: totalUsers,
            admin: adminUsers,
            normal: normalUsers,
            active: activeUsers,
            inactive: inactiveUsers,
            verified: verifiedUsers,
            unverified: unverifiedUsers
        },

        posts: {
            total: totalPosts,
            published: publishedPosts,
            draft: draftPosts,
            archived: archivedPosts,
            featured: featuredPosts
        },

        comments: {
            total: totalComments,
            pending: pendingComments,
            approved: approvedComments,
            rejected: rejectedComments
        },

        views: {
            total: totalViews._sum.views ?? 0
        }
    };
};

// Get Statistics Growth
const getStatisticsGrowth = async () => {
    const today = new Date();

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);

    const [users, posts, comments] = await Promise.all([
        prisma.user.findMany({
            where: {
                createdAt: {
                    gte: startDate
                }
            },
            select: {
                createdAt: true
            }
        }),

        prisma.post.findMany({
            where: {
                createdAt: {
                    gte: startDate
                }
            },
            select: {
                createdAt: true
            }
        }),

        prisma.comment.findMany({
            where: {
                createdAt: {
                    gte: startDate
                }
            },
            select: {
                createdAt: true
            }
        })
    ]);

    const growth = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + index);

        const dateString = date.toISOString().split('T')[0];

        const userCount = users.filter(
            user => user.createdAt.toISOString().split('T')[0] === dateString
        ).length;

        const postCount = posts.filter(
            post => post.createdAt.toISOString().split('T')[0] === dateString
        ).length;

        const commentCount = comments.filter(
            comment => comment.createdAt.toISOString().split('T')[0] === dateString
        ).length;

        return {
            date: dateString,
            users: userCount,
            posts: postCount,
            comments: commentCount
        };
    });

    return growth;
};

// Get Top Content
const getTopContent = async () => {
    const [mostViewedPosts, mostCommentedPosts, topAuthors] = await Promise.all([
        // =========================
        // Most Viewed Posts
        // =========================
        prisma.post.findMany({
            orderBy: {
                views: 'desc'
            },
            take: 5,
            select: {
                id: true,
                title: true,
                views: true,
                status: true,
                isFeatured: true,
                author: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        }),

        // =========================
        // Most Commented Posts
        // =========================
        prisma.post.findMany({
            orderBy: {
                comments: {
                    _count: 'desc'
                }
            },
            take: 5,
            select: {
                id: true,
                title: true,
                views: true,
                author: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                _count: {
                    select: {
                        comments: true
                    }
                }
            }
        }),

        // =========================
        // Top Authors
        // =========================
        prisma.user.findMany({
            where: {
                posts: {
                    some: {}
                }
            },
            orderBy: {
                posts: {
                    _count: 'desc'
                }
            },
            take: 5,
            select: {
                id: true,
                name: true,
                image: true,
                _count: {
                    select: {
                        posts: true
                    }
                }
            }
        })
    ]);

    return {
        mostViewedPosts,
        mostCommentedPosts,
        topAuthors
    };
};

export const StatisticServices = {
    getStatisticsOverview,
    getStatisticsGrowth,
    getTopContent
};
