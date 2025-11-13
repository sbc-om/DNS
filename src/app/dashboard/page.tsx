'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/session');
      
      if (!response.ok) {
        router.push('/login');
        return;
      }

      const data = await response.json();
      setUser(data.user);
      setLoading(false);
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/login');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Dashboard
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Welcome back, {user.name}
              </p>
            </div>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* User Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>Account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</p>
                <p className="text-base font-semibold">{user.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-base font-semibold">{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Mobile</p>
                <p className="text-base font-semibold">{user.mobile}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</p>
                <p className="text-base font-semibold capitalize">{user.role}</p>
              </div>
            </CardContent>
          </Card>

          {/* Role-based Content */}
          {user.role === 'admin' && <AdminDashboard />}
          {user.role === 'coach' && <CoachDashboard />}
          {user.role === 'parents' && <ParentsDashboard />}
          {user.role === 'students' && <StudentsDashboard />}
        </div>
      </main>
    </div>
  );
}

function AdminDashboard() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage all users in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            As an admin, you can manage users, view reports, and configure system settings.
          </p>
          <Button className="mt-4 w-full" variant="default">
            Manage Users
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>Configure application settings</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Access system-wide configuration and settings.
          </p>
          <Button className="mt-4 w-full" variant="outline">
            View Settings
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

function CoachDashboard() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>My Students</CardTitle>
          <CardDescription>View and manage your students</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Track student progress, assign tasks, and provide feedback.
          </p>
          <Button className="mt-4 w-full" variant="default">
            View Students
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Schedules</CardTitle>
          <CardDescription>Manage your coaching schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            View upcoming sessions and manage your calendar.
          </p>
          <Button className="mt-4 w-full" variant="outline">
            View Schedule
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

function ParentsDashboard() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>My Children</CardTitle>
          <CardDescription>Track your children's progress</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            View your children's progress, assignments, and performance.
          </p>
          <Button className="mt-4 w-full" variant="default">
            View Progress
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Communication</CardTitle>
          <CardDescription>Messages from coaches</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Stay in touch with your children's coaches and teachers.
          </p>
          <Button className="mt-4 w-full" variant="outline">
            View Messages
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

function StudentsDashboard() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>My Assignments</CardTitle>
          <CardDescription>View and complete your tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Access your assignments and track your learning progress.
          </p>
          <Button className="mt-4 w-full" variant="default">
            View Assignments
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Progress</CardTitle>
          <CardDescription>Track your learning journey</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            See your achievements, grades, and improvement over time.
          </p>
          <Button className="mt-4 w-full" variant="outline">
            View Progress
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
