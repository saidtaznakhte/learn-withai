import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate } from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import * as Haptics from 'expo-haptics';

type FlashcardProps = {
  question: string;
  answer: string;
};

export function Flashcard({ question, answer }: FlashcardProps) {
  const { colors } = useTheme();
  const rotate = useSharedValue(0);
  const isFlipped = useRef(false);

  const flipCard = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    isFlipped.current = !isFlipped.current;
    rotate.value = withTiming(isFlipped.current ? 180 : 0, { duration: 500 });
  };
  
  // Reset flip state when question changes
  React.useEffect(() => {
    isFlipped.current = false;
    rotate.value = 0;
  }, [question]);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const spin = interpolate(rotate.value, [0, 180], [0, 180]);
    return {
      transform: [{ rotateY: `${spin}deg` }],
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const spin = interpolate(rotate.value, [0, 180], [180, 360]);
    return {
      transform: [{ rotateY: `${spin}deg` }],
    };
  });

  return (
    <Pressable onPress={flipCard} style={styles.container}>
      <Animated.View style={[styles.card, styles.cardFront, { backgroundColor: colors.card }, frontAnimatedStyle]}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Question</Text>
        <Text style={[styles.text, { color: colors.text }]}>{question}</Text>
      </Animated.View>
      <Animated.View style={[styles.card, styles.cardBack, { backgroundColor: colors.primary }, backAnimatedStyle]}>
        <Text style={[styles.label, { color: '#FFFFFFCC' }]}>Réponse</Text>
        <Text style={[styles.text, { color: '#FFFFFF' }]}>{answer}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 300,
    perspective: 1000,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    borderRadius: 20,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardFront: {
    // No specific styles needed
  },
  cardBack: {
    // No specific styles needed
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    position: 'absolute',
    top: 20,
    left: 24,
  },
  text: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 22,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});
