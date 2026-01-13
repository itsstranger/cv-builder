
"use client";

import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, FileText, Trash2, Edit, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
// import type { CvData } from '@/lib/types'; // Mapped from ICV now
import { useCV } from '@/hooks/useCV';
import { createCV } from '@/lib/api';
import { initialCvData } from '@/lib/initial-data';
import { mapCVToData } from '@/lib/utils';
import Preview from '@/components/preview';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { ICV } from '@/models/CV';

const DashboardPage: FC = () => {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { cvs, fetchAllCVs, deleteExistingCV, loading: cvsLoading } = useCV();
  const [isClient, setIsClient] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    setIsClient(true);
    if (user) {
      fetchAllCVs();
    }
  }, [user, fetchAllCVs]);

  const handleCreateNewCv = async () => {
    // Construct initial ICV data based on initialCvData but adapted for DB
    const newCvData: Partial<ICV> = {
      personalInfo: {
        fullName: 'Your Name',
        email: user?.email || '',
        phone: '',
        jobTitle: 'Job Title',
        avatarUrl: 'https://picsum.photos/seed/avatar/200/200'
      },
      template: 'modern',
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certificates: []
    };

    try {
      const result = await createCV(newCvData);
      if (result.success && result.data) {
        router.push(`/editor/${result.data._id}`);
      } else {
        console.error('Failed to create CV:', result.error);
      }
    } catch (error) {
      console.error('Error creating CV:', error);
    }
  };

  const deleteCv = async (idToDelete: string) => {
    await deleteExistingCV(idToDelete);
  };

  if (!isClient || authLoading || !user) {
    return (
      <div className="min-h-screen w-full bg-background p-4 md:p-6">
        <header className="container mx-auto flex items-center justify-between pb-8">
          <div className="flex items-center gap-3">
            <FileText className="text-primary size-7" />
            <h1 className="text-2xl md:text-3xl font-headline text-foreground">
              Curriculum Vitae Canvas
            </h1>
          </div>
          <Skeleton className="h-10 w-40 rounded-full" />
        </header>
        <main className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <Skeleton className="h-96 w-full rounded-lg" />
            <Skeleton className="h-96 w-full rounded-lg" />
          </div>
        </main>
      </div>
    );
  }

  // Map DB CVs to Frontend CvData
  const displayedCvs = cvs.map(cv => mapCVToData(cv));

  return (
    <div className="min-h-screen w-full bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-accent/20 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

      <header className="p-4 md:p-6 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="text-primary size-7" />
            <h1 className="text-2xl md:text-3xl font-headline text-foreground">
              Curriculum Vitae Canvas
            </h1>
          </div>
          <Button onClick={handleCreateNewCv} disabled={cvsLoading} className="rounded-full">
            <PlusCircle />
            {cvsLoading ? 'Loading...' : 'Create New CV'}
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6">
        {cvsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <Skeleton className="h-96 w-full rounded-lg" />
            <Skeleton className="h-96 w-full rounded-lg" />
          </div>
        ) : displayedCvs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedCvs.map(cv => (
              <Card key={cv.id} className="flex flex-col group overflow-hidden">
                <CardHeader>
                  <CardTitle className="truncate">{cv.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow relative h-64 bg-background overflow-hidden border-t border-b">
                  <div className="absolute inset-0 transform scale-[0.2] -translate-y-24 origin-top">
                    <Preview cvData={cv} />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 p-2 bg-card/50">
                  <Button variant="ghost" size="icon" onClick={() => router.push(`/preview/${cv.id}`)}>
                    <Eye className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => router.push(`/editor/${cv.id}`)}>
                    <Edit className="size-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="size-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your CV.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteCv(cv.id!)}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">You don't have any CVs yet.</p>
            <Button onClick={handleCreateNewCv}>
              <PlusCircle />
              Create Your First CV
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

export default DashboardPage;
