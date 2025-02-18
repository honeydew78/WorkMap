'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Project } from '@/model/Project'; 
import { Task } from '@/model/Task'; 
import axios from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { Sidebar } from '@/components/ui/sidebar';

function UserDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const { data: session } = useSession();

  // Fetch active projects
  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/get-all-projects');
      setProjects(response.data.projects || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch projects',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch active tasks
  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/tasks');
      setTasks(response.data.tasks || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch tasks',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!session || !session.user) return;
    fetchProjects();
    fetchTasks();
  }, [session]);

  return (
    <div className="flex">
      {/* Sidebar */}
      {/* <Sidebar /> */}

      {/* Main content */}
      <div className="flex-grow my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
        <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

        {/* Active Projects */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Active Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : projects.length > 0 ? (
              projects.map((project) => (
                <div key={project.id} className="p-4 border rounded">
                  <h3 className="text-lg font-semibold">{project.name}</h3>
                </div>
              ))
            ) : (
              <p>No active projects.</p>
            )}
          </div>
        </section>

        {/* Active Tasks */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Active Tasks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : tasks.length > 0 ? (
              tasks.map((task) => (
                <div key={task.id} className="p-4 border rounded">
                  <h3 className="text-lg font-semibold">{task.title}</h3>
                  <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <p>No active tasks.</p>
            )}
          </div>
        </section>

        <Separator />

        {/* Refresh Button */}
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => {
            fetchProjects();
            fetchTasks();
          }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

export default UserDashboard;
