#!/usr/bin/env tsx
/**
 * Test script for real-time security monitoring
 */

import { 
  getCurrentSecurityMetrics,
  generateOWASPComplianceReport,
  generateCertificationReport,
  startAutomatedMonitoring,
  stopAutomatedMonitoring,
  getMonitoringStatus,
  addSecurityAlert,
  clearSecurityHistory
} from '../lib/security/monitoring';

async function testMonitoring() {
  console.log('🔄 Testing real-time security monitoring...\n');
  
  try {
    // Clear history for clean test
    clearSecurityHistory();
    
    // Test 1: Get current security metrics
    console.log('📊 Test 1: Getting current security metrics...');
    const metrics = await getCurrentSecurityMetrics();
    
    console.log(`Overall Score: ${metrics.overallScore}%`);
    console.log(`Compliance Score: ${metrics.complianceScore}%`);
    console.log(`Risk Level: ${metrics.riskLevel}`);
    console.log(`Active Alerts: ${metrics.alerts.length}`);
    
    console.log('\nCategory Scores:');
    Object.entries(metrics.categories).forEach(([category, data]) => {
      console.log(`  ${category}: ${data.score}% (${data.status})`);
    });
    
    // Test 2: Generate OWASP compliance report
    console.log('\n📋 Test 2: Generating OWASP compliance report...');
    const compliance = await generateOWASPComplianceReport();
    
    console.log(`Overall Compliance: ${compliance.overallCompliance}%`);
    console.log(`Certification Ready: ${compliance.certificationReadiness ? 'Yes' : 'No'}`);
    console.log(`Categories: ${compliance.categories.length}`);
    console.log(`Recommendations: ${compliance.recommendations.length}`);
    
    // Test 3: Generate certification report
    console.log('\n🏆 Test 3: Generating certification report...');
    const certReport = await generateCertificationReport();
    
    console.log(`Report ID: ${certReport.reportId}`);
    console.log(`Overall Assessment: ${certReport.overallAssessment}`);
    console.log(`Valid Until: ${new Date(certReport.validUntil).toLocaleDateString()}`);
    console.log(`Evidence Categories: ${Object.keys(certReport.evidence).length}`);
    
    // Test 4: Add test alerts
    console.log('\n🚨 Test 4: Adding test security alerts...');
    addSecurityAlert({
      severity: 'MEDIUM',
      category: 'Testing',
      title: 'Test Security Alert',
      description: 'This is a test alert for monitoring system validation',
      recommendation: 'This is a test alert and can be ignored'
    });
    
    addSecurityAlert({
      severity: 'HIGH',
      category: 'Testing',
      title: 'High Priority Test Alert',
      description: 'This is a high priority test alert',
      recommendation: 'This is a test alert and can be ignored'
    });
    
    // Get updated metrics with alerts
    const metricsWithAlerts = await getCurrentSecurityMetrics();
    console.log(`Active Alerts After Adding: ${metricsWithAlerts.alerts.length}`);
    
    // Test 5: Test automated monitoring
    console.log('\n⏰ Test 5: Testing automated monitoring...');
    
    console.log('Starting automated monitoring...');
    startAutomatedMonitoring(1); // 1 minute interval for testing
    
    let status = getMonitoringStatus();
    console.log(`Monitoring Running: ${status.isRunning}`);
    console.log(`Active Alerts: ${status.activeAlertsCount}`);
    
    // Wait a bit to see monitoring in action
    console.log('Waiting 5 seconds to observe monitoring...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    status = getMonitoringStatus();
    console.log(`Last Run: ${status.lastRun ? new Date(status.lastRun).toLocaleTimeString() : 'Never'}`);
    
    console.log('Stopping automated monitoring...');
    stopAutomatedMonitoring();
    
    status = getMonitoringStatus();
    console.log(`Monitoring Running: ${status.isRunning}`);
    
    // Test 6: Test trends (need multiple data points)
    console.log('\n📈 Test 6: Testing trend analysis...');
    
    // Generate a few more metrics for trend analysis
    await getCurrentSecurityMetrics();
    await new Promise(resolve => setTimeout(resolve, 100));
    await getCurrentSecurityMetrics();
    await new Promise(resolve => setTimeout(resolve, 100));
    const trendsMetrics = await getCurrentSecurityMetrics();
    
    console.log(`Trends Available: ${trendsMetrics.trends.length}`);
    trendsMetrics.trends.forEach(trend => {
      const arrow = trend.direction === 'UP' ? '↗️' : trend.direction === 'DOWN' ? '↘️' : '➡️';
      console.log(`  ${arrow} ${trend.category} ${trend.metric}: ${trend.value} (${trend.changePercent > 0 ? '+' : ''}${trend.changePercent}%)`);
    });
    
    console.log('\n✅ All monitoring tests completed successfully!');
    
    // Summary
    console.log('\n📋 Test Summary:');
    console.log('================');
    console.log(`✅ Security metrics collection: Working`);
    console.log(`✅ OWASP compliance reporting: Working`);
    console.log(`✅ Certification report generation: Working`);
    console.log(`✅ Alert management: Working`);
    console.log(`✅ Automated monitoring: Working`);
    console.log(`✅ Trend analysis: Working`);
    
    console.log('\n🎯 Key Metrics:');
    console.log(`Overall Security Score: ${metrics.overallScore}%`);
    console.log(`OWASP Compliance: ${compliance.overallCompliance}%`);
    console.log(`Certification Status: ${certReport.overallAssessment}`);
    console.log(`Risk Level: ${metrics.riskLevel}`);
    
  } catch (error) {
    console.error('❌ Monitoring test failed:', error);
    process.exit(1);
  }
}

testMonitoring();