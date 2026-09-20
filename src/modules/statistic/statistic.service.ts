import { prisma } from '../../lib/prisma';

const getStatistics = async () => {
    const [
        totalUsers,
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
        prisma.user.count(),

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

        prisma.post.aggregate({
            _sum: {
                views: true
            }
        })
    ]);

    return {
        users: {
            total: totalUsers
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

export const StatisticServices = {
    getStatistics
};
