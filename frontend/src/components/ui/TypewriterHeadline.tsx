"use client";

import { useEffect, useMemo, useState } from "react";

type TypewriterHeadlineProps = {
  phrases: string[];
  className?: string;
  speed?: number;
  pauseMs?: number;
};

export function TypewriterHeadline({
  phrases,
  className,
  speed = 40,
  pauseMs = 1400,
}: TypewriterHeadlineProps) {
  const safePhrases = useMemo(
    () => (phrases.length ? phrases : ["We build digital systems"]),
    [phrases]
  );
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const activePhrase = safePhrases[phraseIndex];

    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting) {
      if (text.length < activePhrase.length) {
        timeout = setTimeout(() => setText(activePhrase.slice(0, text.length + 1)), speed);
      } else {
        timeout = setTimeout(() => setDeleting(true), pauseMs);
      }
    } else if (text.length > 0) {
      timeout = setTimeout(() => setText(activePhrase.slice(0, text.length - 1)), Math.max(18, speed / 1.5));
    } else {
      setDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % safePhrases.length);
    }

    return () => clearTimeout(timeout);
  }, [deleting, text, phraseIndex, safePhrases, speed, pauseMs]);

  return (
    <p className={className}>
      {text}
      <span className="ml-0.5 inline-block animate-pulse text-[var(--accent-cyan)]">|</span>
    </p>
  );
}
