import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { selectQuizById } from '../store/appSlice';
import { useTheme } from '../../contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trophy, CheckCircle, XCircle } from 'lucide-react-native';

export default function QuizResultsScreen() {
  const { quizId } = useLocalSearchParams<{ quizId: string }>();
  const router = useRouter();
  const quiz = useSelector(selectQuizById(quizId));
  const { colors } = useTheme();

  if (!quiz || quiz.score === null) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Résultats non disponibles.</Text>
      </SafeAreaView>
    );
  }

  const correctAnswers = Math.round((quiz.score / 100) * quiz.questions.length);
  const incorrectAnswers = quiz.questions.length - correctAnswers;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Trophy size={80} color="#F59E0B" style={{ alignSelf: 'center' }} />
        <Text style={[styles.title, { color: colors.text }]}>Quiz Terminé !</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{quiz.title}</Text>

        <View style={[styles.scoreCircle, { borderColor: quiz.score >= 50 ? '#10B981' : '#EF4444' }]}>
          <Text style={[styles.scoreText, { color: quiz.score >= 50 ? '#10B981' : '#EF4444' }]}>{quiz.score}%</Text>
          <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>Votre Score</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.statBox, { backgroundColor: colors.card }]}>
            <CheckCircle size={24} color="#10B981" />
            <Text style={[styles.statValue, { color: colors.text }]}>{correctAnswers}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Correct</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: colors.card }]}>
            <XCircle size={24} color="#EF4444" />
            <Text style={[styles.statValue, { color: colors.text }]}>{incorrectAnswers}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Incorrect</Text>
          </View>
        </View>

        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Retourner aux quiz</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
    marginBottom: 40,
  },
  scoreCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 8,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  scoreText: {
    fontSize: 48,
    fontFamily: 'Inter_700Bold',
  },
  scoreLabel: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 40,
  },
  statBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter_600SemiBold',
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  button: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});
