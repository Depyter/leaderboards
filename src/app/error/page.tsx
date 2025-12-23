"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  if (!error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>No Error Found</CardTitle>
            <CardDescription>
              If you were redirected here due to an error, please try again.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center flex gap-2">
            <Button asChild>
              <Link href={"/"}>Home</Link>
            </Button>
            <Button asChild>
              <a href="/login">Back to Login</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Decode the error message (replace underscores with spaces)
  const errorMessage = error.replace(/_/g, " ");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-destructive/10 mb-4">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle>Authentication Error</CardTitle>
          <CardDescription>{errorMessage}</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="bg-muted rounded-md p-3">
            <p className="text-sm text-muted-foreground">
              Your email address is not authorized to access this application.
              Please contact the administrator for access.
            </p>
          </div>
        </CardContent>

        <CardFooter className="justify-center flex gap-2">
          <Button asChild variant={"outline"}>
            <Link href={"/"}>Home</Link>
          </Button>
          <Button asChild>
            <a href="/login">Back to Login</a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Loading...</CardTitle>
            </CardHeader>
          </Card>
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}
