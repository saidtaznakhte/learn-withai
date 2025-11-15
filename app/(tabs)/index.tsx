import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { Brain } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatCard } from '../../components/StatCard';
import { UpcomingRevision } from '../../components/UpcomingRevision';
import { SubjectCard } from '../../components/SubjectCard';
import { useSelector } from 'react-redux';
import { selectStats, selectSubjects, selectUpcomingRevisions } from '../store/appSlice';
import { Flame, Target, Trophy, BookOpen } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const stats = useSelector(selectStats);
  const subjects = useSelector(selectSubjects);
  const upcomingRevisions = useSelector(selectUpcomingRevisions);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>Bonjour,</Text>
            <Text style={[styles.username, { color: colors.text }]}>Étudiant 👋</Text>
          </View>
          <View style={[styles.streakBadge, { backgroundColor: colors.card }]}>
            <Flame size={20} color="#F59E0B" />
            <Text style={[styles.streakText, { color: colors.text }]}>{stats.streak} jours</Text>
          </View>
        </View>

        <LinearGradient
          colors={['#3B82F6', '#8B5CF6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.motivationCard}
        >
          <Text style={styles.motivationQuote}>
            "Le succès est la somme de petits efforts répétés jour après jour."
          </Text>
          <Text style={styles.motivationAuthor}>— Robert Collier</Text>
        </LinearGradient>

        <View style={styles.statsGrid}>
          <StatCard
            icon={<Target size={24} color="#3B82F6" />}
            label="Objectif quotidien"
            value={`${stats.dailyGoal.current}/${stats.dailyGoal.total}`}
            color="#3B82F6"
            backgroundColor={colors.card}
            textColor={colors.text}
          />
          <StatCard
            icon={<Trophy size={24} color="#F59E0B" />}
            label="Points gagnés"
            value={stats.points.toLocaleString('fr-FR')}
            color="#F59E0B"
            backgroundColor={colors.card}
            textColor={colors.text}
          />
          <StatCard
            icon={<BookOpen size={24} color="#8B5CF6" />}
            label="Leçons étudiées"
            value={stats.lessonsStudied.toString()}
            color="#8B5CF6"
            backgroundColor={colors.card}
            textColor={colors.text}
          />
          <StatCard
            icon={<Brain size={24} color="#EC4899" />}
            label="Taux de réussite"
            value={`${stats.successRate}%`}
            color="#EC4899"
            backgroundColor={colors.card}
            textColor={colors.text}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Progression par matière</Text>
          {subjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} colors={colors} onPress={() => {}} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Révisions à venir</Text>
          {upcomingRevisions.map((revision) => (
            <UpcomingRevision key={revision.id} revision={revision} colors={colors} onPress={() => {}} />
          ))}
        </View>

        <TouchableOpacity style={[styles.aiSuggestionCard, { backgroundColor: colors.card }]}>
          <View style={styles.aiSuggestionHeader}>
            <Brain size={24} color="#3B82F6" />
            <Text style={[styles.aiSuggestionTitle, { color: colors.text }]}>
              Suggestion IA
            </Text>
          </View>
          <Text style={[styles.aiSuggestionText, { color: colors.textSecondary }]}>
            Basé sur vos performances, nous recommandons de revoir les dérivées en mathématiques et de pratiquer les exercices sur l'électromagnétisme.
          </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  username: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    marginTop: 4,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  streakText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  motivationCard: {
    margin: 20,
    padding: 24,
    borderRadius: 20,
  },
  motivationQuote: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#FFFFFF',
    lineHeight: 24,
  },
  motivationAuthor: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: '#E0E7FF',
    marginTop: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    marginBottom: 16,
  },
aiSuggestionCard: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    marginBottom: 40,
  },
  aiSuggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  aiSuggestionTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  aiSuggestionText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
  },
});
