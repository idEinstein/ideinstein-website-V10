/**
 * Real-time Security Monitoring API
 * Provides live security metrics, trends, and compliance reporting
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/auth/admin-auth';
import { 
  getCurrentSecurityMetrics,
  generateOWASPComplianceReport,
  getSecurityHistory,
  addSecurityAlert,
  acknowledgeAlert,
  startAutomatedMonitoring,
  stopAutomatedMonitoring,
  getMonitoringStatus,
  generateCertificationReport
} from '@/lib/security/monitoring';

export const GET = withAdminAuth(async (request: NextRequest) => {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type') || 'metrics';
    const limit = parseInt(url.searchParams.get('limit') || '24');

    switch (type) {
      case 'metrics':
        const metrics = await getCurrentSecurityMetrics();
        return NextResponse.json({
          success: true,
          data: metrics,
          timestamp: new Date().toISOString()
        });

      case 'compliance':
        const framework = url.searchParams.get('framework') || 'OWASP_2024';
        
        if (framework === 'OWASP_2024') {
          const report = await generateOWASPComplianceReport();
          return NextResponse.json({
            success: true,
            data: report,
            timestamp: new Date().toISOString()
          });
        } else {
          return NextResponse.json({
            success: false,
            error: 'Unsupported compliance framework'
          }, { status: 400 });
        }

      case 'history':
        const history = getSecurityHistory(limit);
        return NextResponse.json({
          success: true,
          data: history,
          timestamp: new Date().toISOString()
        });

      case 'trends':
        const currentMetrics = await getCurrentSecurityMetrics();
        return NextResponse.json({
          success: true,
          data: {
            trends: currentMetrics.trends,
            alerts: currentMetrics.alerts
          },
          timestamp: new Date().toISOString()
        });

      case 'status':
        const status = getMonitoringStatus();
        return NextResponse.json({
          success: true,
          data: status,
          timestamp: new Date().toISOString()
        });

      case 'certification':
        const certReport = await generateCertificationReport();
        return NextResponse.json({
          success: true,
          data: certReport,
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid monitoring type'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Security monitoring API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
});

export const POST = withAdminAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'add_alert':
        const { severity, category, title, description, recommendation } = data;
        
        if (!severity || !category || !title || !description) {
          return NextResponse.json({
            success: false,
            error: 'Missing required alert fields'
          }, { status: 400 });
        }

        addSecurityAlert({
          severity,
          category,
          title,
          description,
          recommendation: recommendation || 'Review and address this security issue'
        });

        return NextResponse.json({
          success: true,
          message: 'Security alert added successfully'
        });

      case 'acknowledge_alert':
        const { alertId } = data;
        
        if (!alertId) {
          return NextResponse.json({
            success: false,
            error: 'Alert ID is required'
          }, { status: 400 });
        }

        const acknowledged = acknowledgeAlert(alertId);
        
        if (acknowledged) {
          return NextResponse.json({
            success: true,
            message: 'Alert acknowledged successfully'
          });
        } else {
          return NextResponse.json({
            success: false,
            error: 'Alert not found'
          }, { status: 404 });
        }

      case 'start_monitoring':
        const { intervalMinutes = 15 } = data;
        startAutomatedMonitoring(intervalMinutes);
        
        return NextResponse.json({
          success: true,
          message: `Automated monitoring started (every ${intervalMinutes} minutes)`
        });

      case 'stop_monitoring':
        stopAutomatedMonitoring();
        
        return NextResponse.json({
          success: true,
          message: 'Automated monitoring stopped'
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Security monitoring POST error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
});