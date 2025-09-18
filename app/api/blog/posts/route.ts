import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Blog posts query validation schema
const blogQuerySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().min(1)).optional().default('1'),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(50)).optional().default('10'),
  category: z.string().optional(),
  tag: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(['newest', 'oldest', 'popular']).optional().default('newest'),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    
    // Validate query parameters
    const validatedQuery = blogQuerySchema.parse(queryParams);
    
    // TODO: Fetch from database
    // const posts = await db.blogPosts.findMany({
    //   where: {
    //     published: true,
    //     ...(validatedQuery.category && { category: validatedQuery.category }),
    //     ...(validatedQuery.tag && { tags: { has: validatedQuery.tag } }),
    //     ...(validatedQuery.search && {
    //       OR: [
    //         { title: { contains: validatedQuery.search, mode: 'insensitive' } },
    //         { content: { contains: validatedQuery.search, mode: 'insensitive' } },
    //         { excerpt: { contains: validatedQuery.search, mode: 'insensitive' } },
    //       ]
    //     }),
    //   },
    //   orderBy: {
    //     ...(validatedQuery.sort === 'newest' && { publishedAt: 'desc' }),
    //     ...(validatedQuery.sort === 'oldest' && { publishedAt: 'asc' }),
    //     ...(validatedQuery.sort === 'popular' && { views: 'desc' }),
    //   },
    //   skip: (validatedQuery.page - 1) * validatedQuery.limit,
    //   take: validatedQuery.limit,
    //   include: {
    //     author: {
    //       select: { name: true, avatar: true }
    //     }
    //   }
    // });

    // TODO: Get total count for pagination
    // const totalCount = await db.blogPosts.count({
    //   where: {
    //     published: true,
    //     ...(validatedQuery.category && { category: validatedQuery.category }),
    //     ...(validatedQuery.tag && { tags: { has: validatedQuery.tag } }),
    //   }
    // });

    // Mock response for now
    const mockPosts = [
      {
        id: '1',
        title: 'Advanced CAD Modeling Techniques',
        slug: 'advanced-cad-modeling-techniques',
        excerpt: 'Learn professional CAD modeling techniques used in industry.',
        content: 'Full article content...',
        publishedAt: new Date().toISOString(),
        category: 'Engineering',
        tags: ['CAD', 'Modeling', 'Design'],
        author: { name: 'IdEinstein Team', avatar: '/images/team/author.jpg' },
        views: 1250,
        readTime: 8,
      }
    ];

    return NextResponse.json({
      success: true,
      data: {
        posts: mockPosts,
        pagination: {
          page: validatedQuery.page,
          limit: validatedQuery.limit,
          total: 1,
          totalPages: 1,
        }
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid query parameters',
          errors: error.errors 
        },
        { status: 400 }
      );
    }

    console.error('Blog posts fetch error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}