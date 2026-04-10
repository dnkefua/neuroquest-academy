import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import GamePlayerClient from '@/app/games/[slug]/GamePlayerClient';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
}));

describe('GamePlayerClient (First 4 Games)', () => {
  const mockFetch = vi.fn();
  global.fetch = mockFetch;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const gamesToTest = [
    { slug: 'lightbot', expectedName: 'Lightbot' },
    { slug: 'memory-match', expectedName: 'Memory Match' },
    { slug: 'math-runner', expectedName: 'Math Runner' },
    { slug: 'word-search', expectedName: 'Word Search' },
  ];

  gamesToTest.forEach(({ slug, expectedName }) => {
    describe(`Game: ${expectedName}`, () => {
      it('renders loading state initially', () => {
        // Setup mock to delay so we can see loading state
        mockFetch.mockImplementation(
          () => new Promise(resolve => setTimeout(() => resolve({ ok: true }), 100))
        );

        render(<GamePlayerClient slug={slug} />);

        // Should see loading spinner and the name
        expect(screen.getByText(expectedName)).toBeInTheDocument();
        expect(screen.getByText('Loading game...')).toBeInTheDocument();
      });

      it('renders the game iframe when fetch is successful', async () => {
        // Setup successful fetch
        mockFetch.mockResolvedValueOnce({ ok: true });

        render(<GamePlayerClient slug={slug} />);

        // Wait for loading to clear and iframe to appear
        await waitFor(() => {
          const iframe = screen.getByTitle(expectedName) as HTMLIFrameElement;
          expect(iframe).toBeInTheDocument();
          expect(iframe.src).toContain(`/play/${slug}/index.html`);
        });

        // The loading text should be gone
        expect(screen.queryByText('Loading game...')).not.toBeInTheDocument();
      });

      it('renders error state when fetch fails', async () => {
        // Setup failed fetch (404 etc)
        mockFetch.mockResolvedValueOnce({ ok: false });

        render(<GamePlayerClient slug={slug} />);

        // Wait for error state
        await waitFor(() => {
          expect(screen.getByText('Game Not Found')).toBeInTheDocument();
        });
      });
    });
  });
});
