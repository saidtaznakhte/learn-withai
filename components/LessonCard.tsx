import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FileText, Image, Mic, ChevronRight } from 'lucide-react-native';
import { Lesson } from '../app/store/appSlice';

type LessonCardProps = {
  lesson: Lesson;
  colors: any;
  onPress: () => void;
};

export function LessonCard({ lesson, colors, onPress }: LessonCardProps) {
  const getIcon = () => {
    switch (lesson.type) {
      case 'pdf':
        return <FileText size={20} color={lesson.color} />;
      case 'image':
        return <Image size={20} color={lesson.color} />;
      case 'audio':
        return <Mic size={20} color={lesson.color} />;
      default:
        return <FileText size={20} color={lesson.color} />;
    }
  };

  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: colors.card }]} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: lesson.color + '20' }]}>
        {getIcon()}
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>{lesson.title}</Text>
        <Text style={[styles.subject, { color: lesson.color }]}>{lesson.subject}</Text>
        <Text style={[styles.summary, { color: colors.textSecondary }]} numberOfLines={2}>
          {lesson.summary}
        </Text>
        <Text style={[styles.date, { color: colors.textSecondary }]}>
          {new Date(lesson.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
        </Text>
      </View>
      <ChevronRight size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 4,
  },
  subject: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    marginBottom: 6,
  },
  summary: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    lineHeight: 18,
    marginBottom: 6,
  },
  date: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
});
