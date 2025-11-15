import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSelector } from 'react-redux';
import { selectLessonById } from '../store/appSlice';
import { useTheme } from '../../contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LessonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = useSelector(selectLessonById(id));
  const { colors } = useTheme();

  if (!lesson) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Leçon non trouvée</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={[styles.title, { color: colors.text }]}>{lesson.title}</Text>
        <Text style={[styles.subject, { color: lesson.color }]}>{lesson.subject}</Text>
        <Text style={[styles.date, { color: colors.textSecondary }]}>
          {new Date(lesson.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </Text>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Text style={[styles.content, { color: colors.text }]}>
          {lesson.content || lesson.summary}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    marginBottom: 8,
  },
  subject: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    lineHeight: 24,
  },
});
