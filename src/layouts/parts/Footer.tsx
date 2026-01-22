import { Link } from 'react-router-dom';

/**
 * Footer component for website
 *
 * A simple, customizable footer with copyright and links.
 * This component is designed to be directly edited by the AI agent
 * to match the specific needs of each website.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-3">
            <img 
              src="https://img1.wsimg.com/isteam/ip/de4264ef-6b56-4f28-84bf-a8c6a43d8552/ChatGPT%20Image%20Jan%209%2C%202026%2C%2012_20_31%20PM%20(1).png" 
              alt="ownaccessy Logo" 
              className="h-8 w-auto object-contain"
            />
            <div className="text-sm text-muted-foreground">
              © {currentYear} ownaccessy. All rights reserved.
            </div>
          </div>

          <nav className="flex gap-6">
            <Link
              to="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
