import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { CloudflareConfig } from '@/types';

interface APIKeyInputProps {
  onConfigSubmit: (config: CloudflareConfig) => void;
  isLoading?: boolean;
}

export function APIKeyInput({ onConfigSubmit, isLoading }: APIKeyInputProps) {
  const [accountId, setAccountId] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accountId && apiToken) {
      onConfigSubmit({
        accountId,
        apiToken,
        email: email || undefined,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Cloudflare KV Explorer</CardTitle>
          <CardDescription>
            Enter your Cloudflare API credentials to access your KV namespaces
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="accountId" className="text-sm font-medium">
                Account ID *
              </label>
              <Input
                id="accountId"
                type="text"
                placeholder="Enter your Cloudflare Account ID"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="apiToken" className="text-sm font-medium">
                API Token *
              </label>
              <Input
                id="apiToken"
                type="password"
                placeholder="Enter your Cloudflare API Token"
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email (optional)
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your Cloudflare email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={!accountId || !apiToken || isLoading}
            >
              {isLoading ? 'Connecting...' : 'Connect'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}