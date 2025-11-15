import { View, StyleSheet } from 'react-native';

type ProgressCardProps = {
  progress: number;
  color: string;
};

export function ProgressCard({ progress, color }: ProgressCardProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.progressBar, { backgroundColor: color + '20' }]}>
        <View
          style={[
            styles.progressFill,
            { width: `${progress}%`, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});
