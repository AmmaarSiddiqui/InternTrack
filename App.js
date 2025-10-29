import 'react-native-gesture-handler';
import AppNavigator from './app/navigation/AppNavigator';
import { AuthProvider } from './app/state/useAuthContext';

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

