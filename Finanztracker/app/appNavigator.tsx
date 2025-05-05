import { useAppContext } from './appContext';
import Login from './components/login';
import SetCash from './components/SetCash';
import AppDrawer from './appDrawer';
import ChooseMode from "@/app/components/ChooseMode";

export default function AppNavigator() {
    const { isLoggedIn, hasSetupCash, hasChosenMode  } = useAppContext();

    if (!isLoggedIn) {
        return <Login />;
    }

    if (!hasChosenMode) {
        return <ChooseMode />;
    }

    if (!hasSetupCash) {
        return <SetCash />;
    }

    return <AppDrawer />;
}
