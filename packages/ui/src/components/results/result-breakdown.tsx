import { Card, CardContent } from '@repo/ui';
import { Text } from '@repo/ui';

interface Breakdown {
  skills_match: number;
  experience_relevance: number;
  education: number;
}

interface Props {
  breakdown: Breakdown;
}

export default function ResultBreakdown({ breakdown }: Props) {
  const items = [
    { label: 'Skills Match', value: breakdown.skills_match },
    { label: 'Experience Relevance', value: breakdown.experience_relevance },
    { label: 'Education', value: breakdown.education },
  ];

  return (
    <Card className="w-full border shadow-sm">
      <CardContent className="py-8 space-y-6">
        <Text as="h3" size="lg" weight="semibold">
          Score Breakdown
        </Text>

        <div className="divide-y">
          {items.map((item) => (
            <div key={item.label} className="flex items-center justify-between py-4">
              <Text size="sm" className="text-muted-foreground">
                {item.label}
              </Text>

              <Text size="sm" weight="semibold">
                {item.value}
              </Text>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
