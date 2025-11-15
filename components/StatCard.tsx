import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width - 64) / 2;

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  backgroundColor: string;
  textColor: string;
};

export function StatCard({ icon, label, value, color, backgroundColor, textColor }: StatCardProps) {
  return (
    <View style={[styles.card, { backgroundColor, width: cardWidth }]}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        {icon}
      </View>
      <Text style={[styles.value, { color: textColor }]}>{value}</Text>
      <Text style={[styles.label, { color: textColor + 'CC' }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  value: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
});
