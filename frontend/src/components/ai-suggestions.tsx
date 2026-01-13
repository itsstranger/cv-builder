"use client";

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { BrainCircuit, Sparkles, Clipboard, Check } from 'lucide-react';
import { generateSuggestions } from '@/lib/actions';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full rounded-full">
      {pending ? (
        <>
          <Sparkles className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <BrainCircuit className="mr-2 h-4 w-4" />
          Get Suggestions
        </>
      )}
    </Button>
  );
}

export default function AiSuggestions() {
  const initialState = { suggestions: '', error: '' };
  const [state, dispatch] = useActionState(generateSuggestions, initialState);
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'AI Suggestions Error',
        description: state.error || 'Failed to generate suggestions. Please check your API configuration or try again later.',
      });
    }
  }, [state.error, toast]);

  const handleCopy = () => {
    if (state.suggestions) {
      navigator.clipboard.writeText(state.suggestions);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
          title: "Copied!",
          description: "Suggestions copied to clipboard."
      })
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-transparent border-dashed">
        <CardHeader>
          <CardTitle className="text-base">Career Path Advisor</CardTitle>
          <CardDescription className="text-xs">
            Enter a desired career path (e.g., "Frontend Developer", "Data Scientist") to get AI-powered suggestions for your CV.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={dispatch} className="space-y-4">
            <Input
              name="careerPath"
              placeholder="e.g., Frontend Developer"
              required
            />
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
      {state.error && !state.suggestions && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {state.error || 'Failed to generate suggestions. Please ensure your Google AI API key is configured in your environment variables (GOOGLE_GENAI_API_KEY).'}
          </AlertDescription>
        </Alert>
      )}
      {state.suggestions && (
        <Alert>
          <Sparkles className="h-4 w-4" />
          <AlertTitle className="flex items-center justify-between">
            AI Suggestions
            <Button variant="ghost" size="icon" onClick={handleCopy} className="h-7 w-7">
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
            </Button>
          </AlertTitle>
          <AlertDescription>
            <div className="whitespace-pre-line text-xs">{state.suggestions}</div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
