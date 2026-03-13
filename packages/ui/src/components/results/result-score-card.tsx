import { Card, CardContent } from '@repo/ui';
import { Text } from '@repo/ui';

interface Props {
  score: number;
}

export default function ResultScoreCard({ score }: Props) {
  const getScoreLabel = () => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Average Match';
    return 'Needs Improvement';
  };

  const getScoreColor = () => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Card className="w-full shadow-sm border">
      <CardContent className="flex flex-col items-center justify-center gap-3 py-12">
        <Text as="h2" size="sm" weight="semibold" className="text-muted-foreground tracking-wide">
          Overall Resume Score
        </Text>

        <h1 className={`text-7xl font-bold ${getScoreColor()}`}>{score}</h1>

        <Text size="sm" className="text-muted-foreground">
          out of 100
        </Text>

        <Text size="sm" weight="semibold" className={`${getScoreColor()} mt-2`}>
          {getScoreLabel()}
        </Text>
      </CardContent>
    </Card>
  );
}
