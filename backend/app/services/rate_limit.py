import threading
import time
from collections import defaultdict, deque
from typing import Deque


class InMemoryRateLimiter:
    """Simple sliding-window limiter keyed by IP. Thread-safe."""

    def __init__(self) -> None:
        self._hits: dict[str, Deque[float]] = defaultdict(deque)
        self._lock = threading.Lock()

    def allow(self, key: str, limit: int, window_seconds: int) -> bool:
        now = time.monotonic()
        cutoff = now - window_seconds
        with self._lock:
            hits = self._hits[key]
            while hits and hits[0] < cutoff:
                hits.popleft()
            if len(hits) >= limit:
                return False
            hits.append(now)
            return True


contact_limiter = InMemoryRateLimiter()
