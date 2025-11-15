import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Play, Clock, Target, Trophy } from 'lucide-react-native';
import { Quiz } from '../app/store/appSlice';

type QuizCardProps = {
  quiz: Quiz;
  colors: any;
  onPress: () => void;
};

export function QuizCard({ quiz, colors, onPress }: QuizCardProps) {
  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>{quiz.title}</Text>
          <Text style={[styles.subject, { color: quiz.color }]}>{quiz.subject}</Text>
        </View>
        {quiz.score !== null && (
          <View style={[styles.scoreBadge, { backgroundColor: quiz.color + '20' }]}>
            <Trophy size={16} color={quiz.color} />
            <Text style={[styles.scoreText, { color: quiz.color }]}>{quiz.score}%</Text>
          </View>
        )}
      </View>
      <View style={styles.metadata}>
        <View style={styles.metaItem}>
          <Target size={16} color={colors.textSecondary} />
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>
            {quiz.questions.length} questions
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Clock size={16} color={colors.textSecondary} />
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>
            {quiz.duration}
          </Text>
        </View>
        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(quiz.difficulty) + '20' }]}>
          <Text style={[styles.difficultyText, { color: getDifficultyColor(quiz.difficulty) }]}>
            {quiz.difficulty}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={[styles.playButton, { backgroundColor: quiz.color }]} onPress={onPress}>
        <Play size={18} color="#FFFFFF" />
        <Text style={styles.playButtonText}>
          {quiz.score !== null ? 'Refaire' : 'Commencer'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'Facile':
      return '#10B981';
    case 'Moyen':
      return '#F59E0B';
    case 'Difficile':
      return '#EF4444';
    default:
      return '#6B7280';
  }
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 12,
    borderBottomWidth: 1,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 4,
  },
  subject: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scoreText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  metadata: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 4,
  },
  playButtonText: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
  },
});
