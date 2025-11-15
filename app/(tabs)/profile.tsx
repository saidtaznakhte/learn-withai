import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { User, Moon, Sun, Bell, Languages, HelpCircle, LogOut, ChevronRight } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { resetState, selectStats } from '../store/appSlice';

export default function ProfileScreen() {
  const { colors, theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const stats = useSelector(selectStats);

  const menuItems = [
    { id: '1', icon: Bell, label: 'Notifications', hasSwitch: true },
    { id: '2', icon: Languages, label: 'Langue', value: 'Français' },
    { id: '3', icon: HelpCircle, label: 'Aide et support' },
  ];

  const handleLogout = () => {
    Alert.alert(
      "Se déconnecter",
      "Êtes-vous sûr de vouloir vous déconnecter ? Votre progression sera réinitialisée.",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Déconnecter", style: "destructive", onPress: () => dispatch(resetState()) }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Profil</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
          <View style={[styles.avatar, { backgroundColor: '#3B82F6' }]}>
            <User size={40} color="#FFFFFF" />
          </View>
          <Text style={[styles.userName, { color: colors.text }]}>Étudiant</Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
            etudiant@studymate.ai
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.statValue, { color: colors.text }]}>{stats.lessonsStudied}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Leçons</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.statValue, { color: colors.text }]}>{stats.points}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Points</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.statValue, { color: colors.text }]}>{stats.successRate}%</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Moyenne</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Apparence</Text>
          <View style={[styles.menuItem, { backgroundColor: colors.card }]}>
            <View style={styles.menuItemLeft}>
              {theme === 'light' ? (
                <Sun size={22} color={colors.text} />
              ) : (
                <Moon size={22} color={colors.text} />
              )}
              <Text style={[styles.menuItemLabel, { color: colors.text }]}>
                Mode {theme === 'light' ? 'clair' : 'sombre'}
              </Text>
            </View>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Paramètres</Text>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, { backgroundColor: colors.card }]}
            >
              <View style={styles.menuItemLeft}>
                <item.icon size={22} color={colors.text} />
                <Text style={[styles.menuItemLabel, { color: colors.text }]}>
                  {item.label}
                </Text>
              </View>
              {item.hasSwitch ? (
                <Switch
                  value={true}
                  trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                  thumbColor="#FFFFFF"
                />
              ) : (
                <View style={styles.menuItemRight}>
                  {item.value && (
                    <Text style={[styles.menuItemValue, { color: colors.textSecondary }]}>
                      {item.value}
                    </Text>
                  )}
                  <ChevronRight size={20} color={colors.textSecondary} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.card }]} onPress={handleLogout}>
          <LogOut size={22} color="#EF4444" />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
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
  profileCard: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 16,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemLabel: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuItemValue: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginHorizontal: 20,
    marginBottom: 40,
    padding: 16,
    borderRadius: 16,
  },
  logoutText: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: '#EF4444',
  },
});
