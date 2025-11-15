import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, Clock } from 'lucide-react-native';
import { Revision } from '../app/store/appSlice';

type UpcomingRevisionProps = {
  revision: Revision;
  colors: any;
  onPress: () => void;
};

export function UpcomingRevision({ revision, colors, onPress }: UpcomingRevisionProps) {
  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: colors.card }]} onPress={onPress}>
      <View style={[styles.indicator, { backgroundColor: revision.color }]} />
      <View style={styles.content}>
        <Text style={[styles.subject, { color: colors.text }]}>{revision.subject}</Text>
        <Text style={[styles.topic, { color: colors.textSecondary }]}>{revision.topic}</Text>
        <View style={styles.metadata}>
          <View style={styles.metaItem}>
            <Calendar size={14} color={colors.textSecondary} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>
              {new Date(revision.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Clock size={14} color={colors.textSecondary} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>
              {revision.time}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  indicator: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  subject: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 4,
  },
  topic: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    marginBottom: 8,
  },
  metadata: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
});
