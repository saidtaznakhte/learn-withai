import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { finishQuiz, selectQuizById } from '../store/appSlice';
import { useTheme } from '../../contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, X } from 'lucide-react-native';

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useDispatch();
  const quiz = useSelector(selectQuizById(id));
  const { colors } = useTheme();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [showResults, setShowResults] = useState(false);

  if (!quiz) {
    return <SafeAreaView><Text>Quiz non trouvé</Text></SafeAreaView>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleSelectAnswer = (option: string) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({ ...prev, [currentQuestion.id]: option }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Finish quiz
      let correctCount = 0;
      quiz.questions.forEach(q => {
        if (selectedAnswers[q.id] === q.correctAnswer) {
          correctCount++;
        }
      });
      const score = Math.round((correctCount / quiz.questions.length) * 100);
      dispatch(finishQuiz({ quizId: quiz.id, score }));
      router.replace({ pathname: '/quiz/results', params: { quizId: quiz.id } });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            Question {currentQuestionIndex + 1} sur {quiz.questions.length}
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { backgroundColor: colors.primary, width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }]} />
          </View>
        </View>

        <Text style={[styles.questionText, { color: colors.text }]}>{currentQuestion.question}</Text>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswers[currentQuestion.id] === option;
            let optionStyle = {};
            if (showResults) {
              if (option === currentQuestion.correctAnswer) {
                optionStyle = styles.correctOption;
              } else if (isSelected) {
                optionStyle = styles.incorrectOption;
              }
            }

            return (
              <TouchableOpacity
                key={index}
                style={[styles.optionButton, { backgroundColor: colors.card, borderColor: isSelected ? colors.primary : colors.border }, optionStyle]}
                onPress={() => handleSelectAnswer(option)}
              >
                <Text style={[styles.optionText, { color: isSelected ? colors.primary : colors.text }]}>{option}</Text>
                {showResults && (
                  <>
                    {option === currentQuestion.correctAnswer && <Check size={20} color="green" />}
                    {isSelected && option !== currentQuestion.correctAnswer && <X size={20} color="red" />}
                  </>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <TouchableOpacity style={[styles.nextButton, { backgroundColor: colors.primary }]} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentQuestionIndex === quiz.questions.length - 1 ? 'Terminer le Quiz' : 'Question Suivante'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, padding: 20 },
  header: { marginBottom: 30 },
  progressText: { fontFamily: 'Inter_500Medium', fontSize: 14, textAlign: 'center', marginBottom: 8 },
  progressBar: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  questionText: { fontSize: 22, fontFamily: 'Inter_600SemiBold', lineHeight: 30, marginBottom: 40, textAlign: 'center' },
  optionsContainer: { gap: 12 },
  optionButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderRadius: 16, borderWidth: 1 },
  optionText: { fontSize: 16, fontFamily: 'Inter_500Medium' },
  correctOption: { borderColor: 'green', backgroundColor: '#D1FAE5' },
  incorrectOption: { borderColor: 'red', backgroundColor: '#FEE2E2' },
  footer: { padding: 20, borderTopWidth: 1 },
  nextButton: { padding: 16, borderRadius: 16, alignItems: 'center' },
  nextButtonText: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Inter_600SemiBold' },
});
