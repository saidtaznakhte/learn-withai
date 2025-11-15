import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { Send, Sparkles } from 'lucide-react-native';
import { ChatMessage } from '../../components/ChatMessage';
import { useDispatch, useSelector } from 'react-redux';
import { addChatMessage, selectChatMessages } from '../store/appSlice';

export default function ChatScreen() {
  const { colors } = useTheme();
  const [message, setMessage] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const dispatch = useDispatch();
  const messages = useSelector(selectChatMessages);

  const handleSend = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: message,
        isAI: false,
        timestamp: new Date().toISOString(),
      };
      dispatch(addChatMessage(newMessage));
      setMessage('');

      setTimeout(() => {
        const aiResponse = {
          id: (Date.now() + 1).toString(),
          text: 'Je comprends votre question. Laissez-moi vous expliquer en détail...',
          isAI: true,
          timestamp: new Date().toISOString(),
        };
        dispatch(addChatMessage(aiResponse));
      }, 1000);
    }
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={[styles.aiAvatar, { backgroundColor: '#3B82F6' }]}>
            <Sparkles size={20} color="#FFFFFF" />
          </View>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Tuteur IA</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Disponible 24/7
            </Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} colors={colors} />
          ))}
        </ScrollView>

        <View style={[styles.inputContainer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Posez votre question..."
            placeholderTextColor={colors.textSecondary}
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: message.trim() ? '#3B82F6' : colors.border }]}
            onPress={handleSend}
            disabled={!message.trim()}
          >
            <Send size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  keyboardView: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
