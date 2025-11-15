import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { Brain, Trophy, Target, Play } from 'lucide-react-native';
import { QuizCard } from '../../components/QuizCard';
import { useSelector } from 'react-redux';
import { selectAllQuizzes, selectAllFlashcardSets } from '../store/appSlice';
import { useRouter } from 'expo-router';

export default function QuizScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const quizzes = useSelector(selectAllQuizzes);
  const flashcardSets = useSelector(selectAllFlashcardSets);
  
  const totalQuizzes = quizzes.length;
  const averageScore = Math.round(quizzes.filter(q => q.score !== null).reduce((sum, q) => sum + (q.score || 0), 0) / (quizzes.filter(q => q.score !== null).length || 1));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Quiz & Flashcards</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={[styles.statBox, { backgroundColor: colors.card }]}>
            <Brain size={24} color="#3B82F6" />
            <Text style={[styles.statValue, { color: colors.text }]}>{totalQuizzes}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Quiz créés</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: colors.card }]}>
            <Trophy size={24} color="#F59E0B" />
            <Text style={[styles.statValue, { color: colors.text }]}>{averageScore}%</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Taux moyen</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: colors.card }]}>
            <Target size={24} color="#8B5CF6" />
            <Text style={[styles.statValue, { color: colors.text }]}>{flashcardSets.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Sets Flashcards</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quiz disponibles</Text>
          {quizzes.map((quiz) => (
            <QuizCard 
              key={quiz.id} 
              quiz={quiz} 
              colors={colors} 
              onPress={() => router.push(`/quiz/${quiz.id}`)}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Mes flashcards</Text>
          {flashcardSets.map((set) => (
            <TouchableOpacity
              key={set.id}
              style={[styles.flashcardSet, { backgroundColor: colors.card }]}
              onPress={() => router.push(`/flashcards/${set.id}`)}
            >
              <View style={[styles.flashcardIcon, { backgroundColor: set.color + '20' }]}>
                <Brain size={20} color={set.color} />
              </View>
              <View style={styles.flashcardContent}>
                <Text style={[styles.flashcardTitle, { color: colors.text }]}>{set.title}</Text>
                <Text style={[styles.flashcardSubject, { color: colors.textSecondary }]}>
                  {set.cards.length} cartes • {set.subject}
                </Text>
              </View>
              <Play size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.createButton}>
          <Text style={styles.createButtonText}>+ Créer un nouveau quiz</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    borderRadius: 16,
    gap: 8,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 16,
  },
  flashcardSet: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    gap: 12,
  },
  flashcardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flashcardContent: {
    flex: 1,
  },
  flashcardTitle: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 4,
  },
  flashcardSubject: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  createButton: {
    marginHorizontal: 20,
    marginBottom: 40,
    paddingVertical: 16,
    backgroundColor: '#3B82F6',
    borderRadius: 16,
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
  },
});
