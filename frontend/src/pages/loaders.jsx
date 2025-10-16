import React, { useEffect, useRef, useState } from "react";
import Loader, {
  ButtonLoader,
  CardSkeleton,
  PageLoader,
  ProgressLoader,
} from "../components/loader";

const Section = ({ title, children, description }) => (
  <section className="bg-neutral-10 rounded-xl p-6 shadow-sm border border-neutral-20">
    <div className="mb-4">
      <h2 className="text-xl font-semibold text-neutral-90">{title}</h2>
      {description ? (
        <p className="text-sm text-neutral-70 mt-1">{description}</p>
      ) : null}
    </div>
    {children}
  </section>
);

export default function LoadersShowcase() {
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [showPageLoader, setShowPageLoader] = useState(false);

  const [progress, setProgress] = useState(0);
  const [progressRunning, setProgressRunning] = useState(false);
  const progressTimerRef = useRef(null);

  const startProgress = () => {
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    setProgress(0);
    setProgressRunning(true);
    progressTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(100, prev + 5 + Math.random() * 10);
        if (next >= 100) {
          clearInterval(progressTimerRef.current);
          progressTimerRef.current = null;
          setProgressRunning(false);
        }
        return next;
      });
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, []);

  return (
    <div className="p-6 md:p-10 space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-90">
          Loaders Showcase
        </h1>
        <p className="text-neutral-70">
          A quick demo page for all loading components and variants.
        </p>
      </header>

      {/* Core Loader variants */}
      <Section
        title="Core Loader Variants"
        description="Orbit, Pulse, Helix, and Morphing variants with default (md) size."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DemoCard title="Orbit">
            <Loader variant="orbit" color="primary" text="Orbit loader" />
          </DemoCard>
          <DemoCard title="Pulse">
            <Loader variant="pulse" color="secondary" text="Pulse loader" />
          </DemoCard>
          <DemoCard title="Helix">
            <Loader variant="helix" color="orange" text="Helix loader" />
          </DemoCard>
          <DemoCard title="Morphing">
            <Loader variant="morphing" color="neutral" text="Morphing loader" />
          </DemoCard>
        </div>
      </Section>

      {/* Sizes and colors */}
      <Section
        title="Sizes and Colors"
        description="All sizes (sm, md, lg, xl) across a few color styles."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DemoCard title="Sizes (Orbit)">
            <div className="flex flex-wrap gap-6 items-center">
              <SizePreview label="sm">
                <Loader size="sm" variant="orbit" color="primary" />
              </SizePreview>
              <SizePreview label="md">
                <Loader size="md" variant="orbit" color="primary" />
              </SizePreview>
              <SizePreview label="lg">
                <Loader size="lg" variant="orbit" color="primary" />
              </SizePreview>
              <SizePreview label="xl">
                <Loader size="xl" variant="orbit" color="primary" />
              </SizePreview>
            </div>
          </DemoCard>
          <DemoCard title="Colors (Pulse)">
            <div className="flex flex-wrap gap-6 items-center">
              <ColorPreview label="primary">
                <Loader size="md" variant="pulse" color="primary" />
              </ColorPreview>
              <ColorPreview label="secondary">
                <Loader size="md" variant="pulse" color="secondary" />
              </ColorPreview>
              <ColorPreview label="orange">
                <Loader size="md" variant="pulse" color="orange" />
              </ColorPreview>
              <ColorPreview label="neutral">
                <Loader size="md" variant="pulse" color="neutral" />
              </ColorPreview>
            </div>
          </DemoCard>
        </div>
      </Section>

      {/* Inline with text */}
      <Section
        title="Inline Loader with Text"
        description="Use the text prop to add context to the loader."
      >
        <div className="flex flex-col gap-6">
          <Loader
            variant="orbit"
            color="primary"
            text="Loading courses..."
            textColor="text-neutral-80"
          />
          <Loader variant="helix" color="orange" text="Analyzing content..." />
        </div>
      </Section>

      {/* Full-screen overlay demo */}
      <Section
        title="Full-screen Overlay"
        description="Toggle a full-screen loader overlay."
      >
        <button
          className="px-4 py-2 rounded-lg bg-primary-blue-40 text-white hover:opacity-90 transition"
          onClick={() => setShowFullScreen(true)}
        >
          Show Full-screen Loader
        </button>
        {showFullScreen && (
          <Loader
            fullScreen
            variant="orbit"
            color="primary"
            text="Fetching data..."
          />
        )}
      </Section>

      {/* Button loaders */}
      <Section
        title="Button Loaders"
        description="Inline loaders designed for buttons."
      >
        <div className="flex flex-wrap gap-6">
          <ButtonDemo label="Dots">
            <ButtonLoader variant="dots" size="md" color="text-white" />
          </ButtonDemo>
          <ButtonDemo label="Wave">
            <ButtonLoader variant="wave" size="md" color="text-white" />
          </ButtonDemo>
          <ButtonDemo label="Spinner">
            <ButtonLoader variant="spinner" size="md" color="text-white" />
          </ButtonDemo>
        </div>
      </Section>

      {/* Card skeleton */}
      <Section
        title="Card Skeleton"
        description="A skeleton placeholder with shimmer effect."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </Section>

      {/* Page loader overlay */}
      <Section
        title="Page Loader"
        description="Full-page themed loader overlay."
      >
        <button
          className="px-4 py-2 rounded-lg bg-primary-blue-40 text-white hover:opacity-90 transition"
          onClick={() => setShowPageLoader(true)}
        >
          Show Page Loader
        </button>
        {showPageLoader && <PageLoader text="Preparing your experience..." />}
        {showPageLoader && (
          <div className="fixed inset-x-0 bottom-6 flex justify-center z-[60]">
            <button
              className="px-4 py-2 rounded-lg bg-neutral-90 text-white shadow"
              onClick={() => setShowPageLoader(false)}
            >
              Close Page Loader
            </button>
          </div>
        )}
      </Section>

      {/* Progress loader */}
      <Section
        title="Progress Loader"
        description="Animated progress bar with glow and shine."
      >
        <div className="max-w-xl">
          <ProgressLoader progress={progress} />
          <div className="mt-4 flex gap-3">
            <button
              className="px-4 py-2 rounded-lg bg-primary-blue-40 text-white hover:opacity-90 transition disabled:opacity-50"
              onClick={startProgress}
              disabled={progressRunning}
            >
              {progressRunning ? "Running..." : "Start Progress"}
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-neutral-30 text-neutral-90 hover:opacity-90 transition"
              onClick={() => {
                if (progressTimerRef.current)
                  clearInterval(progressTimerRef.current);
                progressTimerRef.current = null;
                setProgressRunning(false);
                setProgress(0);
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </Section>
    </div>
  );
}

function DemoCard({ title, children }) {
  return (
    <div className="rounded-lg border border-neutral-20 p-4 bg-white/50 dark:bg-neutral-5/50">
      <p className="text-sm font-medium text-neutral-80 mb-4">{title}</p>
      <div className="min-h-[100px] flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

function SizePreview({ label, children }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {children}
      <span className="text-xs text-neutral-70">{label}</span>
    </div>
  );
}

function ColorPreview({ label, children }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {children}
      <span className="text-xs text-neutral-70">{label}</span>
    </div>
  );
}

function ButtonDemo({ label, children }) {
  return (
    <div className="flex flex-col gap-2 items-start">
      <span className="text-sm text-neutral-70">{label}</span>
      <button
        type="button"
        disabled
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-90 text-white opacity-90"
      >
        Saving
        {children}
      </button>
    </div>
  );
}
