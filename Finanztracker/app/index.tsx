import { AppProvider, useAppContext } from './appContext';
import AppNavigator from './appNavigator';

export default function Index() {
    return (
        <AppProvider>
            <AppNavigatorWrapper />
        </AppProvider>
    );
}

function AppNavigatorWrapper() {
    const { isLoggedIn, hasSetupCash } = useAppContext();
    return <AppNavigator isLoggedIn={isLoggedIn} hasSetupCash={hasSetupCash} />;
}
