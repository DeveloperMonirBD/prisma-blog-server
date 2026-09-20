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

// Statistics Growth
const getStatisticsGrowth = async () => {};

// Top Content
const getTopContent = async () => {};

export const StatisticServices = {
    getStatisticsOverview,
    getStatisticsGrowth,
    getTopContent
};
