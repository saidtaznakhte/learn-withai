import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { Play, Pause, RotateCcw, Coffee, Brain, Target } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function FocusScreen() {
  const { colors } = useTheme();
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      handleSessionComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleSessionComplete = () => {
    if (mode === 'focus') {
      setSessionsCompleted((prev) => prev + 1);
      setMode('break');
      setTimeLeft(5 * 60);
    } else {
      setMode('focus');
      setTimeLeft(25 * 60);
    }
    setIsRunning(false);
  };

  const toggleTimer = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsRunning(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'focus'
    ? (25 * 60 - timeLeft) / (25 * 60)
    : (5 * 60 - timeLeft) / (5 * 60);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Mode Focus</Text>
        <View style={[styles.sessionBadge, { backgroundColor: colors.card }]}>
          <Target size={16} color="#3B82F6" />
          <Text style={[styles.sessionText, { color: colors.text }]}>
            {sessionsCompleted} sessions
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.modeSelector}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              mode === 'focus' && styles.modeButtonActive,
              { backgroundColor: mode === 'focus' ? '#3B82F6' : colors.card },
            ]}
            onPress={() => {
              setMode('focus');
              setTimeLeft(25 * 60);
              setIsRunning(false);
            }}
          >
            <Brain size={20} color={mode === 'focus' ? '#FFFFFF' : colors.text} />
            <Text style={[styles.modeButtonText, { color: mode === 'focus' ? '#FFFFFF' : colors.text }]}>
              Focus
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modeButton,
              mode === 'break' && styles.modeButtonActive,
              { backgroundColor: mode === 'break' ? '#F59E0B' : colors.card },
            ]}
            onPress={() => {
              setMode('break');
              setTimeLeft(5 * 60);
              setIsRunning(false);
            }}
          >
            <Coffee size={20} color={mode === 'break' ? '#FFFFFF' : colors.text} />
            <Text style={[styles.modeButtonText, { color: mode === 'break' ? '#FFFFFF' : colors.text }]}>
              Pause
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.timerContainer}>
          <View style={[styles.progressRing, { borderColor: colors.border }]}>
            <LinearGradient
              colors={mode === 'focus' ? ['#3B82F6', '#8B5CF6'] : ['#F59E0B', '#EC4899']}
              style={[
                styles.progressFill,
                {
                  transform: [{ rotate: `${progress * 360}deg` }],
                },
              ]}
            />
            <View style={[styles.timerInner, { backgroundColor: colors.background }]}>
              <Text style={[styles.timerText, { color: colors.text }]}>
                {formatTime(timeLeft)}
              </Text>
              <Text style={[styles.timerLabel, { color: colors.textSecondary }]}>
                {mode === 'focus' ? 'Concentrez-vous' : 'Faites une pause'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: colors.card }]}
            onPress={resetTimer}
          >
            <RotateCcw size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.playButton, { backgroundColor: isRunning ? '#EF4444' : '#3B82F6' }]}
            onPress={toggleTimer}
          >
            {isRunning ? (
              <Pause size={32} color="#FFFFFF" />
            ) : (
              <Play size={32} color="#FFFFFF" style={{ marginLeft: 4 }} />
            )}
          </TouchableOpacity>
          <View style={styles.controlButton} />
        </View>

        <View style={[styles.statsCard, { backgroundColor: colors.card }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {sessionsCompleted}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Sessions aujourd'hui
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {Math.floor((sessionsCompleted * 25) / 60)}h {(sessionsCompleted * 25) % 60}m
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Temps total
            </Text>
          </View>
        </View>
      </View>
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
  title: {
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
  },
  sessionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  sessionText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  modeSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 60,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
  },
  modeButtonActive: {},
  modeButtonText: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  progressRing: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressFill: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: width * 0.35,
  },
  timerInner: {
    width: '85%',
    height: '85%',
    borderRadius: width * 0.3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 64,
    fontFamily: 'Inter_700Bold',
  },
  timerLabel: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    marginTop: 8,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsCard: {
    flexDirection: 'row',
    padding: 24,
    borderRadius: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 20,
  },
});
