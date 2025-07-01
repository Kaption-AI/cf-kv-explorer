export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    if (url.pathname === '/populate') {
      // Populate test data
      await env.TEST_KV.put('account:1234', JSON.stringify({
        id: '1234',
        name: 'John Doe',
        email: 'john@example.com',
        created: '2024-01-01'
      }));
      
      await env.TEST_KV.put('account:5678', JSON.stringify({
        id: '5678',
        name: 'Jane Smith',
        email: 'jane@example.com',
        created: '2024-01-02'
      }));
      
      await env.TEST_KV.put('client:123', JSON.stringify({
        id: '123',
        company: 'Acme Corp',
        status: 'active'
      }));
      
      await env.TEST_KV.put('client:456', JSON.stringify({
        id: '456',
        company: 'Beta Inc',
        status: 'inactive'
      }));
      
      await env.TEST_KV.put('link:123:1234', JSON.stringify({
        clientId: '123',
        accountId: '1234',
        type: 'primary',
        created: '2024-01-01'
      }));
      
      await env.TEST_KV.put('link:456:5678', JSON.stringify({
        clientId: '456',
        accountId: '5678',
        type: 'secondary',
        created: '2024-01-02'
      }));
      
      await env.TEST_KV.put('config:global', JSON.stringify({
        version: '1.0.0',
        features: ['auth', 'billing', 'analytics'],
        maintenance: false
      }));
      
      return new Response('Test data populated successfully!');
    }
    
    return new Response('KV Explorer Test Worker\n\nVisit /populate to add test data');
  }
};