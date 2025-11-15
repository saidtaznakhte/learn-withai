import { View, Text, StyleSheet } from 'react-native';
import { Sparkles } from 'lucide-react-native';

type ChatMessageProps = {
  message: {
    text: string;
    isAI: boolean;
    timestamp: string;
  };
  colors: any;
};

export function ChatMessage({ message, colors }: ChatMessageProps) {
  return (
    <View style={[styles.container, message.isAI ? styles.aiMessage : styles.userMessage]}>
      {message.isAI && (
        <View style={styles.aiAvatar}>
          <Sparkles size={16} color="#3B82F6" />
        </View>
      )}
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: message.isAI ? colors.card : '#3B82F6',
            alignSelf: message.isAI ? 'flex-start' : 'flex-end',
          },
        ]}
      >
        <Text style={[styles.text, { color: message.isAI ? colors.text : '#FFFFFF' }]}>
          {message.text}
        </Text>
        <Text style={[styles.timestamp, { color: message.isAI ? colors.textSecondary : '#E0E7FF' }]}>
          {new Date(message.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  aiMessage: {
    flexDirection: 'row',
    gap: 8,
  },
  userMessage: {
    flexDirection: 'row-reverse',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
  },
  text: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
});
