import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { selectFlashcardSetById } from '../store/appSlice';
import { useTheme } from '../../contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Flashcard } from '../../components/Flashcard';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function FlashcardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const flashcardSet = useSelector(selectFlashcardSetById(id));
  const { colors } = useTheme();

  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  if (!flashcardSet) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text, textAlign: 'center', marginTop: 20 }}>Set de flashcards non trouvé.</Text>
      </SafeAreaView>
    );
  }

  const handleNext = () => {
    if (currentCardIndex < flashcardSet.cards.length - 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrentCardIndex(prev => prev + 1);
    }
  };
  
  const handlePrev = () => {
    if (currentCardIndex > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrentCardIndex(prev => prev - 1);
    }
  };

  const currentCard = flashcardSet.cards[currentCardIndex];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <View style={styles.content}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>{flashcardSet.title}</Text>
          <Text style={[styles.progress, { color: colors.textSecondary }]}>
            Carte {currentCardIndex + 1} sur {flashcardSet.cards.length}
          </Text>
        </View>

        <View style={styles.flashcardContainer}>
          <Flashcard question={currentCard.question} answer={currentCard.answer} />
        </View>

        <View>
          <View style={styles.navigation}>
            <TouchableOpacity 
              style={[styles.navButton, { backgroundColor: colors.card }]} 
              onPress={handlePrev}
              disabled={currentCardIndex === 0}
            >
              <ChevronLeft size={24} color={currentCardIndex === 0 ? colors.textSecondary : colors.text} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.navButton, { backgroundColor: colors.card }]} 
              onPress={handleNext}
              disabled={currentCardIndex === flashcardSet.cards.length - 1}
            >
              <ChevronRight size={24} color={currentCardIndex === flashcardSet.cards.length - 1 ? colors.textSecondary : colors.text} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={[styles.finishButton, { backgroundColor: colors.primary }]} onPress={() => router.back()}>
            <Text style={styles.finishButtonText}>Terminer la session</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
  },
  progress: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
    marginTop: 8,
  },
  flashcardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
navigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  navButton: {
    padding: 20,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  finishButton: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  finishButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});
