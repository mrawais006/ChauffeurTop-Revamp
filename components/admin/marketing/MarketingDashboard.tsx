'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AudienceManager } from './AudienceManager';
import { CampaignComposer } from './CampaignComposer';
import { CampaignHistory } from './CampaignHistory';
import { EmailSubscribersTable } from '@/components/admin/EmailSubscribersTable';
import { PushNotificationSetup } from '@/components/admin/PushNotificationSetup';
import { Users, Send, History, Mail, Bell } from 'lucide-react';

export function MarketingDashboard() {
  const [activeTab, setActiveTab] = useState('audiences');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Marketing Hub</h1>
        <p className="text-gray-500 mt-1">Manage audiences, campaigns, and subscriber lists</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 gap-2 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger
            value="audiences"
            className="flex items-center gap-2 py-2.5 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm font-medium"
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Audiences</span>
          </TabsTrigger>
          <TabsTrigger
            value="compose"
            className="flex items-center gap-2 py-2.5 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm font-medium"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Compose</span>
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="flex items-center gap-2 py-2.5 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm font-medium"
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">Campaigns</span>
          </TabsTrigger>
          <TabsTrigger
            value="subscribers"
            className="flex items-center gap-2 py-2.5 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm font-medium"
          >
            <Mail className="w-4 h-4" />
            <span className="hidden sm:inline">Subscribers</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2 py-2.5 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm font-medium"
          >
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Push</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="audiences" className="mt-6">
          <AudienceManager />
        </TabsContent>

        <TabsContent value="compose" className="mt-6">
          <CampaignComposer />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <CampaignHistory />
        </TabsContent>

        <TabsContent value="subscribers" className="mt-6">
          <EmailSubscribersTable />
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <PushNotificationSetup />
        </TabsContent>
      </Tabs>
    </div>
  );
}
