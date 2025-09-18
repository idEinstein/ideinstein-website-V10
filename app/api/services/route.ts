import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Services query validation schema
const servicesQuerySchema = z.object({
  category: z.string().optional(),
  active: z.string().transform(val => val === 'true').pipe(z.boolean()).optional(),
  includeFeatures: z.string().transform(val => val === 'true').pipe(z.boolean()).optional().default('true'),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional(),
  page: z.string().transform(Number).pipe(z.number().min(1)).optional().default('1')
});

export async function GET(request: NextRequest) {
  try {
    // Validate query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    
    const validationResult = servicesQuerySchema.safeParse(queryParams);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid query parameters',
          details: validationResult.error.flatten()
        },
        { status: 400 }
      );
    }
    
    const { category, active, includeFeatures, limit, page } = validationResult.data;
    // TODO: Fetch from database
    // const services = await db.services.findMany({
    //   where: { active: true },
    //   orderBy: { order: 'asc' },
    //   include: {
    //     category: true,
    //     features: true,
    //   }
    // });

    // Mock response for now - using the same data structure as the frontend
    const mockServices = [
      {
        id: '1',
        title: 'Research & Development',
        slug: 'research-development',
        description: 'Expert research and development services to transform your innovative ideas into market-ready products.',
        category: ['Engineering', 'Design'],
        features: [
          'Project Scoping: Define clear objectives, requirements, and constraints',
          'Concept Design: Generate and evaluate multiple design concepts',
          'Prototype Development: Create functional prototypes for validation',
          'Engineering Analysis: Optimize designs with advanced technical analysis',
          'Manufacturing Planning: Develop detailed production strategies'
        ],
        pricing: {
          startingPrice: 5000,
          currency: 'EUR',
          billingType: 'project'
        },
        active: true,
        order: 1,
      },
      {
        id: '2',
        title: 'CAD Modeling',
        slug: 'cad-modeling',
        description: 'Professional CAD modeling and design services offering precise 3D models and technical documentation.',
        category: ['Design', 'Engineering'],
        features: [
          'Parametric Modeling: Flexible and scalable designs for complex projects',
          'Assembly Design: Accurate 3D assemblies for seamless production',
          'Technical Documentation: Complete, manufacturing-ready engineering drawings',
          'Design Optimization: Refined designs for cost-efficiency and superior performance'
        ],
        pricing: {
          startingPrice: 2500,
          currency: 'EUR',
          billingType: 'project'
        },
        active: true,
        order: 2,
      }
      // Add more services as needed
    ];

    return NextResponse.json({
      success: true,
      data: mockServices
    });
  } catch (error) {
    console.error('Services fetch error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}