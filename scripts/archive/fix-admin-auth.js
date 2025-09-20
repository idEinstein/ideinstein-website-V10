// Quick Admin Auth Fix Script
// Run this in your browser console to clear invalid authentication

console.log('🔧 IdEinstein Admin Auth Fix Script');
console.log('================================');

// Check current authentication state
const currentToken = localStorage.getItem('admin_auth_token');
const currentExpiry = localStorage.getItem('admin_auth_expiry');

if (currentToken) {
    console.log('📱 Current auth token found:', currentToken.substring(0, 20) + '...');
    console.log('⏰ Current expiry:', new Date(parseInt(currentExpiry || '0')).toLocaleString());
    
    // Clear invalid authentication
    localStorage.removeItem('admin_auth_token');
    localStorage.removeItem('admin_auth_expiry');
    
    console.log('✅ Cleared invalid authentication tokens');
    console.log('🔄 Reloading page...');
    
    // Reload the page
    setTimeout(() => {
        location.reload();
    }, 1000);
    
} else {
    console.log('ℹ️ No authentication tokens found');
    console.log('📝 You should see the login form');
}

console.log('');
console.log('🔑 New Admin Password: M#RzTr^M$jz#$6Q$');
console.log('📋 After page reloads, enter this password to re-authenticate');