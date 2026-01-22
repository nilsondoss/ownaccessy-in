import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, ArrowRight } from 'lucide-react';
import { useComparison } from '@/lib/comparison-context';
import { Link } from 'react-router-dom';

export default function ComparisonBar() {
  const { comparisonList, removeFromComparison, clearComparison } = useComparison();

  if (comparisonList.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 overflow-x-auto">
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="font-semibold">Compare Properties:</span>
              <Badge variant="secondary">{comparisonList.length}/3</Badge>
            </div>

            <div className="flex gap-2 flex-1 overflow-x-auto">
              {comparisonList.map((property) => (
                <div
                  key={property.id}
                  className="flex items-center gap-2 bg-muted px-3 py-2 rounded-md flex-shrink-0"
                >
                  <span className="text-sm font-medium truncate max-w-[200px]">
                    {property.title}
                  </span>
                  <button
                    onClick={() => removeFromComparison(property.id)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={clearComparison}
            >
              Clear All
            </Button>
            <Button
              size="sm"
              asChild
              disabled={comparisonList.length < 2}
            >
              <Link to="/properties/compare">
                Compare Now
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}