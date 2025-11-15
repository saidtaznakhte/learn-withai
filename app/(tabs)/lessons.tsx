import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { FileText, Image as ImageIcon, Mic, Search, Plus } from 'lucide-react-native';
import { LessonCard } from '../../components/LessonCard';
import { useDispatch, useSelector } from 'react-redux';
import { addLesson, selectAllLessons } from '../store/appSlice';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { generateSummaryFromText } from '../../lib/gemini';

export default function LessonsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const lessons = useSelector(selectAllLessons);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddLesson = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newLesson = {
      id: Date.now().toString(),
      title: 'Nouvelle Leçon Manuelle',
      subject: 'Biologie',
      color: '#10B981',
      date: new Date().toISOString(),
      summary: 'Ceci est une nouvelle leçon ajoutée manuellement.',
      type: 'text' as const,
      content: 'Le contenu de cette leçon peut être édité ici.'
    };
    dispatch(addLesson(newLesson));
  };
  
  const processFile = async (fileName: string, type: 'pdf' | 'image' | 'audio') => {
    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Simuler l'extraction de texte à partir de différents types de fichiers
    let extractedText = "Ceci est un texte de remplacement. Le contenu réel du fichier n'est pas lu dans cette démo.";
    let lessonData;

    if (type === 'pdf') {
      extractedText = `La thermodynamique est la branche de la physique qui traite de la chaleur, du travail et de la température, et de leur relation avec l'énergie, le rayonnement et les propriétés physiques de la matière. Le comportement de ces grandeurs est régi par les quatre lois de la thermodynamique qui véhiculent une description quantitative à l'aide de grandeurs macroscopiques mesurables, mais peuvent être expliquées en termes de constituants microscopiques par la mécanique statistique. La thermodynamique s'applique à une grande variété de sujets en science et en ingénierie, en particulier la chimie physique, le génie chimique et le génie mécanique, mais aussi dans des domaines aussi complexes que la météorologie.`;
      lessonData = { title: `Résumé de: ${fileName}`, subject: 'Physique', color: '#3B82F6', type: 'pdf' as const };
    } else if (type === 'image') {
      extractedText = `La photosynthèse est le processus utilisé par les plantes, les algues et certaines bactéries pour convertir l'énergie lumineuse en énergie chimique, à travers un processus qui convertit le dioxyde de carbone et l'eau en glucose (sucre) et en oxygène. C'est un processus fondamental pour la vie sur Terre car il produit l'oxygène que nous respirons et constitue la base de la plupart des chaînes alimentaires. Les chloroplastes dans les cellules végétales sont le site de la photosynthèse.`;
      lessonData = { title: `Notes de: ${fileName}`, subject: 'Biologie', color: '#10B981', type: 'image' as const };
    } else { // audio
      extractedText = `L'histoire de la Révolution française couvre la période allant de l'ouverture des États généraux, le 5 mai 1789, au coup d'État du 18 brumaire de Napoléon Bonaparte, le 9 novembre 1799. C'est un moment crucial de l'histoire de France, marquant la fin de l'Ancien Régime, et le remplacement de la monarchie absolue par une série de régimes plus démocratiques, bien que souvent instables. La Déclaration des droits de l'homme et du citoyen, proclamée en août 1789, est l'un des textes fondamentaux de cette période.`;
      lessonData = { title: `Transcription de: ${fileName}`, subject: 'Histoire', color: '#F59E0B', type: 'audio' as const };
    }

    try {
      const summary = await generateSummaryFromText(extractedText);
      
      const newLesson = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        content: extractedText,
        summary: summary,
        ...lessonData
      };

      dispatch(addLesson(newLesson));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Une erreur inconnue est survenue lors de la génération du résumé.";
      console.error(error);
      Alert.alert(
        "Erreur de l'IA",
        errorMessage
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePickPDF = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
      if (!result.canceled) {
        await processFile(result.assets[0].name, 'pdf');
      }
    } catch (error) {
      console.error("Erreur lors de la sélection du PDF:", error);
    }
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Désolé, nous avons besoin des permissions pour accéder à vos photos !');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) {
      const fileName = result.assets[0].uri.split('/').pop() || 'image.jpg';
      await processFile(fileName, 'image');
    }
  };

  const handlePickAudio = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
      if (!result.canceled) {
        await processFile(result.assets[0].name, 'audio');
      }
    } catch (error) {
      console.error("Erreur lors de la sélection de l'audio:", error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <Modal
        transparent={true}
        animationType="fade"
        visible={isLoading}
      >
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>L'IA génère le résumé...</Text>
        </View>
      </Modal>

      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Mes Leçons</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBox, { backgroundColor: colors.card }]}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            placeholder="Rechercher une leçon..."
            placeholderTextColor={colors.textSecondary}
            style={[styles.searchInput, { color: colors.text }]}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.uploadSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Importer une nouvelle leçon
          </Text>
          <View style={styles.uploadOptions}>
            <TouchableOpacity style={[styles.uploadButton, { backgroundColor: colors.card }]} onPress={handlePickPDF}>
              <FileText size={24} color="#3B82F6" />
              <Text style={[styles.uploadButtonText, { color: colors.text }]}>PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.uploadButton, { backgroundColor: colors.card }]} onPress={handlePickImage}>
              <ImageIcon size={24} color="#8B5CF6" />
              <Text style={[styles.uploadButtonText, { color: colors.text }]}>Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.uploadButton, { backgroundColor: colors.card }]} onPress={handlePickAudio}>
              <Mic size={24} color="#EC4899" />
              <Text style={[styles.uploadButtonText, { color: colors.text }]}>Audio</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.uploadButton, { backgroundColor: colors.card }]} onPress={handleAddLesson}>
              <Plus size={24} color="#F59E0B" />
              <Text style={[styles.uploadButtonText, { color: colors.text }]}>Texte</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.lessonsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Leçons récentes</Text>
          {lessons.map((lesson) => (
            <LessonCard 
              key={lesson.id} 
              lesson={lesson} 
              colors={colors} 
              onPress={() => router.push(`/lesson/${lesson.id}`)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
  },
  uploadSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 16,
  },
  uploadOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  uploadButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    borderRadius: 16,
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  lessonsSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  loadingOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
  },
});
