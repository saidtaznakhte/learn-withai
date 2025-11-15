import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { ProgressCard } from './ProgressCard';
import { Subject } from '../app/store/appSlice';

type SubjectCardProps = {
  subject: Subject;
  colors: any;
  onPress: () => void;
};

export function SubjectCard({ subject, colors, onPress }: SubjectCardProps) {
  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: colors.card }]} onPress={onPress}>
      <View style={styles.content}>
        <View style={[styles.colorIndicator, { backgroundColor: subject.color }]} />
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text }]}>{subject.name}</Text>
          <Text style={[styles.revision, { color: colors.textSecondary }]}>
            Prochaine révision: {new Date(subject.nextRevision).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
          </Text>
          <ProgressCard progress={subject.progress} color={subject.color} />
        </View>
        <View style={styles.rightSection}>
          <Text style={[styles.percentage, { color: colors.text }]}>
            {subject.progress}%
          </Text>
          <ChevronRight size={20} color={colors.textSecondary} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  colorIndicator: {
    width: 4,
    height: 60,
    borderRadius: 2,
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 4,
  },
  revision: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    marginBottom: 8,
  },
  rightSection: {
    alignItems: 'flex-end',
    gap: 4,
  },
  percentage: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
});
